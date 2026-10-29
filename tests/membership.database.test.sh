#!/usr/bin/env bash
# Disposable local PostgreSQL only. Does not use Neon or real accounts.
set -euo pipefail
membership_pg_bin="${AIPEX_TEST_PG_BIN:-/opt/homebrew/opt/postgresql@15/bin}"
membership_repo_root="$(cd "$(dirname "$0")/.." && pwd)"
membership_pg_root="$(mktemp -d /private/tmp/aipex-membership-pg.XXXXXX)"
membership_pg_port=55450
cleanup() {
  membership_exit_status=$?
  if [ "$membership_exit_status" -ne 0 ]; then
    for membership_log in "$membership_pg_root"/*.log; do
      if [ -f "$membership_log" ]; then tail -15 "$membership_log" >&2; fi
    done
  fi
  if [ -f "$membership_pg_root/data/postmaster.pid" ]; then
    "$membership_pg_bin/pg_ctl" -D "$membership_pg_root/data" -m immediate -w stop >/dev/null 2>&1 || true
  fi
  rm -rf "$membership_pg_root"
}
trap cleanup EXIT
"$membership_pg_bin/initdb" -D "$membership_pg_root/data" --auth=trust --encoding=UTF8 --locale=C --no-instructions >"$membership_pg_root/init.log" 2>&1
"$membership_pg_bin/pg_ctl" -D "$membership_pg_root/data" -l "$membership_pg_root/server.log" -o "-p $membership_pg_port -h 127.0.0.1 -k $membership_pg_root" -w start >/dev/null
membership_psql=("$membership_pg_bin/psql" -X -q -v ON_ERROR_STOP=1 -h "$membership_pg_root" -p "$membership_pg_port" -d postgres)

"${membership_psql[@]}" >"$membership_pg_root/setup.log" <<'SQL'
create role authenticated noinherit;
create role anonymous noinherit;
create schema neon_auth;
create schema auth;
create table neon_auth."user" (id uuid primary key, email text unique not null, "emailVerified" boolean not null default false);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
grant usage on schema auth, public to authenticated, anonymous;
create function public.test_assert(value boolean, message text) returns void
language plpgsql as $$ begin if value is distinct from true then raise exception 'ASSERTION FAILED: %', message; end if; end; $$;
create function public.test_error(query text, expected_code text, expected_message text default null) returns void
language plpgsql as $$
declare actual_code text; actual_message text;
begin
  begin
    execute query;
  exception when others then
    get stacked diagnostics actual_code = returned_sqlstate, actual_message = message_text;
    if actual_code <> expected_code or (expected_message is not null and actual_message <> expected_message) then
      raise exception 'Expected % / %, got % / %', expected_code, expected_message, actual_code, actual_message;
    end if;
    return;
  end;
  raise exception 'Expected error %, but query succeeded', expected_code;
end; $$;
insert into neon_auth."user" (id,email,"emailVerified") values
 ('00000000-0000-0000-0000-000000000001','applicant-a@invalid.test',true),
 ('00000000-0000-0000-0000-000000000002','applicant-b@invalid.test',true),
 ('00000000-0000-0000-0000-000000000003','applicant-c@invalid.test',true),
 ('00000000-0000-0000-0000-000000000004','unverified@invalid.test',false),
 ('00000000-0000-0000-0000-000000000005','reviewer@invalid.test',true);
SQL
"${membership_psql[@]}" -f "$membership_repo_root/neon/migrations/20261029180000_membership_applications.sql" >"$membership_pg_root/migration.log" 2>&1

"${membership_psql[@]}" >"$membership_pg_root/checks.log" <<'SQL'
-- A JSON helper keeps the fictional fixture readable; it is not deployed.
create function public.test_application(name text default 'Test applicant') returns jsonb language sql as $$
select jsonb_build_object('fullName',name,'role','Policy adviser','organisation','Fictional test ministry','country','United Kingdom','profileUrl','https://www.linkedin.com/in/fictional-test','interests',jsonb_build_array('economy','public-institutions'),'motivation','I work on public policy and want to prepare institutions for advanced AI.','contribution','I can share practical policy experience.','agreement',true);
$$;
set role anonymous;
select public.test_error('select * from public.membership_applications', '42501');
select public.test_error('select public.submit_membership(''{}''::jsonb)', '42501');
reset role;
select public.test_assert((select count(*)=0 from public.membership_reviewers),'migration grants nobody reviewer access');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
select public.test_error('select public.submit_membership(public.test_application())','42501','verified_account_required');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_assert(not public.membership_is_reviewer(),'applicant is not reviewer');
select public.test_assert((select status='pending' and email='applicant-a@invalid.test' and reviewed_by is null from public.submit_membership(public.test_application())),'server derives pending state and verified email');
select public.test_assert((select full_name='Test applicant' from public.submit_membership(public.test_application('Must not overwrite'))),'resubmission returns unchanged record');
select public.test_error('select public.submit_membership(public.test_application() || ''{"status":"approved"}''::jsonb)','22023','invalid_application');
select public.test_error('select public.submit_membership(public.test_application() || ''{"email":"someone-else@invalid.test"}''::jsonb)','22023','invalid_application');
select public.test_error('select public.submit_membership(public.test_application() || ''{"agreement":false}''::jsonb)','22023','invalid_application');
select public.test_error('select public.submit_membership(public.test_application() || ''{"interests":["economy","economy"]}''::jsonb)','22023','invalid_application');
select public.test_error('select public.submit_membership(public.test_application() || ''{"profileUrl":"javascript:alert(1)"}''::jsonb)','23514');
select public.test_error('select public.submit_membership(public.test_application() || jsonb_build_object(''role'', E''adviser\nimpersonation''))','23514');
select public.test_error('update public.membership_applications set status=''approved''','42501');
select public.test_error('insert into public.membership_reviewers(user_id) values(auth.uid())','42501');
select public.test_error('select public.membership_counts()','42501','reviewer_required');
select public.test_error('select public.review_membership(auth.uid(),''approved'',now())','42501','reviewer_required');
select public.test_assert((select count(*)=0 from public.membership_reviews),'applicant cannot read audit records');

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select public.test_assert((select count(*)=0 from public.membership_applications),'B cannot read A');
select public.submit_membership(public.test_application('政策担当者'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select public.submit_membership(public.test_application('Applicant C'));
reset role;

-- Operator deliberately grants review rights to a known verified account.
insert into public.membership_reviewers (user_id) values ('00000000-0000-0000-0000-000000000005');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert(public.membership_is_reviewer(),'reviewer recognises allowlist');
select public.test_assert((select count(*)=3 from public.membership_applications),'reviewer can read queue');
select public.test_assert((public.membership_counts()->>'pending')::int=3,'reviewer counts pending applications');
select public.test_assert((select status='approved' and reviewed_by=auth.uid() from public.review_membership('00000000-0000-0000-0000-000000000001','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000001'))),'reviewer explicitly approves pending application');
select public.test_assert((select count(*)=1 from public.membership_reviews where decision='approved'),'approval creates one audit row');
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000001'',''declined'',now())','40001','application_changed');
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000002'',''approved'',''2000-01-01''::timestamptz)','40001','application_changed');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_assert((select count(*)=1 and bool_and(status='approved') from public.membership_applications),'A sees only own approved status');
select public.test_assert((select status='approved' from public.submit_membership(public.test_application())),'retry cannot overwrite approval');
reset role;

-- Set up 49 approved applications without using any real identity or project.
insert into neon_auth."user" (id,email,"emailVerified")
select format('10000000-0000-0000-0000-%s',lpad(i::text,12,'0'))::uuid, 'seed-'||i||'@invalid.test', true
from generate_series(1,48) i;
insert into public.membership_applications (user_id,email,full_name,role,organisation,country,interests,motivation,status,reviewed_at,reviewed_by)
select id,email,'Capacity fixture','Policy adviser','Fictional ministry','Test country',array['economy'],'Fictional test applicant used only to verify the founding cohort approval limit.','approved',now(),'00000000-0000-0000-0000-000000000005'
from neon_auth."user" where email like 'seed-%@invalid.test';
select public.test_assert((select count(*)=49 from public.membership_applications where status='approved'),'one founding place remains');
SQL

# Hold the admission lock in B's transaction while C attempts the final place.
"${membership_psql[@]}" >"$membership_pg_root/review-b.log" 2>&1 <<SQL &
begin;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.review_membership('00000000-0000-0000-0000-000000000002','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000002'));
\! touch '$membership_pg_root/review-ready'
select pg_sleep(1);
commit;
SQL
membership_review_b_pid=$!
for membership_attempt in $(seq 1 100); do
  if [ -f "$membership_pg_root/review-ready" ]; then break; fi
  if ! kill -0 "$membership_review_b_pid" 2>/dev/null; then
    cat "$membership_pg_root/review-b.log"
    exit 1
  fi
  sleep 0.05
done
test -f "$membership_pg_root/review-ready"
"${membership_psql[@]}" >"$membership_pg_root/review-c.log" <<'SQL'
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000003'',''approved'',(select updated_at from public.membership_applications where user_id=''00000000-0000-0000-0000-000000000003''))','23514','founding_cohort_full');
SQL
wait "$membership_review_b_pid"
"${membership_psql[@]}" >"$membership_pg_root/final.log" <<'SQL'
select public.test_assert((select count(*)=50 from public.membership_applications where status='approved'),'concurrent approvals cannot exceed 50');
select public.test_assert((select status='pending' from public.membership_applications where user_id='00000000-0000-0000-0000-000000000003'),'unsuccessful final-place candidate remains pending');
select public.test_assert((select count(*)=2 from public.membership_reviews),'only successful decisions produce audit entries');
-- A decline is still available when the founding cohort is full.
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert((select status='declined' from public.review_membership('00000000-0000-0000-0000-000000000003','declined',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000003'))),'reviewer can decline a pending application');
reset role;
select public.test_assert((select count(*)=3 from public.membership_reviews),'decline is audited');
SQL
printf 'Membership database integration checks passed (disposable PostgreSQL 15; no external database used).\n'
