#!/usr/bin/env bash
# Disposable PostgreSQL only: no live Neon project or real email API is used.
set -euo pipefail
version_pg_bin="${AIPEX_TEST_PG_BIN:-/opt/homebrew/opt/postgresql@15/bin}"
version_repo_root="$(cd "$(dirname "$0")/.." && pwd)"
version_pg_root="$(mktemp -d /private/tmp/aipex-membership-email-version-pg.XXXXXX)"
version_pg_port=55453
cleanup() {
  version_exit_status=$?
  if [ "$version_exit_status" -ne 0 ]; then
    for version_log in "$version_pg_root"/*.log; do
      if [ -f "$version_log" ]; then tail -25 "$version_log" >&2; fi
    done
  fi
  if [ -f "$version_pg_root/data/postmaster.pid" ]; then
    "$version_pg_bin/pg_ctl" -D "$version_pg_root/data" -m immediate -w stop >/dev/null 2>&1 || true
  fi
  rm -rf "$version_pg_root"
}
trap cleanup EXIT
"$version_pg_bin/initdb" -D "$version_pg_root/data" --auth=trust --encoding=UTF8 --locale=C --no-instructions >"$version_pg_root/init.log" 2>&1
"$version_pg_bin/pg_ctl" -D "$version_pg_root/data" -l "$version_pg_root/server.log" -o "-p $version_pg_port -h 127.0.0.1 -k $version_pg_root" -w start >/dev/null
version_psql=("$version_pg_bin/psql" -X -q -v ON_ERROR_STOP=1 -h "$version_pg_root" -p "$version_pg_port" -d postgres)

"${version_psql[@]}" >"$version_pg_root/setup.log" <<'SQL'
create role authenticated noinherit;
create role anonymous noinherit;
create schema neon_auth;
create schema auth;
create table neon_auth."user" (id uuid primary key, email text unique not null, "emailVerified" boolean not null default false);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $$;
grant usage on schema auth, public to authenticated, anonymous;
create function public.test_assert(value boolean, message text) returns void language plpgsql as $$ begin if value is distinct from true then raise exception 'ASSERTION FAILED: %', message; end if; end; $$;
create function public.test_error(query text, expected_code text) returns void language plpgsql as $$
declare actual_code text;
begin
  begin execute query;
  exception when others then
    get stacked diagnostics actual_code = returned_sqlstate;
    if actual_code <> expected_code then
      raise exception 'Expected %, got %', expected_code, actual_code;
    end if;
    return;
  end;
  raise exception 'Expected error %, but query succeeded', expected_code;
end; $$;
create function public.test_application(name text) returns jsonb language sql as $$
  select jsonb_build_object('fullName',name,'role','Policy adviser','organisation','Fictional test ministry','country','United Kingdom','interests',jsonb_build_array('economy'),'motivation','Fictional applicant testing versioned membership email delivery and retries.','agreement',true);
$$;
insert into neon_auth."user" (id,email,"emailVerified") values
 ('00000000-0000-0000-0000-000000000001','historical-version-one@invalid.test',true),
 ('00000000-0000-0000-0000-000000000002','new-approved@invalid.test',true),
 ('00000000-0000-0000-0000-000000000003','new-declined@invalid.test',true),
 ('00000000-0000-0000-0000-000000000005','reviewer@invalid.test',true);
SQL
"${version_psql[@]}" -f "$version_repo_root/neon/migrations/20261029180000_membership_applications.sql" >"$version_pg_root/membership-migration.log" 2>&1
"${version_psql[@]}" -f "$version_repo_root/neon/migrations/20261030170000_membership_emails.sql" >"$version_pg_root/emails-migration.log" 2>&1

"${version_psql[@]}" >"$version_pg_root/fixtures.log" <<'SQL'
insert into public.membership_email_settings(dispatch_secret_hash)
  values (sha256(convert_to('version-test-secret-with-more-than-thirty-two-characters','UTF8')));
insert into public.membership_reviewers(user_id) values ('00000000-0000-0000-0000-000000000005');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select public.submit_membership(public.test_application('Original version-one applicant'));
reset role;
-- One old event was delivered; the other has a retry pending. Neither event
-- may acquire new content or a fresh idempotency key during a template rollout.
update public.membership_email_outbox set attempts=1, first_attempt_at=clock_timestamp(), last_attempt_at=clock_timestamp();
update public.membership_email_outbox set status='sent', provider_id='version-one-original-provider-receipt', sent_at=clock_timestamp()
  where kind='application_received';
select public.test_assert((select count(*)=2 and bool_and(template_version=1) from public.membership_email_outbox),'fixtures were created using the original version-one default');
create table public.test_v1_snapshot as select * from public.membership_email_outbox;
SQL

"${version_psql[@]}" -f "$version_repo_root/neon/migrations/20261031100000_membership_email_template_v2.sql" >"$version_pg_root/version-migration.log" 2>&1

"${version_psql[@]}" >"$version_pg_root/checks.log" <<'SQL'
select public.test_assert(
  (select jsonb_agg(to_jsonb(e) order by event_id) from public.membership_email_outbox e)
  = (select jsonb_agg(to_jsonb(e) order by event_id) from public.test_v1_snapshot e),
  'migration preserves every existing pending/sent event field byte-for-byte');
select public.test_assert(not has_table_privilege('authenticated','public.membership_email_outbox','SELECT,INSERT,UPDATE,DELETE'),'version migration grants no authenticated outbox access');
select public.test_assert(not has_table_privilege('anonymous','public.membership_email_outbox','SELECT,INSERT,UPDATE,DELETE'),'version migration grants no anonymous outbox access');
select public.test_error('update public.membership_email_outbox set template_version=3','23514');

-- Both the returned claim and a subsequent retry retain the old event ID,
-- snapshot and template version, even though new inserts now default to two.
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
create temp table first_v1_claim as select * from public.claim_membership_emails('version-test-secret-with-more-than-thirty-two-characters');
select public.test_assert((select count(*)=1 and bool_and(template_version=1 and kind='founder_alert' and attempts=2) from first_v1_claim),'old pending notification is claimed as version one and sent notification is excluded');
select public.finish_membership_email('version-test-secret-with-more-than-thirty-two-characters',(select event_id from first_v1_claim),(select lease_token from first_v1_claim),null,'simulated_rate_limit',true);
reset role;
update public.membership_email_outbox set next_attempt_at=clock_timestamp()-interval '1 minute' where event_id=(select event_id from first_v1_claim);
set role authenticated;
create temp table second_v1_claim as select * from public.claim_membership_emails('version-test-secret-with-more-than-thirty-two-characters');
select public.test_assert((select count(*)=1 and bool_and(event_id=(select event_id from first_v1_claim) and template_version=1 and attempts=3 and first_attempt_at=(select first_attempt_at from first_v1_claim)) from second_v1_claim),'retry retains the original ID, version and first-attempt timestamp');
select public.finish_membership_email('version-test-secret-with-more-than-thirty-two-characters',(select event_id from second_v1_claim),(select lease_token from second_v1_claim),'version-one-retry-provider-receipt');
reset role;
select public.test_assert(
  (select to_jsonb(e) from public.membership_email_outbox e where kind='application_received')
  = (select to_jsonb(e) from public.test_v1_snapshot e where kind='application_received'),
  'already delivered version-one event and provider receipt remain untouched');
select public.test_assert(
  (select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'provider_id'-'sent_at'-'last_error' from public.membership_email_outbox e where kind='founder_alert')
  = (select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'provider_id'-'sent_at'-'last_error' from public.test_v1_snapshot e where kind='founder_alert'),
  'version-one retry retains immutable identity, recipient, content fields, version and creation time');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select public.submit_membership(public.test_application('New version-two approval applicant'));
select public.submit_membership(public.test_application('Duplicate must not replace the new snapshot'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select public.submit_membership(public.test_application('New version-two decline applicant'));
reset role;
select public.test_assert((select count(*)=4 and bool_and(template_version=2) from public.membership_email_outbox where applicant_user_id in ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003')),'new submissions create exactly two version-two events each; duplicates do not create or rewrite events');
select public.test_assert((select count(*)=2 and bool_and(recipient_email='green.jcb@gmail.com') from public.membership_email_outbox where template_version=2 and kind='founder_alert'),'new founder alerts retain their fixed recipient');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.review_membership('00000000-0000-0000-0000-000000000002','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000002'));
select public.review_membership('00000000-0000-0000-0000-000000000003','declined',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000003'));
create temp table v2_claim as select * from public.claim_membership_emails('version-test-secret-with-more-than-thirty-two-characters',null,10);
select public.test_assert((select count(*)=6 and bool_and(template_version=2) from v2_claim),'new application and decision events are all claimed as version two');
select public.test_assert((select count(*)=1 and bool_and(recipient_email='new-approved@invalid.test') from v2_claim where kind='application_approved'),'version-two approval targets the verified applicant');
select public.test_assert((select count(*)=1 and bool_and(recipient_email='new-declined@invalid.test') from v2_claim where kind='application_declined'),'version-two decline targets the verified applicant');
select public.test_error('select * from public.membership_email_outbox','42501');
reset role;
select public.test_assert((select count(*)=2 and bool_and(template_version=1 and status='sent') from public.membership_email_outbox where applicant_user_id='00000000-0000-0000-0000-000000000001'),'original events stay version one and are not reclaimed with the new batch');
SQL
# Capture both delivered and retriable version-two events before rolling out
# Slack invitations. Schema-only migration must not rewrite either kind.
"${version_psql[@]}" >"$version_pg_root/v3-fixtures.log" <<'SQL'
update public.membership_email_outbox set status='sent', provider_id='version-two-original-provider-receipt', sent_at=clock_timestamp(), lease_token=null, lease_expires_at=null
  where template_version=2 and kind='application_received' and recipient_email='new-approved@invalid.test';
update public.membership_email_outbox set status='pending', last_error='simulated_rate_limit', lease_token=null, lease_expires_at=null
  where template_version=2 and kind='founder_alert' and applicant_name='New version-two approval applicant';
update public.membership_email_outbox set next_attempt_at=clock_timestamp()-interval '1 minute'
  where template_version=2 and status='pending';
create table public.test_before_v3_snapshot as select * from public.membership_email_outbox;
select public.test_assert((select count(*)=1 from public.membership_email_outbox where template_version=2 and status='sent'),'version-two delivered fixture exists');
select public.test_assert((select count(*)=1 from public.membership_email_outbox where template_version=2 and status='pending'),'version-two retriable fixture exists');
insert into neon_auth."user" (id,email,"emailVerified") values
 ('00000000-0000-0000-0000-000000000004','version-three-approved@invalid.test',true),
 ('00000000-0000-0000-0000-000000000006','version-three-declined@invalid.test',true);
SQL

"${version_psql[@]}" -f "$version_repo_root/neon/migrations/20261031190000_membership_email_template_v3.sql" >"$version_pg_root/v3-migration.log" 2>&1

"${version_psql[@]}" >"$version_pg_root/v3-checks.log" <<'SQL'
select public.test_assert(
  (select jsonb_agg(to_jsonb(e) order by event_id) from public.membership_email_outbox e)
  = (select jsonb_agg(to_jsonb(e) order by event_id) from public.test_before_v3_snapshot e),
  'version-three migration leaves every existing version-one and version-two event field unchanged');
select public.test_assert(not has_table_privilege('authenticated','public.membership_email_outbox','SELECT,INSERT,UPDATE,DELETE'),'version-three migration grants no authenticated outbox access');
select public.test_assert(not has_table_privilege('anonymous','public.membership_email_outbox','SELECT,INSERT,UPDATE,DELETE'),'version-three migration grants no anonymous outbox access');
select public.test_error('update public.membership_email_outbox set template_version=4','23514');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
create temp table v2_retry_after_v3 as select * from public.claim_membership_emails('version-test-secret-with-more-than-thirty-two-characters','00000000-0000-0000-0000-000000000002',10);
select public.test_assert((select count(*)=1 and bool_and(template_version=2 and kind='founder_alert' and attempts=2) from v2_retry_after_v3),'pending version-two event is still claimed as version two');
reset role;
select public.test_assert(
  (select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'last_error' from public.membership_email_outbox e where event_id=(select event_id from v2_retry_after_v3))
  = (select to_jsonb(e)-'status'-'attempts'-'next_attempt_at'-'lease_token'-'lease_expires_at'-'last_attempt_at'-'last_error' from public.test_before_v3_snapshot e where event_id=(select event_id from v2_retry_after_v3)),
  'version-two retry retains its original event ID, content snapshot, first attempt and version');
select public.test_assert(
  (select to_jsonb(e) from public.membership_email_outbox e where provider_id='version-two-original-provider-receipt')
  = (select to_jsonb(e) from public.test_before_v3_snapshot e where provider_id='version-two-original-provider-receipt'),
  'delivered version-two event and provider receipt remain untouched');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
select public.submit_membership(public.test_application('Version-three approval applicant'));
select public.submit_membership(public.test_application('Duplicate version-three application'));
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000006',false);
select public.submit_membership(public.test_application('Version-three decline applicant'));
reset role;
select public.test_assert((select count(*)=4 and bool_and(template_version=3) from public.membership_email_outbox where applicant_user_id in ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000006')),'new submissions create exactly two version-three events each without replacing duplicate snapshots');
select public.test_assert((select count(*)=2 and bool_and(recipient_email='green.jcb@gmail.com') from public.membership_email_outbox where template_version=3 and kind='founder_alert'),'version-three founder alerts retain their fixed recipient');

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select public.review_membership('00000000-0000-0000-0000-000000000004','approved',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000004'));
select public.review_membership('00000000-0000-0000-0000-000000000006','declined',(select updated_at from public.membership_applications where user_id='00000000-0000-0000-0000-000000000006'));
create temp table v3_claim as select * from public.claim_membership_emails('version-test-secret-with-more-than-thirty-two-characters',null,10);
select public.test_assert((select count(*)=6 and bool_and(template_version=3) from v3_claim),'new application and decision events are all claimed as version three');
select public.test_assert((select count(*)=1 and bool_and(recipient_email='version-three-approved@invalid.test') from v3_claim where kind='application_approved'),'version-three approval targets only the verified approved applicant');
select public.test_assert((select count(*)=1 and bool_and(recipient_email='version-three-declined@invalid.test') from v3_claim where kind='application_declined'),'version-three decline targets the verified declined applicant');
select public.test_error('select * from public.membership_email_outbox','42501');
reset role;
select public.test_assert((select count(*)=2 and bool_and(template_version=1 and status='sent') from public.membership_email_outbox where applicant_user_id='00000000-0000-0000-0000-000000000001'),'original version-one events remain delivered and are not reclaimed after version-three rollout');
SQL
printf 'Membership email version checks passed (disposable PostgreSQL 15; no external database or email used).\n'
