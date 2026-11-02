-- Operator-only, reversible removal of pending test applications from review.
-- This migration marks no records and grants no new application write access.
begin;

alter table public.membership_applications
  add column archived_at timestamptz,
  add constraint membership_archive_pending_only
    check (archived_at is null or status = 'pending');

comment on column public.membership_applications.archived_at is
  'Operator-only archive of pending applications; update updated_at when archiving or restoring. Application, review and email history are retained.';

-- A reviewer may still have an old queue open. The version check already blocks
-- that form when the operator advances updated_at; this guard also rejects a
-- review using a newly fetched archived row. No decision email or audit is made.
create function public._membership_require_active_review() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.archived_at is not null and new.status is distinct from old.status then
    raise exception using errcode = '40001', message = 'application_changed';
  end if;
  return new;
end;
$$;
revoke all on function public._membership_require_active_review()
  from public, anonymous, authenticated;
create trigger membership_require_active_review
  before update of status on public.membership_applications
  for each row execute function public._membership_require_active_review();

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
    'declined', pg_catalog.count(*) filter (where a.status = 'declined'),
    'limit', (select admissions.member_limit from public.membership_admissions admissions where admissions.singleton = true)
  ) into counts from public.membership_applications a where a.archived_at is null;
  return counts;
end;
$$;
revoke all on function public.membership_counts() from public, anonymous, authenticated;
grant execute on function public.membership_counts() to authenticated;

notify pgrst, 'reload schema';
commit;
