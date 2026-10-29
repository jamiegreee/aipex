# Founding membership applications

The first cohort is a manually reviewed group of up to 50 members. Creating an AIPEX account never grants membership. Applicants must verify their email before submitting; Jamie reviews each application separately. The application and account-status pages do not imply an existing member platform, government endorsement or confirmed event programme.

## Dedicated backend and migration

Use the existing **AIPEX Learning** Neon project `empty-block-17582000`, branch `br-dawn-union-zamwo3z4`, database `neondb`. Confirm the project and branch in the console before executing SQL: the database name alone does not identify the correct project. Monty and other projects are outside this setup.

Apply `neon/migrations/20261029180000_membership_applications.sql` once as the database operator. It is additive and does not modify course records, policy drafts, authentication configuration or existing provider credentials. The migration finishes with `NOTIFY pgrst, 'reload schema'`.

Before applying it, inspect the managed Auth schema rather than assuming an older Neon Auth integration:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'neon_auth' and table_name = 'user'
  and column_name in ('id', 'email', 'emailVerified', 'email_verified');
```

The migration expects UUID account IDs and reads verification from the provider-owned `emailVerified` or `email_verified` field. If neither is available, the checks fail closed; resolve the schema difference instead of removing email verification. `auth.uid()` must identify the authenticated Neon user.

## Give Jamie sole reviewer access

First have Jamie create or sign into his AIPEX account and complete real email verification. As the database operator, confirm that the intended account is the verified `green.jcb@gmail.com` account, then run this **separate** bootstrap. It grants review access, not membership; the migration itself grants nobody reviewer access.

```sql
do $$
declare
  reviewer uuid;
  candidates uuid[];
begin
  select array_agg(u.id) into candidates from neon_auth."user" u
  where lower(u.email) = lower('green.jcb@gmail.com')
    and coalesce((to_jsonb(u)->>'emailVerified')::boolean,
                 (to_jsonb(u)->>'email_verified')::boolean, false);
  if cardinality(candidates) is distinct from 1 then
    raise exception 'Exactly one verified intended reviewer account must exist first';
  end if;
  reviewer := candidates[1];
  insert into public.membership_reviewers (user_id) values (reviewer)
    on conflict (user_id) do nothing;
end;
$$;
```

Check that `membership_reviewers` contains only the intended account before launch. Do not populate the table from a form field, a request header, a display name or a browser-supplied claim. No signup path can grant reviewer privileges. Adding another reviewer later requires a deliberate operator change.

## Data access and review

- `membership_applications` stores one record per verified account, including the email read from managed Auth, the applicant’s bounded professional details, interests, reasons and the current decision. There is no public directory or internal-note field.
- Applicants can select their own record. Reviewers can select the queue. Authenticated users have no table INSERT, UPDATE or DELETE grants; anonymous and PUBLIC access is revoked.
- The authenticated `submit_membership` RPC accepts the form’s camelCase JSON fields. It derives identity and pending status itself. Retrying returns an existing record unchanged, including an approved or declined decision.
- `membership_is_reviewer` reports whether the current verified account is allowlisted. `membership_counts` gives reviewers aggregate queue counts and the current cohort limit.
- `review_membership` accepts `p_user_id`, `p_decision` (`approved` or `declined`) and the displayed record’s `p_expected_updated_at`. It checks the reviewer in the database, serialises decisions using the admissions row, and atomically writes the decision and an audit record. Only pending applications can be reviewed.
- The private audit records the applicant, reviewer, decision and time. It is visible only to reviewers; applicant-account deletion cascades to their application and its audit rows.

Every exposed write function checks a live, verified database identity, uses an empty search path and qualifies database objects. Helper execution is revoked from application roles. The deployed Next.js application continues to use the existing user-JWT Data API client: **do not add an owner database URL, management token or service key to Vercel**.

The UI should use fresh provider sessions for mutations, validate inputs on the server, protect same-origin submissions, keep responses private/non-cacheable and omit applicant details from analytics. Database constraints and RPC checks also apply to direct Data API requests.

## Expected errors

Map these database exception messages to safe user-facing feedback rather than displaying raw SQL errors:

| Message | Meaning |
| --- | --- |
| `verified_account_required` | Sign in with a verified account again. |
| `invalid_application` | The application payload is malformed. Table check violations also reject invalid text lengths, URLs and interests. |
| `reviewer_required` | The account cannot review applications or read counts. |
| `invalid_decision` | The requested decision or version is missing or unsupported. |
| `application_not_found` | The target record no longer exists. |
| `application_changed` | Reload the queue; another decision or record version superseded this screen. |
| `founding_cohort_full` | Fifty applications are already approved; leave the remaining application pending rather than silently admitting another member. |
| `admissions_not_configured` | The singleton admission-limit record is missing; an operator must restore it. |

The initial `member_limit` is 50. Increasing the cohort size is an explicit operator decision, not an applicant setting. Existing signed-in users and tool users remain distinct from approved members.

## Verification before launch

The isolated database checks can be run locally with PostgreSQL 15 binaries:

```sh
bash tests/membership.database.test.sh
```

Set `AIPEX_TEST_PG_BIN` when the binaries are installed elsewhere. The runner creates a temporary cluster under `/private/tmp`, binds only loopback on port 55450 with its own socket directory, supplies fictional Auth identities and removes the cluster after shutdown. It never connects to Neon. It checks the migration, privileges, row isolation, payload validation, audit records and two concurrent reviews competing for the final founding place.

Use disposable, genuinely email-verified test accounts in an isolated Neon child branch where possible. Never disable verification or delete real applications to make a test pass.

1. A signed-out or unverified account cannot submit; a valid application is saved as pending with the actual verified identity and email.
2. Duplicate submissions return the same row without overwriting it. Passing an email, status or reviewer identity in the JSON is rejected.
3. Applicant A cannot read applicant B, write the table directly, call the review/count RPCs or create a reviewer row.
4. Jamie can read the queue and explicitly approve or decline one pending application. The decision, reviewer and audit entry agree.
5. A stale review cannot overwrite an earlier decision. Two simultaneous approvals for the final place cannot exceed the configured limit; test this in an isolated branch with a small temporary limit.
6. Applicants see their own saved status. No queue, names, affiliations, application text or reviewer audit is exposed publicly or sent to analytics.

## Email and privacy

Existing Neon SMTP provides signup and recovery emails. Its Resend key is stored with Neon, not in the deployed app. This membership migration does not create application-receipt or decision emails. Present status through the account page and state the actual notification workflow; do not promise automated email unless separately configured and tested.

Do not publish member details or add applicants to third-party groups automatically. Requests for a copy or deletion should follow the existing identity-verified support process at `hello@theaipex.org`. Before opening recruitment, publish the application-data purpose and retention arrangements in Privacy. Keep administrative access limited to the intended reviewer and necessary infrastructure operators.
