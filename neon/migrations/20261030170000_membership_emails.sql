-- AIPEX membership notifications only. No credentials or recipients come from forms.
-- Apply to AIPEX Learning / empty-block-17582000 / br-dawn-union-zamwo3z4.
begin;

create table public.membership_email_settings (
  singleton boolean primary key default true check (singleton),
  dispatch_secret_hash bytea not null check (pg_catalog.octet_length(dispatch_secret_hash) = 32)
);
-- The operator sets a random server-only dispatch secret separately. No default
-- secret is supplied and this migration never backfills historical applications.

create table public.membership_email_outbox (
  event_id uuid primary key default pg_catalog.gen_random_uuid(),
  applicant_user_id uuid not null references public.membership_applications(user_id) on delete cascade,
  kind text not null check (kind in ('founder_alert', 'application_received', 'application_approved', 'application_declined')),
  template_version integer not null default 1 check (template_version = 1),
  recipient_email text not null check (pg_catalog.char_length(recipient_email) between 3 and 254 and recipient_email !~ E'[\r\n]'),
  applicant_name text not null,
  applicant_role text not null,
  applicant_organisation text not null,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed', 'needs_review')),
  first_attempt_at timestamptz,
  last_attempt_at timestamptz,
  attempts integer not null default 0 check (attempts between 0 and 5),
  next_attempt_at timestamptz not null default now(),
  lease_token uuid,
  lease_expires_at timestamptz,
  provider_id text check (provider_id is null or pg_catalog.char_length(provider_id) between 1 and 200),
  last_error text check (last_error is null or pg_catalog.char_length(last_error) between 1 and 200),
  sent_at timestamptz,
  unique (applicant_user_id, kind),
  check (kind <> 'founder_alert' or recipient_email = 'green.jcb@gmail.com'),
  check ((status = 'sent') = (provider_id is not null and sent_at is not null)),
  check (status <> 'sending' or (lease_token is not null and lease_expires_at is not null))
);
create index membership_email_outbox_due on public.membership_email_outbox (next_attempt_at, created_at, event_id)
  where status in ('pending', 'sending');
create index membership_email_outbox_applicant on public.membership_email_outbox (applicant_user_id, status);

alter table public.membership_email_settings enable row level security;
alter table public.membership_email_outbox enable row level security;
revoke all on public.membership_email_settings, public.membership_email_outbox from public, anonymous, authenticated;

create function public._membership_enqueue_emails() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' and new.status = 'pending' then
    insert into public.membership_email_outbox (
      applicant_user_id, kind, recipient_email, applicant_name, applicant_role, applicant_organisation
    ) values
      (new.user_id, 'founder_alert', 'green.jcb@gmail.com', new.full_name, new.role, new.organisation),
      (new.user_id, 'application_received', new.email, new.full_name, new.role, new.organisation)
    on conflict (applicant_user_id, kind) do nothing;
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status in ('approved', 'declined') then
    insert into public.membership_email_outbox (
      applicant_user_id, kind, recipient_email, applicant_name, applicant_role, applicant_organisation
    ) values (
      new.user_id, 'application_' || new.status, new.email, new.full_name, new.role, new.organisation
    ) on conflict (applicant_user_id, kind) do nothing;
  end if;
  return new;
end;
$$;
create trigger membership_enqueue_application_emails
  after insert on public.membership_applications
  for each row execute function public._membership_enqueue_emails();
create trigger membership_enqueue_decision_email
  after update of status on public.membership_applications
  for each row execute function public._membership_enqueue_emails();

-- Both factors are mandatory. A browser JWT cannot claim or mark a message sent,
-- and the server secret alone is not an authenticated membership identity.
create function public._membership_email_dispatch_actor(p_dispatch_secret text) returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare
  actor uuid := public._membership_verified_user_id();
  expected_hash bytea;
begin
  select settings.dispatch_secret_hash into expected_hash
    from public.membership_email_settings settings where settings.singleton = true;
  if expected_hash is null then
    raise exception using errcode = '55000', message = 'email_dispatch_not_configured';
  end if;
  if p_dispatch_secret is null or pg_catalog.char_length(p_dispatch_secret) not between 32 and 512
    or pg_catalog.sha256(pg_catalog.convert_to(p_dispatch_secret, 'UTF8')) is distinct from expected_hash then
    raise exception using errcode = '42501', message = 'email_dispatch_forbidden';
  end if;
  return actor;
end;
$$;

create function public.claim_membership_emails(
  p_dispatch_secret text, p_user_id uuid default null, p_limit integer default 5
) returns table (
  event_id uuid, lease_token uuid, kind text, recipient_email text,
  applicant_name text, applicant_role text, applicant_organisation text,
  template_version integer, created_at timestamptz, first_attempt_at timestamptz, attempts integer
)
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := public._membership_email_dispatch_actor(p_dispatch_secret);
  reviewer boolean := public.membership_is_reviewer();
  claimed_at timestamptz := pg_catalog.clock_timestamp();
begin
  if p_limit is null or p_limit not between 1 and 10 then
    raise exception using errcode = '22023', message = 'invalid_email_batch';
  end if;
  if p_user_id is not null and p_user_id <> actor and not reviewer then
    raise exception using errcode = '42501', message = 'email_dispatch_forbidden';
  end if;

  -- Resend's idempotency window is 24 hours. Stop one hour before its edge,
  -- including uncertain sends whose acknowledgement was lost. Never silently
  -- issue a fresh key or automatically resend after that window.
  update public.membership_email_outbox queued set
    status = 'needs_review', last_error = 'idempotency_window_requires_review',
    lease_expires_at = null
  where (reviewer or queued.applicant_user_id = actor)
    and (p_user_id is null or queued.applicant_user_id = p_user_id)
    and queued.status in ('pending', 'sending')
    and (queued.status <> 'sending' or queued.lease_expires_at <= claimed_at)
    and queued.first_attempt_at is not null
    and (queued.first_attempt_at <= claimed_at - interval '23 hours' or queued.attempts >= 5);

  return query
  with available as (
    select queued.event_id from public.membership_email_outbox queued
    where (reviewer or queued.applicant_user_id = actor)
      and (p_user_id is null or queued.applicant_user_id = p_user_id)
      and queued.attempts < 5
      and ((queued.status = 'pending' and queued.next_attempt_at <= claimed_at)
        or (queued.status = 'sending' and queued.lease_expires_at <= claimed_at))
    order by queued.created_at, queued.event_id
    limit p_limit for update skip locked
  ), claimed as (
    update public.membership_email_outbox queued set
      status = 'sending', lease_token = pg_catalog.gen_random_uuid(),
      lease_expires_at = claimed_at + interval '5 minutes',
      first_attempt_at = coalesce(queued.first_attempt_at, claimed_at),
      last_attempt_at = claimed_at, attempts = queued.attempts + 1
    from available where queued.event_id = available.event_id
    returning queued.*
  )
  select claimed.event_id, claimed.lease_token, claimed.kind, claimed.recipient_email,
    claimed.applicant_name, claimed.applicant_role, claimed.applicant_organisation,
    claimed.template_version, claimed.created_at, claimed.first_attempt_at, claimed.attempts
  from claimed order by claimed.created_at, claimed.event_id;
end;
$$;

create function public.finish_membership_email(
  p_dispatch_secret text, p_event_id uuid, p_lease_token uuid,
  p_provider_id text default null, p_error text default null, p_retryable boolean default false
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := public._membership_email_dispatch_actor(p_dispatch_secret);
  message public.membership_email_outbox%rowtype;
  finished_at timestamptz := pg_catalog.clock_timestamp();
begin
  if p_event_id is null or p_lease_token is null or p_retryable is null
    or (p_provider_id is null) = (p_error is null)
    or (p_provider_id is not null and (pg_catalog.char_length(p_provider_id) not between 1 and 200 or p_provider_id ~ E'[\r\n]'))
    or (p_error is not null and (pg_catalog.char_length(p_error) not between 1 and 200 or p_error ~ E'[\r\n]')) then
    raise exception using errcode = '22023', message = 'invalid_email_result';
  end if;
  select queued.* into message from public.membership_email_outbox queued
    where queued.event_id = p_event_id for update;
  if not found or (message.applicant_user_id <> actor and not public.membership_is_reviewer()) then
    raise exception using errcode = '42501', message = 'email_dispatch_forbidden';
  end if;
  if message.lease_token is distinct from p_lease_token then
    raise exception using errcode = '40001', message = 'email_lease_changed';
  end if;
  if message.status = 'sent' and message.provider_id is not distinct from p_provider_id then
    return true; -- Retrying the same successful acknowledgement is harmless.
  end if;
  if message.status <> 'sending' then
    raise exception using errcode = '40001', message = 'email_lease_changed';
  end if;

  if p_provider_id is not null then
    update public.membership_email_outbox queued set status = 'sent',
      provider_id = p_provider_id, sent_at = finished_at, last_error = null, lease_expires_at = null
      where queued.event_id = p_event_id;
  else
    update public.membership_email_outbox queued set
      status = case
        when p_retryable and message.first_attempt_at <= finished_at - interval '23 hours' then 'needs_review'
        when p_retryable and message.attempts < 5 then 'pending'
        else 'failed' end,
      last_error = p_error, lease_expires_at = null,
      next_attempt_at = finished_at + pg_catalog.make_interval(secs => least(3600, 30 * (2 ^ (message.attempts - 1)))::integer)
      where queued.event_id = p_event_id;
  end if;
  return true;
end;
$$;

create function public.membership_email_counts() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform public._membership_verified_user_id();
  if not public.membership_is_reviewer() then
    raise exception using errcode = '42501', message = 'reviewer_required';
  end if;
  return (select pg_catalog.jsonb_build_object(
    'pending', pg_catalog.count(*) filter (where queued.status = 'pending'),
    'sending', pg_catalog.count(*) filter (where queued.status = 'sending'),
    'sent', pg_catalog.count(*) filter (where queued.status = 'sent'),
    'failed', pg_catalog.count(*) filter (where queued.status = 'failed'),
    'needs_review', pg_catalog.count(*) filter (where queued.status = 'needs_review')
  ) from public.membership_email_outbox queued);
end;
$$;

revoke all on function public._membership_enqueue_emails(),
  public._membership_email_dispatch_actor(text), public.claim_membership_emails(text, uuid, integer),
  public.finish_membership_email(text, uuid, uuid, text, text, boolean), public.membership_email_counts()
  from public, anonymous, authenticated;
grant execute on function public.claim_membership_emails(text, uuid, integer),
  public.finish_membership_email(text, uuid, uuid, text, text, boolean), public.membership_email_counts()
  to authenticated;

notify pgrst, 'reload schema';
commit;
