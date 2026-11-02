#!/usr/bin/env bash
# Disposable PostgreSQL only: never connects to Neon or an email provider.
set -euo pipefail
archive_pg_bin="${AIPEX_TEST_PG_BIN:-/opt/homebrew/opt/postgresql@15/bin}"
archive_repo_root="$(cd "$(dirname "$0")/.." && pwd)"
archive_pg_root="$(mktemp -d /private/tmp/aipex-membership-archive-pg.XXXXXX)"
archive_pg_port=55452
cleanup() {
  archive_exit_status=$?
  if [ "$archive_exit_status" -ne 0 ]; then
    for archive_log in "$archive_pg_root"/*.log; do
      if [ -f "$archive_log" ]; then tail -25 "$archive_log" >&2; fi
    done
  fi
  if [ -f "$archive_pg_root/data/postmaster.pid" ]; then
    "$archive_pg_bin/pg_ctl" -D "$archive_pg_root/data" -m immediate -w stop >/dev/null 2>&1 || true
  fi
  rm -rf "$archive_pg_root"
}
trap cleanup EXIT
"$archive_pg_bin/initdb" -D "$archive_pg_root/data" --auth=trust --encoding=UTF8 --locale=C --no-instructions >"$archive_pg_root/init.log" 2>&1
"$archive_pg_bin/pg_ctl" -D "$archive_pg_root/data" -l "$archive_pg_root/server.log" -o "-p $archive_pg_port -h 127.0.0.1 -k $archive_pg_root" -w start >/dev/null
archive_psql=("$archive_pg_bin/psql" -X -q -v ON_ERROR_STOP=1 -h "$archive_pg_root" -p "$archive_pg_port" -d postgres)

"${archive_psql[@]}" >"$archive_pg_root/setup.log" <<'SQL'
create role authenticated noinherit;
create role anonymous noinherit;
create schema neon_auth;
create schema auth;
create table neon_auth."user" (id uuid primary key, email text unique not null, "emailVerified" boolean not null default false);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $$;
grant usage on schema auth, public to authenticated, anonymous;
create function public.test_assert(value boolean, message text) returns void language plpgsql as $$ begin if value is distinct from true then raise exception 'ASSERTION FAILED: %', message; end if; end; $$;
create function public.test_error(query text, expected_code text, expected_message text default null) returns void language plpgsql as $$
declare actual_code text; actual_message text;
begin
  begin execute query;
  exception when others then
    get stacked diagnostics actual_code = returned_sqlstate, actual_message = message_text;
    if actual_code <> expected_code or (expected_message is not null and actual_message <> expected_message) then
      raise exception 'Expected % / %, got % / %', expected_code, expected_message, actual_code, actual_message;
    end if;
    return;
  end;
  raise exception 'Expected error %, but query succeeded', expected_code;
end; $$;
create function public.test_application(name text) returns jsonb language sql as $$
  select jsonb_build_object('fullName',name,'role','Policy adviser','organisation','Fictional test ministry','country','United Kingdom','interests',jsonb_build_array('economy'),'motivation','Fictional applicant testing reversible membership archival and access controls.','agreement',true);
$$;
insert into neon_auth."user" (id,email,"emailVerified") values
 ('00000000-0000-0000-0000-000000000001','historical-test@invalid.test',true),
 ('00000000-0000-0000-0000-000000000002','approval-test@invalid.test',true),
 ('00000000-0000-0000-0000-000000000003','decline-test@invalid.test',true),
 ('00000000-0000-0000-0000-000000000004','real-applicant-control@invalid.test',true),
 ('00000000-0000-0000-0000-000000000005','reviewer@invalid.test',true);
SQL
"${archive_psql[@]}" -f "$archive_repo_root/neon/migrations/20261029180000_membership_applications.sql" >"$archive_pg_root/membership-migration.log" 2>&1
"${archive_psql[@]}" >"$archive_pg_root/history.log" <<'SQL'
insert into public.membership_reviewers(user_id) values ('00000000-0000-0000-0000-000000000005');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.submit_membership(public.test_application('Historical TEST applicant'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
select public.submit_membership(public.test_application('Real applicant control'));
SQL
"${archive_psql[@]}" -f "$archive_repo_root/neon/migrations/20261030170000_membership_emails.sql" >"$archive_pg_root/emails-migration.log" 2>&1
"${archive_psql[@]}" >"$archive_pg_root/fixtures.log" <<'SQL'
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select public.submit_membership(public.test_application('TEST approval email'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select public.submit_membership(public.test_application('TEST decline email'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.review_membership('00000000-0000-0000-0000-000000000002','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000002'));
select public.review_membership('00000000-0000-0000-0000-000000000003','declined',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000003'));
reset role;
-- Match a completed email QA run without sending anything externally. Resetting
-- the two fixtures to pending retains their original review and email history.
update public.membership_applications set status='pending', reviewed_at=null, reviewed_by=null, updated_at=clock_timestamp()
  where user_id in ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003');
update public.membership_email_outbox set status='sent', attempts=1,
  provider_id='disposable-provider-' || event_id::text,
  first_attempt_at=clock_timestamp(), last_attempt_at=clock_timestamp(), sent_at=clock_timestamp();
SQL
"${archive_psql[@]}" -f "$archive_repo_root/neon/migrations/20261030190000_archive_test_applications.sql" >"$archive_pg_root/archive-migration.log" 2>&1

"${archive_psql[@]}" >"$archive_pg_root/checks.log" <<'SQL'
select public.test_assert((select count(*)=4 and bool_and(archived_at is null) from public.membership_applications),'migration never chooses or archives records automatically');
select public.test_assert((select count(*)=6 and bool_and(status='sent') from public.membership_email_outbox),'fixture has six accepted email events');
select public.test_assert((select count(*)=2 from public.membership_reviews),'fixture has two decision audits');
create temp table archive_snapshot as select
  (select jsonb_agg(to_jsonb(a)-'archived_at'-'updated_at' order by user_id) from public.membership_applications a) as application_payloads,
  (select to_jsonb(a) from public.membership_applications a where user_id='00000000-0000-0000-0000-000000000004') as real_application,
  (select jsonb_agg(to_jsonb(e) order by event_id) from public.membership_email_outbox e) as emails,
  (select jsonb_agg(to_jsonb(r) order by id) from public.membership_reviews r) as reviews,
  (select jsonb_agg(to_jsonb(u) order by id) from neon_auth."user" u) as auth_users,
  (select jsonb_agg(to_jsonb(r) order by user_id) from public.membership_reviewers r) as reviewers;
select set_config('test.archive_old_timestamp',(select updated_at::text from public.membership_applications where user_id='00000000-0000-0000-0000-000000000002'),false);
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert(public.membership_counts()=jsonb_build_object('pending',4,'approved',0,'declined',0,'limit',50),'reviewer counts include all pending applications before archive');
reset role;

-- This is an explicit database-operator action. No authenticated role gets an
-- archive endpoint or a column/table write grant from the migration.
update public.membership_applications set archived_at=clock_timestamp(), updated_at=clock_timestamp()
  where user_id in ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003');
select public.test_assert((select count(*)=3 from public.membership_applications where archived_at is not null),'only the three explicitly selected fixtures are archived');
select public.test_assert((select updated_at > current_setting('test.archive_old_timestamp')::timestamptz from public.membership_applications where user_id='00000000-0000-0000-0000-000000000002'),'operator archive invalidates previously opened review forms');
select public.test_assert(not has_table_privilege('authenticated','public.membership_applications','UPDATE') and not has_column_privilege('authenticated','public.membership_applications','archived_at','UPDATE'),'archive adds no authenticated write permission');
set role authenticated;
select public.test_assert(public.membership_counts()=jsonb_build_object('pending',1,'approved',0,'declined',0,'limit',50),'archived records are excluded from queue counts without reducing the admission limit');
select public.test_assert((select count(*)=1 from public.membership_applications where status='pending' and archived_at is null),'review queue filter returns only the real application');
select public.test_error('update public.membership_applications set archived_at=null','42501');
select public.test_error('delete from public.membership_applications','42501');
select public.test_error('select public._membership_require_active_review()','42501');
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000002'',''approved'',current_setting(''test.archive_old_timestamp'')::timestamptz)','40001','application_changed');
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000002'',''approved'',(select updated_at from public.membership_applications where user_id=''00000000-0000-0000-0000-000000000002''))','40001','application_changed');
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000003'',''declined'',(select updated_at from public.membership_applications where user_id=''00000000-0000-0000-0000-000000000003''))','40001','application_changed');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_error('update public.membership_applications set archived_at=null where user_id=auth.uid()','42501');
select public.test_error('select public.membership_counts()','42501','reviewer_required');
select public.test_assert((select count(*)=1 and bool_and(archived_at is not null) from public.membership_applications),'applicant still reads their existing application and no other row');
select public.test_assert((select archived_at is not null from public.submit_membership(public.test_application('Retry cannot clear an archive'))),'a submission retry cannot clear an operator archive');
reset role;
set role anonymous;
select public.test_error('select public.membership_counts()','42501');
select public.test_error('select * from public.membership_applications','42501');
reset role;

select public.test_assert((select jsonb_agg(to_jsonb(a)-'archived_at'-'updated_at' order by user_id) from public.membership_applications a)=(select application_payloads from archive_snapshot),'archiving preserves all application payloads and status');
select public.test_assert((select to_jsonb(a) from public.membership_applications a where user_id='00000000-0000-0000-0000-000000000004')=(select real_application from archive_snapshot),'real applicant is byte-for-byte unaffected');
select public.test_assert((select jsonb_agg(to_jsonb(e) order by event_id) from public.membership_email_outbox e)=(select emails from archive_snapshot),'all six emails, recipients and provider receipts are preserved without another event');
select public.test_assert((select jsonb_agg(to_jsonb(r) order by id) from public.membership_reviews r)=(select reviews from archive_snapshot),'both review audits are preserved and failed archive reviews add none');
select public.test_assert((select jsonb_agg(to_jsonb(u) order by id) from neon_auth."user" u)=(select auth_users from archive_snapshot),'account identities are unchanged');
select public.test_assert((select jsonb_agg(to_jsonb(r) order by user_id) from public.membership_reviewers r)=(select reviewers from archive_snapshot),'reviewer access is unchanged');

-- An approved/declined record cannot be hidden from counts while still holding
-- its decision. Roll back this probe so the unrelated control remains unchanged.
begin;
update public.membership_applications set status='approved',reviewed_at=clock_timestamp(),reviewed_by='00000000-0000-0000-0000-000000000005'
  where user_id='00000000-0000-0000-0000-000000000004';
select public.test_error('update public.membership_applications set archived_at=clock_timestamp() where user_id=''00000000-0000-0000-0000-000000000004''','23514');
rollback;

-- Undoing the operator archive restores the same pending record, with no new
-- application, decision, notification or account required.
update public.membership_applications set archived_at=null, updated_at=clock_timestamp()
  where user_id='00000000-0000-0000-0000-000000000001';
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert(public.membership_counts()=jsonb_build_object('pending',2,'approved',0,'declined',0,'limit',50),'unarchiving restores the original pending record to queue counts');
reset role;
select public.test_assert((select jsonb_agg(to_jsonb(e) order by event_id) from public.membership_email_outbox e)=(select emails from archive_snapshot),'unarchive does not send or enqueue another email');
select public.test_assert((select jsonb_agg(to_jsonb(r) order by id) from public.membership_reviews r)=(select reviews from archive_snapshot),'unarchive retains the original audits');
select public.test_assert((select to_jsonb(a) from public.membership_applications a where user_id='00000000-0000-0000-0000-000000000004')=(select real_application from archive_snapshot),'real application remains unchanged after all probes');
SQL
printf 'Membership archive database checks passed (disposable PostgreSQL 15; no external database or email used).\n'
