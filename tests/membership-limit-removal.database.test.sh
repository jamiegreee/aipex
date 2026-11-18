#!/usr/bin/env bash
# Disposable PostgreSQL only: never connects to Neon or an email provider.
set -euo pipefail
limit_pg_bin="${AIPEX_TEST_PG_BIN:-/opt/homebrew/opt/postgresql@15/bin}"
limit_repo_root="$(cd "$(dirname "$0")/.." && pwd)"
limit_pg_root="$(mktemp -d /private/tmp/aipex-membership-limit-pg.XXXXXX)"
limit_pg_port=55453
cleanup() {
  limit_exit_status=$?
  if [ "$limit_exit_status" -ne 0 ]; then
    for limit_log in "$limit_pg_root"/*.log; do
      if [ -f "$limit_log" ]; then tail -25 "$limit_log" >&2; fi
    done
  fi
  if [ -f "$limit_pg_root/data/postmaster.pid" ]; then
    "$limit_pg_bin/pg_ctl" -D "$limit_pg_root/data" -m immediate -w stop >/dev/null 2>&1 || true
  fi
  rm -rf "$limit_pg_root"
}
trap cleanup EXIT
"$limit_pg_bin/initdb" -D "$limit_pg_root/data" --auth=trust --encoding=UTF8 --locale=C --no-instructions >"$limit_pg_root/init.log" 2>&1
"$limit_pg_bin/pg_ctl" -D "$limit_pg_root/data" -l "$limit_pg_root/server.log" -o "-p $limit_pg_port -h 127.0.0.1 -k $limit_pg_root" -w start >/dev/null
limit_psql=("$limit_pg_bin/psql" -X -q -v ON_ERROR_STOP=1 -h "$limit_pg_root" -p "$limit_pg_port" -d postgres)

"${limit_psql[@]}" >"$limit_pg_root/setup.log" <<'SQL'
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
  select jsonb_build_object('fullName',name,'role','Policy adviser','organisation','Fictional test ministry','country','United Kingdom','interests',jsonb_build_array('economy'),'motivation','Fictional applicant testing membership approvals without an admission limit.','agreement',true);
$$;
insert into neon_auth."user" (id,email,"emailVerified") values
 ('00000000-0000-0000-0000-000000000001','historical-test@invalid.test',true),
 ('00000000-0000-0000-0000-000000000002','approval-test@invalid.test',true),
 ('00000000-0000-0000-0000-000000000003','decline-test@invalid.test',true),
 ('00000000-0000-0000-0000-000000000004','real-applicant-control@invalid.test',true),
 ('00000000-0000-0000-0000-000000000005','reviewer@invalid.test',true);
SQL
for limit_migration in 20261029180000_membership_applications 20261030170000_membership_emails 20261030190000_archive_test_applications; do
  "${limit_psql[@]}" -f "$limit_repo_root/neon/migrations/$limit_migration.sql" >"$limit_pg_root/$limit_migration.log" 2>&1
done
"${limit_psql[@]}" >"$limit_pg_root/fixtures.log" <<'SQL'
insert into public.membership_reviewers(user_id) values ('00000000-0000-0000-0000-000000000005');
-- Fill the old 50-member limit with fictional approved members.
insert into neon_auth."user" (id,email,"emailVerified")
select format('10000000-0000-0000-0000-%s',lpad(i::text,12,'0'))::uuid, 'seed-'||i||'@invalid.test', true
from generate_series(1,50) i;
insert into public.membership_applications (user_id,email,full_name,role,organisation,country,interests,motivation,status,reviewed_at,reviewed_by)
select id,email,'Capacity fixture','Policy adviser','Fictional ministry','Test country',array['economy'],'Fictional test applicant used only to verify approvals beyond the old limit.','approved',now(),'00000000-0000-0000-0000-000000000005'
from neon_auth."user" where email like 'seed-%@invalid.test';
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.submit_membership(public.test_application('TEST applicant one'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select public.submit_membership(public.test_application('TEST applicant two'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000001'',''approved'',(select updated_at from public.membership_applications where user_id=''00000000-0000-0000-0000-000000000001''))','23514','founding_cohort_full');
reset role;
SQL
"${limit_psql[@]}" -f "$limit_repo_root/neon/migrations/20261118190000_remove_member_limit.sql" >"$limit_pg_root/remove-limit-migration.log" 2>&1
"${limit_psql[@]}" >"$limit_pg_root/checks.log" <<'SQL'
select public.test_assert(to_regclass('public.membership_admissions') is null,'admission limit table is removed');
select public.test_assert((select count(*)=52 from public.membership_applications),'migration keeps every application');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert(public.membership_counts()=jsonb_build_object('pending',2,'approved',50,'declined',0),'counts no longer report a limit');
select public.test_assert((select status='approved' from public.review_membership('00000000-0000-0000-0000-000000000001','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000001'))),'reviewer can approve a 51st member');
select public.test_assert((select status='declined' from public.review_membership('00000000-0000-0000-0000-000000000002','declined',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000002'))),'reviewer can still decline');
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000001'',''declined'',now())','40001','application_changed');
select public.test_assert((select count(*)=2 from public.membership_reviews),'each decision is audited once');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_error('select public.membership_counts()','42501','reviewer_required');
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000002'',''approved'',now())','42501','reviewer_required');
reset role;
set role anonymous;
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000002'',''approved'',now())','42501');
reset role;
select public.test_assert((select count(*)=2 from public.membership_email_outbox where kind in ('application_approved','application_declined')),'decision emails still queue');
SQL
printf 'Membership limit removal database checks passed (disposable PostgreSQL; no external database or email used).\n'
