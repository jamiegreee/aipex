-- AIPEX only: application first, account creation after approval.
-- Existing memberships, reviewer permissions and historical email events stay intact.
-- The web server uses an anonymous Data API token plus its existing server-only
-- dispatch secret for the narrow intake/outbox functions. No owner URL is needed.
begin;

create table public.membership_requests (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  email text not null check (
    public._membership_text_valid(email, 3, 254)
    and email = pg_catalog.lower(pg_catalog.btrim(email))
    and pg_catalog.char_length(pg_catalog.split_part(email, '@', 1)) between 1 and 64
    and pg_catalog.split_part(email, '@', 1) !~ '(^\.|\.$|\.\.)'
    and email ~ $email$^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$$email$
  ),
  full_name text not null check (public._membership_text_valid(full_name, 2, 100)),
  role text not null check (public._membership_text_valid(role, 2, 120)),
  organisation text not null check (public._membership_text_valid(organisation, 2, 160)),
  country text not null check (public._membership_text_valid(country, 2, 100)),
  profile_url text not null default '' check (profile_url = '' or (
    pg_catalog.char_length(profile_url) <= 300
    and profile_url ~ '^https://(www\.)?linkedin\.com/in/[A-Za-z0-9%._~-]+/?$'
  )),
  interests text[] not null check (public._membership_interests_valid(interests)),
  motivation text not null check (public._membership_text_valid(motivation, 40, 1500, true)),
  contribution text not null default '' check (public._membership_text_valid(contribution, 0, 1000, true)),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references neon_auth."user"(id) on delete set null,
  linked_user_id uuid unique references neon_auth."user"(id) on delete cascade,
  archived_at timestamptz,
  check ((status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (status <> 'pending' and reviewed_at is not null)),
  check (linked_user_id is null or (status = 'approved' and archived_at is null)),
  check (archived_at is null or status = 'pending')
);
create unique index membership_requests_email_unique on public.membership_requests (pg_catalog.lower(email));
create index membership_requests_review_queue on public.membership_requests (status, created_at, id)
  where archived_at is null and linked_user_id is null;

create table public.membership_request_reviews (
  id bigint generated always as identity primary key,
  request_id uuid not null references public.membership_requests(id) on delete cascade,
  reviewer_user_id uuid references neon_auth."user"(id) on delete set null,
  decision text not null check (decision in ('approved', 'declined')),
  reviewed_at timestamptz not null default now()
);

-- Opaque HMAC identities only; no raw IP address is stored. Rolling windows
-- survive serverless restarts and are checked under one transaction lock.
create table public.membership_request_rate_events (
  id bigint generated always as identity primary key,
  rate_key text not null check (rate_key ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);
create index membership_request_rate_time on public.membership_request_rate_events (created_at);
create index membership_request_rate_identity on public.membership_request_rate_events (rate_key, created_at);

create table public.membership_request_emails (
  event_id uuid primary key default pg_catalog.gen_random_uuid(),
  request_id uuid not null references public.membership_requests(id) on delete cascade,
  kind text not null check (kind in ('founder_alert', 'application_received', 'application_approved', 'application_declined')),
  template_version integer not null default 4 check (template_version = 4),
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
  unique (request_id, kind),
  check (kind <> 'founder_alert' or recipient_email = 'green.jcb@gmail.com'),
  check ((status = 'sent') = (provider_id is not null and sent_at is not null)),
  check (status <> 'sending' or (lease_token is not null and lease_expires_at is not null))
);
create index membership_request_emails_due on public.membership_request_emails (next_attempt_at, created_at, event_id)
  where status in ('pending', 'sending');
create index membership_request_emails_request on public.membership_request_emails (request_id, status);

alter table public.membership_requests enable row level security;
alter table public.membership_request_reviews enable row level security;
alter table public.membership_request_rate_events enable row level security;
alter table public.membership_request_emails enable row level security;
revoke all on public.membership_requests, public.membership_request_reviews,
  public.membership_request_rate_events, public.membership_request_emails from public, anonymous, authenticated;
revoke all on sequence public.membership_request_reviews_id_seq, public.membership_request_rate_events_id_seq
  from public, anonymous, authenticated;

create function public._membership_request_readable(p_linked_user_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.membership_is_reviewer() or exists (
    select 1 from neon_auth."user" u
    where u.id = auth.uid() and u.id = p_linked_user_id
      and coalesce((pg_catalog.to_jsonb(u)->>'emailVerified')::boolean,
        (pg_catalog.to_jsonb(u)->>'email_verified')::boolean, false)
  );
$$;
grant select on public.membership_requests, public.membership_request_reviews to authenticated;
create policy membership_requests_read on public.membership_requests
  for select to authenticated using (public._membership_request_readable(linked_user_id));
create policy membership_request_reviews_read on public.membership_request_reviews
  for select to authenticated using ((select public.membership_is_reviewer()));

-- One correctly paginated queue across pre-account and historical applicants.
-- The view must execute as its caller so underlying RLS is never bypassed.
create view public.membership_review_queue with (security_invoker = true) as
  select a.user_id as id, 'account'::text as source, a.email, a.full_name,
    a.role, a.organisation, a.country, a.profile_url, a.interests, a.motivation,
    a.contribution, a.status, a.created_at, a.updated_at, a.reviewed_at, a.reviewed_by
  from public.membership_applications a where a.archived_at is null
  union all
  select r.id, 'request'::text as source, r.email, r.full_name,
    r.role, r.organisation, r.country, r.profile_url, r.interests, r.motivation,
    r.contribution, r.status, r.created_at, r.updated_at, r.reviewed_at, r.reviewed_by
  from public.membership_requests r where r.archived_at is null and r.linked_user_id is null;
revoke all on public.membership_review_queue from public, anonymous, authenticated;
grant select on public.membership_review_queue to authenticated;

-- This does not replace or weaken the legacy dispatch identity check. Only the
-- separate pre-account intake/outbox RPCs use this server-only capability.
create function public._membership_public_secret(p_dispatch_secret text) returns void
language plpgsql stable security definer set search_path = '' as $$
declare expected_hash bytea;
begin
  select s.dispatch_secret_hash into expected_hash from public.membership_email_settings s where s.singleton;
  if expected_hash is null then
    raise exception using errcode = '55000', message = 'email_dispatch_not_configured';
  end if;
  if p_dispatch_secret is null or pg_catalog.char_length(p_dispatch_secret) not between 32 and 512
    or pg_catalog.sha256(pg_catalog.convert_to(p_dispatch_secret, 'UTF8')) is distinct from expected_hash then
    raise exception using errcode = '42501', message = 'email_dispatch_forbidden';
  end if;
end;
$$;

-- Read-only readiness probe for the server before exposing the public form.
-- Successful execution proves the transactional migration and secret setup.
create function public.public_membership_available(p_dispatch_secret text) returns boolean
language plpgsql stable security definer set search_path = '' as $$
begin
  perform public._membership_public_secret(p_dispatch_secret);
  return true;
end;
$$;

create function public._membership_enqueue_request_emails() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' and new.status = 'pending' then
    insert into public.membership_request_emails
      (request_id, kind, recipient_email, applicant_name, applicant_role, applicant_organisation)
    values
      (new.id, 'founder_alert', 'green.jcb@gmail.com', new.full_name, new.role, new.organisation),
      (new.id, 'application_received', new.email, new.full_name, new.role, new.organisation)
    on conflict (request_id, kind) do nothing;
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status in ('approved', 'declined') then
    insert into public.membership_request_emails
      (request_id, kind, recipient_email, applicant_name, applicant_role, applicant_organisation)
    values (new.id, 'application_' || new.status, new.email, new.full_name, new.role, new.organisation)
    on conflict (request_id, kind) do nothing;
  end if;
  return new;
end;
$$;
create trigger membership_requests_enqueue_application after insert on public.membership_requests
  for each row execute function public._membership_enqueue_request_emails();
create trigger membership_requests_enqueue_decision after update of status on public.membership_requests
  for each row execute function public._membership_enqueue_request_emails();

create function public.submit_public_membership(
  p_dispatch_secret text, p_application jsonb, p_rate_key text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  input_key text;
  applicant_email text;
  selected_interests text[];
  request_id uuid;
  submitted_at timestamptz := pg_catalog.clock_timestamp();
begin
  perform public._membership_public_secret(p_dispatch_secret);
  if p_rate_key is null or p_rate_key !~ '^[0-9a-f]{64}$'
    or pg_catalog.jsonb_typeof(p_application) is distinct from 'object'
    or pg_catalog.octet_length(p_application::text) > 20000
    or p_application->'agreement' is distinct from 'true'::jsonb then
    raise exception using errcode = '22023', message = 'invalid_application';
  end if;
  if exists (select 1 from pg_catalog.jsonb_object_keys(p_application) k
    where k not in ('email', 'fullName', 'role', 'organisation', 'country', 'profileUrl', 'interests', 'motivation', 'contribution', 'agreement')) then
    raise exception using errcode = '22023', message = 'invalid_application';
  end if;
  foreach input_key in array array['email', 'fullName', 'role', 'organisation', 'country', 'motivation'] loop
    if pg_catalog.jsonb_typeof(p_application->input_key) is distinct from 'string' then
      raise exception using errcode = '22023', message = 'invalid_application';
    end if;
  end loop;
  foreach input_key in array array['profileUrl', 'contribution'] loop
    if p_application ? input_key and pg_catalog.jsonb_typeof(p_application->input_key) is distinct from 'string' then
      raise exception using errcode = '22023', message = 'invalid_application';
    end if;
  end loop;
  if pg_catalog.jsonb_typeof(p_application->'interests') is distinct from 'array' then
    raise exception using errcode = '22023', message = 'invalid_application';
  end if;
  if exists (select 1 from pg_catalog.jsonb_array_elements(p_application->'interests') item
      where pg_catalog.jsonb_typeof(item) <> 'string') then
    raise exception using errcode = '22023', message = 'invalid_application';
  end if;
  selected_interests := array(select pg_catalog.jsonb_array_elements_text(p_application->'interests'));
  if not public._membership_interests_valid(selected_interests) then
    raise exception using errcode = '22023', message = 'invalid_application';
  end if;
  applicant_email := pg_catalog.lower(pg_catalog.btrim(p_application->>'email'));

  -- Serialize intake limits and duplicate detection. A duplicate never changes
  -- its answers/decision or creates another email, and returns no private row.
  perform pg_catalog.pg_advisory_xact_lock(736583824231::bigint);
  if exists (select 1 from public.membership_requests r where pg_catalog.lower(r.email) = applicant_email)
    or exists (select 1 from public.membership_applications a where pg_catalog.lower(a.email) = applicant_email) then
    return null;
  end if;
  delete from public.membership_request_rate_events r where r.created_at < submitted_at - interval '2 days';
  if (select pg_catalog.count(*) from public.membership_request_rate_events r
        where r.rate_key = p_rate_key and r.created_at > submitted_at - interval '1 hour') >= 5
    or (select pg_catalog.count(*) from public.membership_request_rate_events r
        where r.rate_key = p_rate_key and r.created_at > submitted_at - interval '1 day') >= 10
    or (select pg_catalog.count(*) from public.membership_request_rate_events r
        where r.created_at > submitted_at - interval '1 hour') >= 50
    or (select pg_catalog.count(*) from public.membership_request_rate_events r
        where r.created_at > submitted_at - interval '1 day') >= 100 then
    raise exception using errcode = 'P0001', message = 'membership_rate_limited';
  end if;
  insert into public.membership_requests
    (email, full_name, role, organisation, country, profile_url, interests, motivation, contribution)
  values (
    applicant_email,
    pg_catalog.btrim(p_application->>'fullName', E' \t\r\n'),
    pg_catalog.btrim(p_application->>'role', E' \t\r\n'),
    pg_catalog.btrim(p_application->>'organisation', E' \t\r\n'),
    pg_catalog.btrim(p_application->>'country', E' \t\r\n'),
    pg_catalog.btrim(coalesce(p_application->>'profileUrl', ''), E' \t\r\n'),
    selected_interests,
    pg_catalog.btrim(p_application->>'motivation', E' \t\r\n'),
    pg_catalog.btrim(coalesce(p_application->>'contribution', ''), E' \t\r\n')
  ) returning id into request_id;
  insert into public.membership_request_rate_events(rate_key, created_at) values (p_rate_key, submitted_at);
  return request_id;
end;
$$;

create function public.review_public_membership(
  p_request_id uuid, p_decision text, p_expected_updated_at timestamptz
) returns setof public.membership_requests
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := public._membership_verified_user_id();
  application public.membership_requests%rowtype;
  decision_time timestamptz;
begin
  if not public.membership_is_reviewer() then
    raise exception using errcode = '42501', message = 'reviewer_required';
  end if;
  if p_request_id is null or p_decision is null or p_decision not in ('approved', 'declined') or p_expected_updated_at is null then
    raise exception using errcode = '22023', message = 'invalid_decision';
  end if;
  select r.* into application from public.membership_requests r where r.id = p_request_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'application_not_found';
  end if;
  if application.status <> 'pending' or application.archived_at is not null
    or application.updated_at is distinct from p_expected_updated_at then
    raise exception using errcode = '40001', message = 'application_changed';
  end if;
  decision_time := pg_catalog.clock_timestamp();
  update public.membership_requests r set status = p_decision, reviewed_at = decision_time,
    reviewed_by = actor, updated_at = decision_time where r.id = p_request_id;
  insert into public.membership_request_reviews(request_id, reviewer_user_id, decision, reviewed_at)
    values (p_request_id, actor, p_decision, decision_time);
  return query select r.* from public.membership_requests r where r.id = p_request_id;
end;
$$;

create function public.public_membership_counts() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform public._membership_verified_user_id();
  if not public.membership_is_reviewer() then
    raise exception using errcode = '42501', message = 'reviewer_required';
  end if;
  return (select pg_catalog.jsonb_build_object(
    'pending', pg_catalog.count(*) filter (where r.status = 'pending'),
    'approved', pg_catalog.count(*) filter (where r.status = 'approved'),
    'declined', pg_catalog.count(*) filter (where r.status = 'declined')
  ) from public.membership_requests r where r.archived_at is null and r.linked_user_id is null);
end;
$$;

create function public.claim_approved_membership() returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := public._membership_verified_user_id();
  actor_email text;
  application public.membership_requests%rowtype;
  existing public.membership_applications%rowtype;
begin
  -- Never accept an applicant ID or email from the browser as authority.
  select pg_catalog.lower(u.email) into actor_email from neon_auth."user" u where u.id = actor;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('aipex-member-claim:' || actor::text, 0));
  select r.* into application from public.membership_requests r
    where r.email = actor_email and r.status = 'approved' and r.archived_at is null
      and (r.linked_user_id is null or r.linked_user_id = actor) for update;
  if not found then
    return public.membership_is_reviewer() or exists (
      select 1 from public.membership_applications a where a.user_id = actor and a.status = 'approved' and a.archived_at is null
    );
  end if;
  select a.* into existing from public.membership_applications a where a.user_id = actor for update;
  if found then
    if existing.status <> 'approved' or existing.archived_at is not null then
      raise exception using errcode = '40001', message = 'membership_application_conflict';
    end if;
  else
    insert into public.membership_applications
      (user_id, email, full_name, role, organisation, country, profile_url, interests, motivation,
        contribution, status, created_at, updated_at, reviewed_at, reviewed_by)
    values (actor, application.email, application.full_name, application.role, application.organisation,
      application.country, application.profile_url, application.interests, application.motivation,
      application.contribution, 'approved', application.created_at, application.updated_at,
      application.reviewed_at, application.reviewed_by);
    insert into public.membership_reviews(applicant_user_id, reviewer_user_id, decision, reviewed_at)
      values (actor, application.reviewed_by, 'approved', application.reviewed_at);
  end if;
  update public.membership_requests r set linked_user_id = actor
    where r.id = application.id and r.linked_user_id is null;
  return true;
end;
$$;

create function public.claim_public_membership_emails(
  p_dispatch_secret text, p_request_id uuid default null, p_limit integer default 5
) returns table (
  event_id uuid, lease_token uuid, kind text, recipient_email text,
  applicant_name text, applicant_role text, applicant_organisation text,
  template_version integer, created_at timestamptz, first_attempt_at timestamptz, attempts integer
)
language plpgsql security definer set search_path = '' as $$
declare claimed_at timestamptz := pg_catalog.clock_timestamp();
begin
  perform public._membership_public_secret(p_dispatch_secret);
  -- Anonymous/background intake dispatch may address only its one request.
  -- Only a live verified reviewer can flush the entire new outbox.
  if p_request_id is null then
    -- A guest JWT may use a non-UUID subject such as "anonymous". Do not call
    -- identity helpers at all for the one-request path, and fail closed when
    -- an invalid subject attempts a reviewer-wide flush.
    begin
      if not public.membership_is_reviewer() then
        raise exception using errcode = '42501', message = 'email_dispatch_forbidden';
      end if;
    exception when invalid_text_representation then
      raise exception using errcode = '42501', message = 'email_dispatch_forbidden';
    end;
  end if;
  if p_limit is null or p_limit not between 1 and 10 then
    raise exception using errcode = '22023', message = 'invalid_email_batch';
  end if;
  update public.membership_request_emails queued set status = 'needs_review',
    last_error = 'idempotency_window_requires_review', lease_expires_at = null
  where (p_request_id is null or queued.request_id = p_request_id)
    and queued.status in ('pending', 'sending')
    and (queued.status <> 'sending' or queued.lease_expires_at <= claimed_at)
    and queued.first_attempt_at is not null
    and (queued.first_attempt_at <= claimed_at - interval '23 hours' or queued.attempts >= 5);
  return query
  with available as (
    select queued.event_id from public.membership_request_emails queued
    where (p_request_id is null or queued.request_id = p_request_id)
      and queued.attempts < 5
      and ((queued.status = 'pending' and queued.next_attempt_at <= claimed_at)
        or (queued.status = 'sending' and queued.lease_expires_at <= claimed_at))
    order by queued.created_at, queued.event_id limit p_limit for update skip locked
  ), claimed as (
    update public.membership_request_emails queued set status = 'sending',
      lease_token = pg_catalog.gen_random_uuid(), lease_expires_at = claimed_at + interval '5 minutes',
      first_attempt_at = coalesce(queued.first_attempt_at, claimed_at),
      last_attempt_at = claimed_at, attempts = queued.attempts + 1
    from available where queued.event_id = available.event_id returning queued.*
  )
  select claimed.event_id, claimed.lease_token, claimed.kind, claimed.recipient_email,
    claimed.applicant_name, claimed.applicant_role, claimed.applicant_organisation,
    claimed.template_version, claimed.created_at, claimed.first_attempt_at, claimed.attempts
  from claimed order by claimed.created_at, claimed.event_id;
end;
$$;

create function public.finish_public_membership_email(
  p_dispatch_secret text, p_event_id uuid, p_lease_token uuid,
  p_provider_id text default null, p_error text default null, p_retryable boolean default false
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare message public.membership_request_emails%rowtype;
  finished_at timestamptz := pg_catalog.clock_timestamp();
begin
  perform public._membership_public_secret(p_dispatch_secret);
  if p_event_id is null or p_lease_token is null or p_retryable is null
    or (p_provider_id is null) = (p_error is null)
    or (p_provider_id is not null and (pg_catalog.char_length(p_provider_id) not between 1 and 200 or p_provider_id ~ E'[\r\n]'))
    or (p_error is not null and (pg_catalog.char_length(p_error) not between 1 and 200 or p_error ~ E'[\r\n]')) then
    raise exception using errcode = '22023', message = 'invalid_email_result';
  end if;
  select queued.* into message from public.membership_request_emails queued where queued.event_id = p_event_id for update;
  if not found then
    raise exception using errcode = '42501', message = 'email_dispatch_forbidden';
  end if;
  if message.lease_token is distinct from p_lease_token then
    raise exception using errcode = '40001', message = 'email_lease_changed';
  end if;
  if message.status = 'sent' and message.provider_id is not distinct from p_provider_id then return true; end if;
  if message.status <> 'sending' then
    raise exception using errcode = '40001', message = 'email_lease_changed';
  end if;
  if p_provider_id is not null then
    update public.membership_request_emails queued set status = 'sent', provider_id = p_provider_id,
      sent_at = finished_at, last_error = null, lease_expires_at = null where queued.event_id = p_event_id;
  else
    update public.membership_request_emails queued set
      status = case when p_retryable and message.first_attempt_at <= finished_at - interval '23 hours' then 'needs_review'
        when p_retryable and message.attempts < 5 then 'pending' else 'failed' end,
      last_error = p_error, lease_expires_at = null,
      next_attempt_at = finished_at + pg_catalog.make_interval(secs => least(3600, 30 * (2 ^ (message.attempts - 1)))::integer)
    where queued.event_id = p_event_id;
  end if;
  return true;
end;
$$;

revoke all on function public._membership_request_readable(uuid), public._membership_public_secret(text),
  public.public_membership_available(text),
  public._membership_enqueue_request_emails(), public.submit_public_membership(text, jsonb, text),
  public.review_public_membership(uuid, text, timestamptz), public.public_membership_counts(),
  public.claim_approved_membership(), public.claim_public_membership_emails(text, uuid, integer),
  public.finish_public_membership_email(text, uuid, uuid, text, text, boolean)
  from public, anonymous, authenticated;
grant execute on function public.public_membership_available(text), public.submit_public_membership(text, jsonb, text),
  public.claim_public_membership_emails(text, uuid, integer),
  public.finish_public_membership_email(text, uuid, uuid, text, text, boolean) to anonymous, authenticated;
grant execute on function public._membership_request_readable(uuid),
  public.review_public_membership(uuid, text, timestamptz), public.public_membership_counts(),
  public.claim_approved_membership() to authenticated;

notify pgrst, 'reload schema';
commit;
