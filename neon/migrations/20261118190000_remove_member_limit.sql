-- Remove the 50-member admission limit. Membership is granted to whoever the
-- reviewer approves; there is no founding cohort. Application, review, audit
-- and email records are untouched.
begin;

create or replace function public.review_membership(
  p_user_id uuid, p_decision text, p_expected_updated_at timestamptz
) returns setof public.membership_applications
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := public._membership_verified_user_id();
  application public.membership_applications%rowtype;
  decision_time timestamptz;
begin
  if not public.membership_is_reviewer() then
    raise exception using errcode = '42501', message = 'reviewer_required';
  end if;
  if p_user_id is null or p_decision is null or p_decision not in ('approved', 'declined')
    or p_expected_updated_at is null then
    raise exception using errcode = '22023', message = 'invalid_decision';
  end if;

  -- The application row lock stops two reviewers overwriting the same decision.
  select a.* into application from public.membership_applications a
    where a.user_id = p_user_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'application_not_found';
  end if;
  if application.status <> 'pending' or application.updated_at is distinct from p_expected_updated_at then
    raise exception using errcode = '40001', message = 'application_changed';
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

create or replace function public.membership_counts() returns jsonb
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
    'declined', pg_catalog.count(*) filter (where a.status = 'declined')
  ) into counts from public.membership_applications a where a.archived_at is null;
  return counts;
end;
$$;

revoke all on function public.review_membership(uuid, text, timestamptz), public.membership_counts()
  from public, anonymous, authenticated;
grant execute on function public.review_membership(uuid, text, timestamptz), public.membership_counts()
  to authenticated;

drop table public.membership_admissions;

notify pgrst, 'reload schema';
commit;
