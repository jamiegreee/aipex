-- Additive migration for AIPEX only: empty-block-17582000 / br-dawn-union-zamwo3z4.
-- Run as the database operator; the application continues to use per-user JWTs.
-- Reviewer access is deliberately bootstrapped separately after identity checks.
begin;

create function public._membership_text_valid(
  value text, minimum integer, maximum integer, multiline boolean default false
) returns boolean
language sql immutable set search_path = '' as $$
  select value is not null
    and pg_catalog.char_length(value) <= maximum
    and pg_catalog.char_length(pg_catalog.btrim(value, E' \t\r\n')) between minimum and maximum
    and value !~ case when multiline
      then U&'[\0001-\0008\000B\000C\000E-\001F\007F-\009F\202A-\202E\2066-\2069]'
      else U&'[\0001-\001F\007F-\009F\202A-\202E\2066-\2069]' end;
$$;

create function public._membership_interests_valid(value text[]) returns boolean
language sql immutable set search_path = '' as $$
  select value is not null
    and pg_catalog.array_ndims(value) = 1
    and pg_catalog.cardinality(value) between 1 and 4
    and value <@ array['public-institutions', 'economy', 'safety-security', 'international', 'democracy', 'other']::text[]
    and not exists (select 1 from pg_catalog.unnest(value) item where item is null)
    and pg_catalog.cardinality(value) = (select pg_catalog.count(distinct item) from pg_catalog.unnest(value) item);
$$;

create table public.membership_reviewers (
  user_id uuid primary key references neon_auth."user"(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.membership_admissions (
  singleton boolean primary key default true check (singleton),
  member_limit integer not null check (member_limit between 1 and 10000)
);
insert into public.membership_admissions (singleton, member_limit) values (true, 50);

create table public.membership_applications (
  user_id uuid primary key references neon_auth."user"(id) on delete cascade,
  email text not null check (pg_catalog.char_length(email) between 3 and 254),
  full_name text not null check (public._membership_text_valid(full_name, 2, 100)),
  role text not null check (public._membership_text_valid(role, 2, 120)),
  organisation text not null check (public._membership_text_valid(organisation, 2, 160)),
  country text not null check (public._membership_text_valid(country, 2, 100)),
  profile_url text not null default '' check (
    profile_url = '' or (
      pg_catalog.char_length(profile_url) <= 300
      and profile_url ~ '^https://(www\.)?linkedin\.com/in/[A-Za-z0-9%._~-]+/?$'
    )
  ),
  interests text[] not null check (public._membership_interests_valid(interests)),
  motivation text not null check (public._membership_text_valid(motivation, 40, 1500, true)),
  contribution text not null default '' check (public._membership_text_valid(contribution, 0, 1000, true)),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references neon_auth."user"(id) on delete set null,
  check ((status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (status <> 'pending' and reviewed_at is not null))
);
create index membership_applications_review_queue on public.membership_applications (status, created_at, user_id);

create table public.membership_reviews (
  id bigint generated always as identity primary key,
  applicant_user_id uuid not null references public.membership_applications(user_id) on delete cascade,
  reviewer_user_id uuid references neon_auth."user"(id) on delete set null,
  decision text not null check (decision in ('approved', 'declined')),
  reviewed_at timestamptz not null default now()
);

alter table public.membership_reviewers enable row level security;
alter table public.membership_admissions enable row level security;
alter table public.membership_applications enable row level security;
alter table public.membership_reviews enable row level security;
revoke all on public.membership_reviewers, public.membership_admissions,
  public.membership_applications, public.membership_reviews from public, anonymous, authenticated;
revoke all on sequence public.membership_reviews_id_seq from public, anonymous, authenticated;

-- Reads the provider-owned account, never an applicant-supplied email or role.
-- Both supported column spellings fail closed if neither verification field exists.
create function public._membership_verified_user_id() returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
begin
  if actor is null or not exists (
    select 1 from neon_auth."user" u
    where u.id = actor
      and coalesce((pg_catalog.to_jsonb(u)->>'emailVerified')::boolean,
                   (pg_catalog.to_jsonb(u)->>'email_verified')::boolean, false)
  ) then
    raise exception using errcode = '42501', message = 'verified_account_required';
  end if;
  return actor;
end;
$$;

create function public.membership_is_reviewer() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.membership_reviewers reviewer
    join neon_auth."user" u on u.id = reviewer.user_id
    where reviewer.user_id = auth.uid()
      and coalesce((pg_catalog.to_jsonb(u)->>'emailVerified')::boolean,
                   (pg_catalog.to_jsonb(u)->>'email_verified')::boolean, false)
  );
$$;

-- No authenticated table writes: submitting and reviewing have separate narrow RPCs.
grant select on public.membership_applications, public.membership_reviews to authenticated;
create policy membership_read_own_or_review on public.membership_applications
  for select to authenticated using (
    (select auth.uid()) = user_id or (select public.membership_is_reviewer())
  );
create policy membership_audit_reviewers on public.membership_reviews
  for select to authenticated using ((select public.membership_is_reviewer()));

create function public.submit_membership(p_application jsonb)
returns setof public.membership_applications
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := public._membership_verified_user_id();
  actor_email text;
  input_key text;
  selected_interests text[];
begin
  if pg_catalog.jsonb_typeof(p_application) is distinct from 'object'
    or pg_catalog.octet_length(p_application::text) > 20000
    or p_application->'agreement' is distinct from 'true'::jsonb
  then
    raise exception using errcode = '22023', message = 'invalid_application';
  end if;
  if exists (
    select 1 from pg_catalog.jsonb_object_keys(p_application) k
    where k not in ('fullName', 'role', 'organisation', 'country', 'profileUrl', 'interests', 'motivation', 'contribution', 'agreement')
  ) then
    raise exception using errcode = '22023', message = 'invalid_application';
  end if;
  foreach input_key in array array['fullName', 'role', 'organisation', 'country', 'motivation'] loop
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
  select u.email into actor_email from neon_auth."user" u where u.id = actor;

  insert into public.membership_applications (
    user_id, email, full_name, role, organisation, country, profile_url,
    interests, motivation, contribution
  ) values (
    actor, actor_email,
    pg_catalog.btrim(p_application->>'fullName', E' \t\r\n'),
    pg_catalog.btrim(p_application->>'role', E' \t\r\n'),
    pg_catalog.btrim(p_application->>'organisation', E' \t\r\n'),
    pg_catalog.btrim(p_application->>'country', E' \t\r\n'),
    pg_catalog.btrim(coalesce(p_application->>'profileUrl', ''), E' \t\r\n'),
    selected_interests,
    pg_catalog.btrim(p_application->>'motivation', E' \t\r\n'),
    pg_catalog.btrim(coalesce(p_application->>'contribution', ''), E' \t\r\n')
  ) on conflict (user_id) do nothing;

  -- A retry returns the existing application without overwriting a review decision.
  return query select a.* from public.membership_applications a where a.user_id = actor;
end;
$$;

create function public.review_membership(
  p_user_id uuid, p_decision text, p_expected_updated_at timestamptz
) returns setof public.membership_applications
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := public._membership_verified_user_id();
  application public.membership_applications%rowtype;
  admission_limit integer;
  approved_count bigint;
  decision_time timestamptz;
begin
  if not public.membership_is_reviewer() then
    raise exception using errcode = '42501', message = 'reviewer_required';
  end if;
  if p_user_id is null or p_decision is null or p_decision not in ('approved', 'declined')
    or p_expected_updated_at is null then
    raise exception using errcode = '22023', message = 'invalid_decision';
  end if;

  -- Every decision takes the same lock before the application lock. Two reviewers
  -- cannot both approve a final place or overwrite an already-reviewed application.
  select a.member_limit into admission_limit from public.membership_admissions a
    where a.singleton = true for update;
  if admission_limit is null then
    raise exception using errcode = '55000', message = 'admissions_not_configured';
  end if;
  select a.* into application from public.membership_applications a
    where a.user_id = p_user_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'application_not_found';
  end if;
  if application.status <> 'pending' or application.updated_at is distinct from p_expected_updated_at then
    raise exception using errcode = '40001', message = 'application_changed';
  end if;
  if p_decision = 'approved' then
    select pg_catalog.count(*) into approved_count from public.membership_applications a where a.status = 'approved';
    if approved_count >= admission_limit then
      raise exception using errcode = '23514', message = 'founding_cohort_full';
    end if;
  end if;
  decision_time := pg_catalog.clock_timestamp();
  update public.membership_applications a set
    status = p_decision, reviewed_at = decision_time, reviewed_by = actor, updated_at = decision_time
    where a.user_id = p_user_id;
  insert into public.membership_reviews (applicant_user_id, reviewer_user_id, decision, reviewed_at)
    values (p_user_id, actor, p_decision, decision_time);
  return query select a.* from public.membership_applications a where a.user_id = p_user_id;
end;
$$;

create function public.membership_counts() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  counts jsonb;
begin
  perform public._membership_verified_user_id();
  if not public.membership_is_reviewer() then
    raise exception using errcode = '42501', message = 'reviewer_required';
  end if;
  select pg_catalog.jsonb_build_object(
    'pending', pg_catalog.count(*) filter (where a.status = 'pending'),
    'approved', pg_catalog.count(*) filter (where a.status = 'approved'),
    'declined', pg_catalog.count(*) filter (where a.status = 'declined'),
    'limit', (select admissions.member_limit from public.membership_admissions admissions where admissions.singleton = true)
  ) into counts from public.membership_applications a;
  return counts;
end;
$$;

revoke all on function public._membership_text_valid(text, integer, integer, boolean),
  public._membership_interests_valid(text[]), public._membership_verified_user_id(),
  public.membership_is_reviewer(), public.submit_membership(jsonb),
  public.review_membership(uuid, text, timestamptz), public.membership_counts()
  from public, anonymous, authenticated;
grant execute on function public.membership_is_reviewer(), public.submit_membership(jsonb),
  public.review_membership(uuid, text, timestamptz), public.membership_counts() to authenticated;

notify pgrst, 'reload schema';
commit;
