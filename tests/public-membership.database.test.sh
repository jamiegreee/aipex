#!/usr/bin/env bash
# Disposable PostgreSQL only. Never connects to Neon, Auth or an email provider.
set -euo pipefail
public_pg_bin="${AIPEX_TEST_PG_BIN:-/opt/homebrew/opt/postgresql@15/bin}"
public_repo_root="$(cd "$(dirname "$0")/.." && pwd)"
public_pg_root="$(mktemp -d /private/tmp/aipex-public-membership-pg.XXXXXX)"
public_pg_port=55454
cleanup() {
  public_exit_status=$?
  if [ "$public_exit_status" -ne 0 ]; then
    for public_log in "$public_pg_root"/*.log; do
      if [ -f "$public_log" ]; then tail -25 "$public_log" >&2; fi
    done
  fi
  if [ -f "$public_pg_root/data/postmaster.pid" ]; then
    "$public_pg_bin/pg_ctl" -D "$public_pg_root/data" -m immediate -w stop >/dev/null 2>&1 || true
  fi
  rm -rf "$public_pg_root"
}
trap cleanup EXIT
"$public_pg_bin/initdb" -D "$public_pg_root/data" --auth=trust --encoding=UTF8 --locale=C --no-instructions >"$public_pg_root/init.log" 2>&1
"$public_pg_bin/pg_ctl" -D "$public_pg_root/data" -l "$public_pg_root/server.log" -o "-p $public_pg_port -h 127.0.0.1 -k $public_pg_root" -w start >/dev/null
public_psql=("$public_pg_bin/psql" -X -q -v ON_ERROR_STOP=1 -h "$public_pg_root" -p "$public_pg_port" -d postgres)

"${public_psql[@]}" >"$public_pg_root/setup.log" <<'SQL'
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
create function public.test_application(email text default 'applicant-a@invalid.test', name text default 'Public QA applicant') returns jsonb language sql as $$
  select jsonb_build_object('email',email,'fullName',name,'role','Policy adviser','organisation','Fictional test ministry','country','United Kingdom','interests',jsonb_build_array('economy'),'motivation','Fictional applicant testing public membership intake before account creation.','agreement',true);
$$;
insert into neon_auth."user" (id,email,"emailVerified") values
 ('00000000-0000-0000-0000-000000000001','applicant-a@invalid.test',true),
 ('00000000-0000-0000-0000-000000000002','wrong-email@invalid.test',true),
 ('00000000-0000-0000-0000-000000000003','unverified@invalid.test',false),
 ('00000000-0000-0000-0000-000000000004','legacy-approved@invalid.test',true),
 ('00000000-0000-0000-0000-000000000005','reviewer@invalid.test',true),
 ('00000000-0000-0000-0000-000000000006','legacy-pending@invalid.test',true),
 ('00000000-0000-0000-0000-000000000007','declined@invalid.test',true),
 ('00000000-0000-0000-0000-000000000008','conflict@invalid.test',true),
 ('00000000-0000-0000-0000-000000000009','legacy-declined@invalid.test',true),
 ('00000000-0000-0000-0000-000000000010','concurrent-claim@invalid.test',true);
SQL
for public_migration in 20261029180000_membership_applications 20261030170000_membership_emails 20261030190000_archive_test_applications 20261031100000_membership_email_template_v2 20261031190000_membership_email_template_v3 20261118190000_remove_member_limit; do
  "${public_psql[@]}" -f "$public_repo_root/neon/migrations/$public_migration.sql" >"$public_pg_root/$public_migration.log" 2>&1
done
"${public_psql[@]}" >"$public_pg_root/legacy.log" <<'SQL'
insert into public.membership_reviewers(user_id) values ('00000000-0000-0000-0000-000000000005');
insert into public.membership_applications
  (user_id,email,full_name,role,organisation,country,interests,motivation,status,reviewed_at,reviewed_by)
values
 ('00000000-0000-0000-0000-000000000004','legacy-approved@invalid.test','Existing member','Policy adviser','Existing institution','United Kingdom',array['economy'],'An existing approved member must not be changed by the public intake migration.','approved',now(),'00000000-0000-0000-0000-000000000005'),
 ('00000000-0000-0000-0000-000000000009','legacy-declined@invalid.test','Existing declined applicant','Policy adviser','Existing institution','United Kingdom',array['economy'],'An existing decline must not be changed by the public intake migration.','declined',now(),'00000000-0000-0000-0000-000000000005');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000006',false);
select public.submit_membership(public.test_application('legacy-pending@invalid.test') - 'email');
SQL
"${public_psql[@]}" >"$public_pg_root/schema-prerequisite.log" <<'SQL'
revoke usage on schema public from public, anonymous;
select public.test_assert(not has_schema_privilege('anonymous','public','USAGE'),'fixture removes inherited schema usage before applying migration');
SQL
"${public_psql[@]}" -f "$public_repo_root/neon/migrations/20261125130000_public_membership_applications.sql" >"$public_pg_root/public-migration.log" 2>&1

"${public_psql[@]}" >"$public_pg_root/checks.log" <<'SQL'
-- Test-only lookup helpers let negative tests name rows without bypassing the
-- production RLS grants of the acting role.
create function public.test_request_id(email text) returns uuid language sql stable security definer as $$ select id from public.membership_requests where membership_requests.email=$1; $$;
create function public.test_request_version(email text) returns timestamptz language sql stable security definer as $$ select updated_at from public.membership_requests where membership_requests.email=$1; $$;
select public.test_assert(has_schema_privilege('anonymous','public','USAGE') and not has_schema_privilege('anonymous','public','CREATE'),'migration grants guest schema USAGE only');
select public.test_assert((select count(*)=4 and bool_and(p.proname = any(array['public_membership_available','submit_public_membership','claim_public_membership_emails','finish_public_membership_email'])) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname !~ '^test_' and has_function_privilege('anonymous',p.oid,'EXECUTE')),'guest can execute exactly the four intended server-secret RPCs, not inherited legacy helpers');
select public.test_assert((select count(*)=3 from public.membership_applications),'migration preserves existing applications');
select public.test_assert((select count(*)=2 and bool_and(template_version=3) from public.membership_email_outbox),'historical email state/version is untouched');
select public.test_assert((select count(*)=0 from public.membership_request_emails),'migration does not backfill notifications');
set role anonymous;
select set_config('request.jwt.claim.sub','anonymous',false);
select public.test_error('select * from public.membership_requests','42501');
select public.test_error('select * from public.membership_request_emails','42501');
select public.test_error('select * from public.membership_request_rate_events','42501');
select public.test_error('select * from public.membership_request_reviews','42501');
select public.test_error('select * from public.membership_review_queue','42501');
select public.test_error('select public._membership_public_secret(''test-secret-with-more-than-thirty-two-characters'')','42501');
select public.test_error('select public.claim_approved_membership()','42501');
select public.test_error('select public.public_membership_counts()','42501');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application(),repeat(''a'',64))','55000','email_dispatch_not_configured');
reset role;
insert into public.membership_email_settings(dispatch_secret_hash) values (sha256(convert_to('test-secret-with-more-than-thirty-two-characters','UTF8')));
set role anonymous;
select public.test_assert(public.public_membership_available('test-secret-with-more-than-thirty-two-characters'),'read-only readiness confirms migration and server secret');
select public.test_error('select public.public_membership_available(''wrong-secret-with-more-than-thirty-two-characters'')','42501','email_dispatch_forbidden');
select public.test_error('select public.submit_public_membership(''wrong-secret-with-more-than-thirty-two-characters'',public.test_application(),repeat(''a'',64))','42501','email_dispatch_forbidden');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application(),''127.0.0.1'')','22023','invalid_application');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application() || ''{"status":"approved"}''::jsonb,repeat(''a'',64))','22023','invalid_application');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application() || ''{"userId":"spoofed"}''::jsonb,repeat(''a'',64))','22023','invalid_application');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application() || ''{"agreement":false}''::jsonb,repeat(''a'',64))','22023','invalid_application');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application() || ''{"interests":["economy","economy"]}''::jsonb,repeat(''a'',64))','22023','invalid_application');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application() || ''{"interests":"economy"}''::jsonb,repeat(''a'',64))','22023','invalid_application');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application() || ''{"profileUrl":"javascript:alert(1)"}''::jsonb,repeat(''a'',64))','23514');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application(''not-an-email''),repeat(''a'',64))','23514');
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application() || ''{"motivation":"short"}''::jsonb,repeat(''a'',64))','23514');
select public.test_assert(public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('APPLICANT-A@INVALID.TEST'),repeat('a',64)) is not null,'anonymous visitor can submit without an account');
select public.test_assert(public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('Applicant-A@invalid.test','Must not replace original'),repeat('a',64)) is null,'duplicate is a generic success with no row');
select public.test_assert(public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('legacy-pending@invalid.test'),repeat('a',64)) is null,'existing pending account application is not duplicated');
select public.test_assert(public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('legacy-declined@invalid.test'),repeat('a',64)) is null,'existing decline is not overwritten by public intake');
select public.test_error('select public.claim_public_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','42501','email_dispatch_forbidden');
select public.test_error('select public.claim_public_membership_emails(''wrong-secret-with-more-than-thirty-two-characters'',public.test_request_id(''applicant-a@invalid.test''))','42501','email_dispatch_forbidden');
-- The legacy dispatcher still has its original stronger session requirement.
select public.test_error('select public.claim_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','42501');
reset role;
select public.test_assert((select count(*)=1 from public.membership_requests),'only one public application exists');
select public.test_assert((select full_name='Public QA applicant' and email='applicant-a@invalid.test' and status='pending' and linked_user_id is null from public.membership_requests),'identity comes from the public form but grants no membership');
select public.test_assert((select count(*)=3 from public.membership_applications),'intake does not create an account-linked membership');
select public.test_assert((select count(*)=2 and bool_and(template_version=4) from public.membership_request_emails),'exactly two immutable v4 events are queued');
select public.test_assert((select recipient_email='green.jcb@gmail.com' from public.membership_request_emails where kind='founder_alert'),'review alert recipient is fixed');
select public.test_assert((select recipient_email='applicant-a@invalid.test' and applicant_name='Public QA applicant' from public.membership_request_emails where kind='application_received'),'receipt snapshot comes from stored request');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_assert((select count(*)=0 from public.membership_requests),'unlinked applicant cannot read request records');
select public.test_assert((select count(*)=0 from public.membership_review_queue),'invoker view never reveals other account or request applications');
select public.test_assert(not public.claim_approved_membership(),'pending request cannot be claimed');
select public.test_error('select public.public_membership_counts()','42501','reviewer_required');
select public.test_error('select public.review_public_membership(public.test_request_id(''applicant-a@invalid.test''),''approved'',public.test_request_version(''applicant-a@invalid.test''))','42501','reviewer_required');
select public.test_error('select public.claim_public_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','42501','email_dispatch_forbidden');
select public.test_error('insert into public.membership_requests(email) values (''spoof@invalid.test'')','42501');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select public.test_error('select public.claim_approved_membership()','42501','verified_account_required');
select public.test_error('select public.claim_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','42501','verified_account_required');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert((select count(*)=1 from public.membership_requests),'reviewer can read pending public application');
select public.test_assert((select count(*)=4 and count(*) filter(where source='account')=3 and count(*) filter(where source='request')=1 from public.membership_review_queue),'reviewer queue includes legacy and pre-account applications');
select public.test_error('select public.review_public_membership(public.test_request_id(''applicant-a@invalid.test''),''approved'',now()-interval ''1 day'')','40001','application_changed');
select public.test_assert((select status='approved' from public.review_public_membership(public.test_request_id('applicant-a@invalid.test'),'approved',public.test_request_version('applicant-a@invalid.test'))),'reviewer explicitly approves the public request');
select public.test_error('select public.review_public_membership(public.test_request_id(''applicant-a@invalid.test''),''declined'',public.test_request_version(''applicant-a@invalid.test''))','40001','application_changed');
select public.test_assert(public.public_membership_counts()=jsonb_build_object('pending',0,'approved',1,'declined',0),'unclaimed approved request is counted');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select public.test_assert(not public.claim_approved_membership(),'a different verified email cannot claim approval');
select public.test_assert((select count(*)=0 from public.membership_requests),'other account sees no private request');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_assert(public.claim_approved_membership(),'approved email owner can activate membership');
select public.test_assert(public.claim_approved_membership(),'repeated activation is idempotent');
select public.test_assert((select count(*)=1 and bool_and(linked_user_id=auth.uid()) from public.membership_requests),'linked verified owner can read only their own request');
select public.test_assert((select count(*)=1 and bool_and(source='account' and id=auth.uid()) from public.membership_review_queue),'activation produces one visible own row, never a duplicate request or other applicant');
select public.test_assert((select status='approved' and full_name='Public QA applicant' and reviewed_by='00000000-0000-0000-0000-000000000005' from public.membership_applications where user_id=auth.uid()),'claim copies the actual reviewed application and reviewer');
select public.test_error('select * from public.membership_request_emails','42501');
reset role;
select public.test_assert((select count(*)=1 from public.membership_request_reviews),'one pre-account decision audit');
select public.test_assert((select count(*)=1 from public.membership_reviews),'one activation audit, no duplicates');
select public.test_assert((select count(*)=3 from public.membership_request_emails),'approval adds exactly one event, activation sends no second welcome');
select public.test_assert((select count(*)=2 from public.membership_email_outbox),'activation does not enqueue legacy messages');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
select public.test_assert(public.claim_approved_membership(),'existing approved member remains approved');
select public.test_assert((select full_name='Existing member' from public.membership_applications where user_id=auth.uid()),'existing member details preserved');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert(public.claim_approved_membership(),'reviewer remains an admin member without an application');
select public.test_assert(public.public_membership_counts()=jsonb_build_object('pending',0,'approved',0,'declined',0),'linked requests no longer double-count legacy membership');
reset role;
-- Revoke verification after a claim: stale JWT alone no longer reads a request.
update neon_auth."user" set "emailVerified"=false where id='00000000-0000-0000-0000-000000000001';
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_assert((select count(*)=0 from public.membership_requests),'request RLS requires live verified identity');
reset role;
update neon_auth."user" set "emailVerified"=true where id='00000000-0000-0000-0000-000000000001';

-- Fresh decisions, archived rows, and conflicting historical applications.
set role anonymous;
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('declined@invalid.test'),repeat('b',64));
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('archived@invalid.test'),repeat('b',64));
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('conflict@invalid.test'),repeat('b',64));
reset role;
select public.test_assert(not exists(select 1 from neon_auth."user" where email='archived@invalid.test') and exists(select 1 from public.membership_requests where email='archived@invalid.test'),'a public application is stored even when no Auth account exists');
update public.membership_requests set archived_at=now(),updated_at=clock_timestamp() where email='archived@invalid.test';
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.review_public_membership(public.test_request_id('declined@invalid.test'),'declined',public.test_request_version('declined@invalid.test'));
select public.test_error('select public.review_public_membership(public.test_request_id(''archived@invalid.test''),''approved'',public.test_request_version(''archived@invalid.test''))','40001','application_changed');
select public.review_public_membership(public.test_request_id('conflict@invalid.test'),'approved',public.test_request_version('conflict@invalid.test'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000007',false);
select public.test_assert(not public.claim_approved_membership(),'declined request cannot activate membership');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000008',false);
select public.submit_membership(public.test_application('conflict@invalid.test') - 'email');
select public.test_error('select public.claim_approved_membership()','40001','membership_application_conflict');
select public.test_assert((select status='pending' from public.membership_applications where user_id=auth.uid()),'claim never silently overwrites an existing decision');
reset role;

-- Sending is secret-bound and scoped. Anonymous tokens cannot flush all mail.
set role anonymous;
select set_config('request.jwt.claim.sub','anonymous',false);
select public.test_assert(public.public_membership_available('test-secret-with-more-than-thirty-two-characters'),'guest non-UUID subject can check readiness');
select public.test_error('select public.claim_public_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','42501','email_dispatch_forbidden');
create temp table initial_claim as select * from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',public.test_request_id('applicant-a@invalid.test'),1);
select public.test_assert((select count(*)=1 and bool_and(attempts=1 and template_version=4) from initial_claim),'anonymous server can lease one request notification');
select public.test_error('select public.finish_public_membership_email(''wrong-secret-with-more-than-thirty-two-characters'',(select event_id from initial_claim),(select lease_token from initial_claim),''provider'')','42501','email_dispatch_forbidden');
select public.test_error('select public.finish_public_membership_email(''test-secret-with-more-than-thirty-two-characters'',(select event_id from initial_claim),gen_random_uuid(),''provider'')','40001','email_lease_changed');
select public.test_assert(public.finish_public_membership_email('test-secret-with-more-than-thirty-two-characters',(select event_id from initial_claim),(select lease_token from initial_claim),'provider-one'),'provider acceptance acknowledged');
select public.test_assert(public.finish_public_membership_email('test-secret-with-more-than-thirty-two-characters',(select event_id from initial_claim),(select lease_token from initial_claim),'provider-one'),'identical acknowledgement idempotent');
create temp table retry_claim as select * from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',public.test_request_id('applicant-a@invalid.test'),1);
select public.finish_public_membership_email('test-secret-with-more-than-thirty-two-characters',(select event_id from retry_claim),(select lease_token from retry_claim),null,'provider_rate_limit',true);
reset role;
select public.test_assert((select status='pending' and attempts=1 and next_attempt_at>clock_timestamp() from public.membership_request_emails where event_id=(select event_id from retry_claim)),'retryable failure persists with backoff');
update public.membership_request_emails set first_attempt_at=now()-interval '24 hours' where event_id=(select event_id from retry_claim);
set role anonymous;
select * from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',public.test_request_id('applicant-a@invalid.test'),5);
reset role;
select public.test_assert((select status='needs_review' from public.membership_request_emails where event_id=(select event_id from retry_claim)),'expired provider idempotency window stops automatic retries');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert((select count(*)>0 from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',null,10)),'verified reviewer plus secret can flush outstanding request notifications');
reset role;

-- Every rate bound is persistent and rolls across independent server processes.
truncate public.membership_request_rate_events;
insert into public.membership_request_rate_events(rate_key,created_at) select repeat('c',64),now()-interval '2 hours' from generate_series(1,10);
set role anonymous;
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application(''ip-day@invalid.test''),repeat(''c'',64))','P0001','membership_rate_limited');
reset role;
truncate public.membership_request_rate_events;
insert into public.membership_request_rate_events(rate_key,created_at) select repeat('d',64),now() from generate_series(1,50);
set role anonymous;
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application(''global-hour@invalid.test''),repeat(''e'',64))','P0001','membership_rate_limited');
reset role;
truncate public.membership_request_rate_events;
insert into public.membership_request_rate_events(rate_key,created_at) select repeat('d',64),now()-interval '2 hours' from generate_series(1,100);
set role anonymous;
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application(''global-day@invalid.test''),repeat(''e'',64))','P0001','membership_rate_limited');
reset role;
truncate public.membership_request_rate_events;
set role anonymous;
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('concurrent-claim@invalid.test'),repeat('e',64));
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.review_public_membership(public.test_request_id('concurrent-claim@invalid.test'),'approved',public.test_request_version('concurrent-claim@invalid.test'));
reset role;
truncate public.membership_request_rate_events;
insert into public.membership_request_rate_events(rate_key,created_at) select repeat('f',64),now() from generate_series(1,4);
SQL

# Two processes compete for the fifth allowed application from one IP/hour.
"${public_psql[@]}" >"$public_pg_root/rate-a.log" 2>&1 <<SQL &
begin;
set role anonymous;
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('rate-race-a@invalid.test'),repeat('f',64));
\! touch '$public_pg_root/rate-ready'
select pg_sleep(1);
commit;
SQL
public_rate_a_pid=$!
for public_attempt in $(seq 1 100); do
  if [ -f "$public_pg_root/rate-ready" ]; then break; fi
  if ! kill -0 "$public_rate_a_pid" 2>/dev/null; then cat "$public_pg_root/rate-a.log"; exit 1; fi
  sleep 0.05
done
test -f "$public_pg_root/rate-ready"
"${public_psql[@]}" >"$public_pg_root/rate-b.log" <<'SQL'
set statement_timeout='5s';
set role anonymous;
select public.test_error('select public.submit_public_membership(''test-secret-with-more-than-thirty-two-characters'',public.test_application(''rate-race-b@invalid.test''),repeat(''f'',64))','P0001','membership_rate_limited');
SQL
wait "$public_rate_a_pid"

# Two verified sessions activate the same approval: one membership/audit only.
"${public_psql[@]}" >"$public_pg_root/activation-a.log" 2>&1 <<SQL &
begin;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000010',false);
select public.test_assert(public.claim_approved_membership(),'first concurrent activation succeeds');
\! touch '$public_pg_root/activation-ready'
select pg_sleep(1);
commit;
SQL
public_activation_a_pid=$!
for public_attempt in $(seq 1 100); do
  if [ -f "$public_pg_root/activation-ready" ]; then break; fi
  if ! kill -0 "$public_activation_a_pid" 2>/dev/null; then cat "$public_pg_root/activation-a.log"; exit 1; fi
  sleep 0.05
done
test -f "$public_pg_root/activation-ready"
"${public_psql[@]}" >"$public_pg_root/activation-b.log" <<'SQL'
set statement_timeout='5s';
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000010',false);
select public.test_assert(public.claim_approved_membership(),'second concurrent activation returns the same membership');
SQL
wait "$public_activation_a_pid"

# Email leases use SKIP LOCKED so workers never send the same event in parallel.
"${public_psql[@]}" >"$public_pg_root/email-a.log" 2>&1 <<SQL &
begin;
set role anonymous;
select event_id from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',public.test_request_id('concurrent-claim@invalid.test'),1);
\! touch '$public_pg_root/email-ready'
select pg_sleep(1);
commit;
SQL
public_email_a_pid=$!
for public_attempt in $(seq 1 100); do
  if [ -f "$public_pg_root/email-ready" ]; then break; fi
  if ! kill -0 "$public_email_a_pid" 2>/dev/null; then cat "$public_pg_root/email-a.log"; exit 1; fi
  sleep 0.05
done
test -f "$public_pg_root/email-ready"
"${public_psql[@]}" >"$public_pg_root/email-b.log" <<'SQL'
set statement_timeout='500ms';
set role anonymous;
select public.test_assert((select count(*)=1 from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',public.test_request_id('concurrent-claim@invalid.test'),1)),'second email worker skips the locked first event');
SQL
wait "$public_email_a_pid"
"${public_psql[@]}" >"$public_pg_root/final.log" <<'SQL'
select public.test_assert((select count(*)=5 from public.membership_request_rate_events),'concurrent intake never exceeds IP/hour cap');
select public.test_assert((select count(*)=1 from public.membership_requests where email like 'rate-race-%'),'only one concurrent contender creates an application');
select public.test_assert((select count(*)=0 from public.membership_requests where email in ('ip-day@invalid.test','global-hour@invalid.test','global-day@invalid.test')),'rate rejection persists no application or notification');
select public.test_assert((select count(*)=1 from public.membership_applications where user_id='00000000-0000-0000-0000-000000000010'),'concurrent activation creates one membership');
select public.test_assert((select count(*)=1 from public.membership_reviews where applicant_user_id='00000000-0000-0000-0000-000000000010'),'concurrent activation creates one copied audit');
select public.test_assert((select count(*)=2 and bool_and(attempts=1) from public.membership_request_emails where request_id=public.test_request_id('concurrent-claim@invalid.test') and status='sending'),'concurrent mail workers lease distinct events exactly once');
delete from neon_auth."user" where id='00000000-0000-0000-0000-000000000001';
select public.test_assert((select count(*)=0 from public.membership_requests where email='applicant-a@invalid.test'),'linked account deletion also removes request and private outbox');
select public.test_assert((select count(*)=0 from public.membership_applications where email='applicant-a@invalid.test'),'linked legacy membership is deleted through existing cascade');
SQL

# Green templates are new event versions, never a rewrite of earlier payloads.
# Exercise the existing enqueue/claim functions on both intake paths so default
# changes cannot silently leave one family of future emails in the old theme.
"${public_psql[@]}" >"$public_pg_root/green-fixtures.log" <<'SQL'
insert into neon_auth."user" (id,email,"emailVerified") values
 ('20000000-0000-0000-0000-000000000001','green-before-account@invalid.test',true),
 ('20000000-0000-0000-0000-000000000002','green-account-approved@invalid.test',true),
 ('20000000-0000-0000-0000-000000000003','green-account-declined@invalid.test',true);
set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-0000-0000-000000000001',false);
select public.submit_membership(public.test_application('green-before-account@invalid.test','Old account theme') - 'email');
reset role;
set role anonymous;
select set_config('request.jwt.claim.sub','anonymous',false);
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('green-before-request@invalid.test','Old request theme'),repeat('0',64));
reset role;
update public.membership_email_outbox set status='sent', provider_id='old-legacy-provider-receipt', sent_at=clock_timestamp(),
  first_attempt_at=clock_timestamp(),last_attempt_at=clock_timestamp(),attempts=1
  where applicant_user_id='20000000-0000-0000-0000-000000000001' and kind='application_received';
update public.membership_email_outbox set status='pending',first_attempt_at=clock_timestamp(),last_attempt_at=clock_timestamp(),
  attempts=1,next_attempt_at=clock_timestamp()-interval '1 minute',last_error='simulated_rate_limit'
  where applicant_user_id='20000000-0000-0000-0000-000000000001' and kind='founder_alert';
update public.membership_request_emails set status='sent',provider_id='old-request-provider-receipt',sent_at=clock_timestamp(),
  first_attempt_at=clock_timestamp(),last_attempt_at=clock_timestamp(),attempts=1
  where request_id=public.test_request_id('green-before-request@invalid.test') and kind='application_received';
update public.membership_request_emails set status='pending',first_attempt_at=clock_timestamp(),last_attempt_at=clock_timestamp(),
  attempts=1,next_attempt_at=clock_timestamp()-interval '1 minute',last_error='simulated_rate_limit'
  where request_id=public.test_request_id('green-before-request@invalid.test') and kind='founder_alert';
select public.test_assert((select count(*)=2 and bool_and(template_version=3) from public.membership_email_outbox where applicant_user_id='20000000-0000-0000-0000-000000000001'),'old legacy theme fixtures use version three');
select public.test_assert((select count(*)=2 and bool_and(template_version=4) from public.membership_request_emails where request_id=public.test_request_id('green-before-request@invalid.test')),'old public theme fixtures use version four');
create table public.test_green_legacy_snapshot as select * from public.membership_email_outbox;
create table public.test_green_request_snapshot as select * from public.membership_request_emails;
create table public.test_green_applications_snapshot as select * from public.membership_applications;
create table public.test_green_intake_snapshot as select * from public.membership_requests;
create table public.test_green_settings_snapshot as select * from public.membership_email_settings;
SQL

"${public_psql[@]}" -f "$public_repo_root/neon/migrations/20261125160000_green_email_templates.sql" >"$public_pg_root/green-migration.log" 2>&1

"${public_psql[@]}" >"$public_pg_root/green-checks.log" <<'SQL'
select public.test_assert((select jsonb_agg(to_jsonb(e) order by event_id) from public.membership_email_outbox e) = (select jsonb_agg(to_jsonb(e) order by event_id) from public.test_green_legacy_snapshot e),'green migration preserves every legacy event field, including pending/sending/sent snapshots');
select public.test_assert((select jsonb_agg(to_jsonb(e) order by event_id) from public.membership_request_emails e) = (select jsonb_agg(to_jsonb(e) order by event_id) from public.test_green_request_snapshot e),'green migration preserves every public event field, including pending/sending/sent snapshots');
select public.test_assert((select jsonb_agg(to_jsonb(a) order by user_id) from public.membership_applications a) = (select jsonb_agg(to_jsonb(a) order by user_id) from public.test_green_applications_snapshot a),'green migration changes no memberships or decisions');
select public.test_assert((select jsonb_agg(to_jsonb(r) order by id) from public.membership_requests r) = (select jsonb_agg(to_jsonb(r) order by id) from public.test_green_intake_snapshot r),'green migration changes no public applications or decisions');
select public.test_assert((select jsonb_agg(to_jsonb(s)) from public.membership_email_settings s) = (select jsonb_agg(to_jsonb(s)) from public.test_green_settings_snapshot s),'green migration preserves email settings');
select public.test_assert(not has_table_privilege('authenticated','public.membership_email_outbox','SELECT,INSERT,UPDATE,DELETE') and not has_table_privilege('anonymous','public.membership_email_outbox','SELECT,INSERT,UPDATE,DELETE'),'legacy outbox remains private');
select public.test_assert(not has_table_privilege('authenticated','public.membership_request_emails','SELECT,INSERT,UPDATE,DELETE') and not has_table_privilege('anonymous','public.membership_request_emails','SELECT,INSERT,UPDATE,DELETE'),'public outbox remains private');
select public.test_assert((select bool_and(relrowsecurity) from pg_class where oid in ('public.membership_email_outbox'::regclass,'public.membership_request_emails'::regclass)),'both outboxes retain RLS');
select public.test_error('update public.membership_email_outbox set template_version=4','23514');
select public.test_error('update public.membership_request_emails set template_version=3','23514');

-- A retry after rollout still returns the original version and immutable event.
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
create temp table green_legacy_retry as select * from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters','20000000-0000-0000-0000-000000000001',10);
select public.test_assert((select count(*)=1 and bool_and(template_version=3 and kind='founder_alert' and attempts=2) from green_legacy_retry),'old legacy retry retains version three and advances its existing lease');
reset role;
set role anonymous;
create temp table green_request_retry as select * from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',public.test_request_id('green-before-request@invalid.test'),10);
select public.test_assert((select count(*)=1 and bool_and(template_version=4 and kind='founder_alert' and attempts=2) from green_request_retry),'old public retry retains version four and advances its existing lease');
reset role;
select public.test_assert((select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'last_error' from public.membership_email_outbox e where event_id=(select event_id from green_legacy_retry)) = (select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'last_error' from public.test_green_legacy_snapshot e where event_id=(select event_id from green_legacy_retry)),'legacy retry retains its original ID, recipient, content and first-attempt timestamp');
select public.test_assert((select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'last_error' from public.membership_request_emails e where event_id=(select event_id from green_request_retry)) = (select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'last_error' from public.test_green_request_snapshot e where event_id=(select event_id from green_request_retry)),'public retry retains its original ID, recipient, content and first-attempt timestamp');

set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-0000-0000-000000000002',false);
select public.submit_membership(public.test_application('green-account-approved@invalid.test','Green account approval') - 'email');
select set_config('request.jwt.claim.sub','20000000-0000-0000-0000-000000000003',false);
select public.submit_membership(public.test_application('green-account-declined@invalid.test','Green account decline') - 'email');
reset role;
set role anonymous;
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('green-request-approved@invalid.test','Green request approval'),repeat('1',64));
select public.submit_public_membership('test-secret-with-more-than-thirty-two-characters',public.test_application('green-request-declined@invalid.test','Green request decline'),repeat('1',64));
reset role;
select public.test_assert((select count(*)=4 and bool_and(template_version=5) from public.membership_email_outbox where applicant_user_id in ('20000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000003')),'both new legacy applications queue version-five receipt and founder alert');
select public.test_assert((select count(*)=4 and bool_and(template_version=5) from public.membership_request_emails where request_id in (public.test_request_id('green-request-approved@invalid.test'),public.test_request_id('green-request-declined@invalid.test'))),'both new public applications queue version-five receipt and founder alert');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.review_membership('20000000-0000-0000-0000-000000000001','approved',(select updated_at from public.membership_applications where user_id='20000000-0000-0000-0000-000000000001'));
select public.review_membership('20000000-0000-0000-0000-000000000002','approved',(select updated_at from public.membership_applications where user_id='20000000-0000-0000-0000-000000000002'));
select public.review_membership('20000000-0000-0000-0000-000000000003','declined',(select updated_at from public.membership_applications where user_id='20000000-0000-0000-0000-000000000003'));
select public.review_public_membership(public.test_request_id('green-before-request@invalid.test'),'approved',public.test_request_version('green-before-request@invalid.test'));
select public.review_public_membership(public.test_request_id('green-request-approved@invalid.test'),'approved',public.test_request_version('green-request-approved@invalid.test'));
select public.review_public_membership(public.test_request_id('green-request-declined@invalid.test'),'declined',public.test_request_version('green-request-declined@invalid.test'));
reset role;
select public.test_assert((select count(*)=3 and bool_and(template_version=5) from public.membership_email_outbox where applicant_user_id in ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000003') and kind in ('application_approved','application_declined')),'all future account decisions use green version five, including a pre-rollout application');
select public.test_assert((select count(*)=3 and bool_and(template_version=5) from public.membership_request_emails where request_id in (public.test_request_id('green-before-request@invalid.test'),public.test_request_id('green-request-approved@invalid.test'),public.test_request_id('green-request-declined@invalid.test')) and kind in ('application_approved','application_declined')),'all future public decisions use green version five, including a pre-rollout application');
select public.test_assert((select count(*)=2 and bool_and(template_version=3) from public.membership_email_outbox where applicant_user_id='20000000-0000-0000-0000-000000000001' and kind in ('founder_alert','application_received')),'pre-rollout account initial emails remain blue version three after a green decision');
select public.test_assert((select count(*)=2 and bool_and(template_version=4) from public.membership_request_emails where request_id=public.test_request_id('green-before-request@invalid.test') and kind in ('founder_alert','application_received')),'pre-rollout public initial emails remain blue version four after a green decision');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.test_assert((select count(*)=3 and bool_and(template_version=5) from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters','20000000-0000-0000-0000-000000000002',10)),'existing account dispatcher returns green events unchanged');
select public.test_assert((select count(*)=3 and bool_and(template_version=5) from public.claim_public_membership_emails('test-secret-with-more-than-thirty-two-characters',public.test_request_id('green-request-approved@invalid.test'),10)),'existing public dispatcher returns green events unchanged');
reset role;
SQL
printf 'Public membership database checks passed (disposable PostgreSQL; no external database or email used).\n'
