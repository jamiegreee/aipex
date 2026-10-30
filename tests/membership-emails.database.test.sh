#!/usr/bin/env bash
# Disposable PostgreSQL only: no live Neon project or real email API is used.
set -euo pipefail
emails_pg_bin="${AIPEX_TEST_PG_BIN:-/opt/homebrew/opt/postgresql@15/bin}"
emails_repo_root="$(cd "$(dirname "$0")/.." && pwd)"
emails_pg_root="$(mktemp -d /private/tmp/aipex-membership-emails-pg.XXXXXX)"
emails_pg_port=55451
cleanup() {
  emails_exit_status=$?
  if [ "$emails_exit_status" -ne 0 ]; then
    for emails_log in "$emails_pg_root"/*.log; do
      if [ -f "$emails_log" ]; then tail -20 "$emails_log" >&2; fi
    done
  fi
  if [ -f "$emails_pg_root/data/postmaster.pid" ]; then
    "$emails_pg_bin/pg_ctl" -D "$emails_pg_root/data" -m immediate -w stop >/dev/null 2>&1 || true
  fi
  rm -rf "$emails_pg_root"
}
trap cleanup EXIT
"$emails_pg_bin/initdb" -D "$emails_pg_root/data" --auth=trust --encoding=UTF8 --locale=C --no-instructions >"$emails_pg_root/init.log" 2>&1
"$emails_pg_bin/pg_ctl" -D "$emails_pg_root/data" -l "$emails_pg_root/server.log" -o "-p $emails_pg_port -h 127.0.0.1 -k $emails_pg_root" -w start >/dev/null
emails_psql=("$emails_pg_bin/psql" -X -q -v ON_ERROR_STOP=1 -h "$emails_pg_root" -p "$emails_pg_port" -d postgres)

"${emails_psql[@]}" >"$emails_pg_root/setup.log" <<'SQL'
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
create function public.test_application(name text default 'Test applicant') returns jsonb language sql as $$
  select jsonb_build_object('fullName',name,'role','Policy adviser','organisation','Fictional test ministry','country','United Kingdom','interests',jsonb_build_array('economy'),'motivation','Fictional applicant testing membership notification delivery and access controls.','agreement',true);
$$;
insert into neon_auth."user" (id,email,"emailVerified") values
 ('00000000-0000-0000-0000-000000000001','applicant-a@invalid.test',true),
 ('00000000-0000-0000-0000-000000000002','applicant-b@invalid.test',true),
 ('00000000-0000-0000-0000-000000000003','applicant-c@invalid.test',true),
 ('00000000-0000-0000-0000-000000000004','unverified@invalid.test',false),
 ('00000000-0000-0000-0000-000000000005','reviewer@invalid.test',true),
 ('00000000-0000-0000-0000-000000000006','historical@invalid.test',true);
SQL
"${emails_psql[@]}" -f "$emails_repo_root/neon/migrations/20261029180000_membership_applications.sql" >"$emails_pg_root/membership-migration.log" 2>&1
"${emails_psql[@]}" >"$emails_pg_root/history.log" <<'SQL'
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000006',false);
select public.submit_membership(public.test_application('Historical applicant'));
SQL
"${emails_psql[@]}" -f "$emails_repo_root/neon/migrations/20261030170000_membership_emails.sql" >"$emails_pg_root/emails-migration.log" 2>&1

"${emails_psql[@]}" >"$emails_pg_root/checks.log" <<'SQL'
select public.test_assert((select count(*)=0 from public.membership_email_outbox),'migration never backfills historical applications');
set role anonymous;
select public.test_error('select * from public.membership_email_outbox','42501');
select public.test_error('select public.claim_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','42501');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_error('select * from public.membership_email_outbox','42501');
select public.test_error('select * from public.membership_email_settings','42501');
select public.test_error('select public._membership_email_dispatch_actor(''test-secret-with-more-than-thirty-two-characters'')','42501');
select public.test_error('select public.claim_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','55000','email_dispatch_not_configured');
reset role;
insert into public.membership_email_settings(dispatch_secret_hash) values (sha256(convert_to('test-secret-with-more-than-thirty-two-characters','UTF8')));
insert into public.membership_reviewers(user_id) values ('00000000-0000-0000-0000-000000000005');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
select public.test_error('select public.claim_membership_emails(''test-secret-with-more-than-thirty-two-characters'')','42501','verified_account_required');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.test_error('select public.claim_membership_emails(''wrong-secret-with-more-than-thirty-two-characters'')','42501','email_dispatch_forbidden');
select public.test_error('select public.claim_membership_emails(''test-secret-with-more-than-thirty-two-characters'',null,100)','22023','invalid_email_batch');
select public.test_error('select public.membership_email_counts()','42501','reviewer_required');
begin;
select public.submit_membership(public.test_application());
rollback;
reset role;
select public.test_assert((select count(*)=0 from public.membership_email_outbox),'rolled-back submission creates no durable notification');
set role authenticated;
select public.submit_membership(public.test_application());
select public.submit_membership(public.test_application('Duplicate must not replace snapshot'));
reset role;
select public.test_assert((select count(*)=2 from public.membership_email_outbox),'first submission creates exactly two events, retry creates none');
select public.test_assert((select recipient_email='green.jcb@gmail.com' from public.membership_email_outbox where kind='founder_alert'),'founder address is fixed');
select public.test_assert((select recipient_email='applicant-a@invalid.test' and applicant_name='Test applicant' and template_version=1 from public.membership_email_outbox where kind='application_received'),'applicant recipient and payload snapshot derive from verified application');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select public.test_error('select public.claim_membership_emails(''test-secret-with-more-than-thirty-two-characters'',''00000000-0000-0000-0000-000000000001'')','42501','email_dispatch_forbidden');
select public.test_assert((select count(*)=0 from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters')),'B cannot claim A events through null scope');
select public.submit_membership(public.test_application('Applicant B'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
create temp table first_claim as select * from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters',null,1);
select public.test_assert((select count(*)=1 and bool_and(attempts=1 and lease_token is not null) from first_claim),'claim leases one own notification');
select public.test_error('select public.finish_membership_email(''test-secret-with-more-than-thirty-two-characters'',(select event_id from first_claim),gen_random_uuid(),''provider-test'')','40001','email_lease_changed');
select public.test_assert(public.finish_membership_email('test-secret-with-more-than-thirty-two-characters',(select event_id from first_claim),(select lease_token from first_claim),'provider-accepted-a'),'successful provider acceptance can be acknowledged');
select public.test_assert(public.finish_membership_email('test-secret-with-more-than-thirty-two-characters',(select event_id from first_claim),(select lease_token from first_claim),'provider-accepted-a'),'repeated identical acknowledgement is idempotent');
create temp table retry_claim as select * from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters');
select public.test_assert((select count(*)=1 from retry_claim),'sent event is excluded and applicant never claims B events');
select public.finish_membership_email('test-secret-with-more-than-thirty-two-characters',(select event_id from retry_claim),(select lease_token from retry_claim),null,'provider_rate_limit',true);
select public.test_assert((select count(*)=0 from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters')),'backoff prevents immediate retry');
reset role;
select public.test_assert((select status='pending' and attempts=1 and next_attempt_at > clock_timestamp() from public.membership_email_outbox where event_id=(select event_id from retry_claim)),'retryable failure is durably pending with backoff');
update public.membership_email_outbox set next_attempt_at=now()-interval '1 minute' where event_id=(select event_id from retry_claim);
set role authenticated;
create temp table second_claim as select * from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters');
select public.test_assert((select event_id=(select event_id from retry_claim) and lease_token<>(select lease_token from retry_claim) and attempts=2 and first_attempt_at=(select first_attempt_at from retry_claim) from second_claim),'retry retains stable event key/first attempt and creates a new lease');
select public.test_error('select public.finish_membership_email(''test-secret-with-more-than-thirty-two-characters'',(select event_id from retry_claim),(select lease_token from retry_claim),''stale-provider'')','40001','email_lease_changed');
select public.finish_membership_email('test-secret-with-more-than-thirty-two-characters',(select event_id from second_claim),(select lease_token from second_claim),null,'invalid_recipient',false);
reset role;
select public.test_assert((select status='failed' from public.membership_email_outbox where event_id=(select event_id from second_claim)),'permanent failure is not retried automatically');

-- Decisions and their notifications share one transaction.
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
begin;
select public.review_membership('00000000-0000-0000-0000-000000000001','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000001'));
rollback;
reset role;
select public.test_assert((select count(*)=0 from public.membership_email_outbox where kind='application_approved'),'rolled-back review creates no notification');
set role authenticated;
select public.review_membership('00000000-0000-0000-0000-000000000001','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000001'));
select public.review_membership('00000000-0000-0000-0000-000000000002','declined',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000002'));
select public.test_error('select public.review_membership(''00000000-0000-0000-0000-000000000001'',''declined'',now())','40001','application_changed');
reset role;
select public.test_assert((select count(*)=1 from public.membership_email_outbox where kind='application_approved' and recipient_email='applicant-a@invalid.test'),'approval enqueues one message for the actual applicant');
select public.test_assert((select count(*)=1 from public.membership_email_outbox where kind='application_declined' and recipient_email='applicant-b@invalid.test'),'decline enqueues one message for the actual applicant');
update public.membership_email_outbox set first_attempt_at=now()-interval '24 hours',attempts=1 where kind='application_approved';
set role authenticated;
create temp table reviewer_claim as select * from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters',null,10);
select public.test_assert((select count(*)=3 from reviewer_claim),'reviewer can claim other applicants outstanding notifications');
reset role;
select public.test_assert((select status='needs_review' from public.membership_email_outbox where kind='application_approved'),'expired idempotency window requires reconciliation instead of a new send');
-- Expired leases can be reclaimed within the safe provider window.
update public.membership_email_outbox set lease_expires_at=now()-interval '1 minute' where event_id=(select event_id from reviewer_claim limit 1);
set role authenticated;
create temp table reclaimed as select * from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters');
select public.test_assert((select count(*)=1 and bool_and(attempts=2) from reclaimed),'expired lease is recovered once while key remains safe');
select public.test_assert((public.membership_email_counts()->>'needs_review')::integer=1,'reviewer sees manual reconciliation count');
reset role;
-- Stale unacknowledged sends at the attempt cap must not be retried forever.
update public.membership_email_outbox set attempts=5,lease_expires_at=now()-interval '1 minute' where event_id=(select event_id from reclaimed);
set role authenticated;
select public.test_assert((select count(*)=0 from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters')),'attempt cap stops stale ambiguous work');
reset role;
select public.test_assert((select status='needs_review' from public.membership_email_outbox where event_id=(select event_id from reclaimed)),'exhausted ambiguous lease requires manual reconciliation');
-- Set up fresh C events for an independent concurrency check.
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select public.submit_membership(public.test_application('Concurrency fixture'));
SQL

# A worker holds one claimed event locked; a second must skip it, not duplicate it.
"${emails_psql[@]}" >"$emails_pg_root/claim-a.log" 2>&1 <<SQL &
begin;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select event_id from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters',null,1);
\! touch '$emails_pg_root/claim-ready'
select pg_sleep(1);
commit;
SQL
emails_claim_a_pid=$!
for emails_attempt in $(seq 1 100); do
  if [ -f "$emails_pg_root/claim-ready" ]; then break; fi
  if ! kill -0 "$emails_claim_a_pid" 2>/dev/null; then cat "$emails_pg_root/claim-a.log"; exit 1; fi
  sleep 0.05
done
test -f "$emails_pg_root/claim-ready"
"${emails_psql[@]}" >"$emails_pg_root/claim-b.log" <<'SQL'
set statement_timeout='500ms';
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select public.test_assert((select count(*)=1 from public.claim_membership_emails('test-secret-with-more-than-thirty-two-characters',null,1)),'second worker skips the first locked claim');
SQL
wait "$emails_claim_a_pid"
"${emails_psql[@]}" >"$emails_pg_root/final.log" <<'SQL'
select public.test_assert((select count(*)=2 and bool_and(attempts=1 and status='sending') from public.membership_email_outbox where applicant_user_id='00000000-0000-0000-0000-000000000003'),'concurrent workers claim distinct events once');
select public.test_assert((select count(*)=0 from public.membership_email_outbox where applicant_user_id='00000000-0000-0000-0000-000000000006'),'unrelated historical application remains unsent');
SQL
printf 'Membership email database checks passed (disposable PostgreSQL 15; no external database or email used).\n'
