# Membership applications

Membership is manually reviewed and has no size limit. The application journey is **invitation → public application → review → approval email → account creation and email verification → membership activation → Slack**. An account is not required to apply. Creating an account never grants membership. Existing members, accounts and historical applications remain supported.

## Public application intake (25 November 2026)

Apply `neon/migrations/20261125130000_public_membership_applications.sql` to the same AIPEX project and branch described below **before deploying this application version**. It is additive and transactional. It does not change existing members, reviewer access, authentication settings, earlier decisions or historical email contents. All new public records and notifications are private; the anonymous database role receives no table-read or table-write permissions.

The server obtains a guest JWT from the existing managed Auth `/token/anonymous` endpoint. The narrow intake and one-request email functions also require the existing server-only `MEMBERSHIP_EMAIL_DISPATCH_SECRET`, checked against its existing database hash. No owner database URL or new credential is introduced. `public_membership_available` provides a secret-protected read-only readiness check after migration. The public form uses a signed, one-hour intent token, same-origin checks, a honeypot, strict validation and persistent database limits (5 per IP/hour, 10 per IP/day, 50 total/hour, 100 total/day). Rate identifiers are HMACs; raw IP addresses are not stored in the application tables. Rate events older than two days are removed during subsequent intake. Preview deployments cannot submit applications or dispatch these emails.

`membership_requests` stores applications before any account exists. Email addresses are trimmed and lowercased, retaining plus aliases and dots. Duplicate addresses return generic success without revealing an existing decision, changing the record or sending another email. Corrections, mistaken addresses and withdrawals require identity-verified support. Intake also recognises historical applications, including archived QA records, to avoid duplicates. New email addresses are **not verified at application time**; reviewers must not treat submission as proof of email ownership.

The private review queue uses the RLS-preserving `membership_review_queue` view to paginate historical and new applications together. `review_public_membership` requires a live verified reviewer, records the decision/audit atomically and queues one v4 decision email. Approved requests remain visible until activated, after which their existing-format approved membership appears in the same queue.

V4 receipt and decline emails do not assume an account exists. Approval emails invite creation of an account with the same email address and lead to `/membership/activate`. Existing accounts can sign in instead. Activation is an explicit POST: `claim_approved_membership` verifies the live provider-owned email, locks the approved nonarchived request, creates the approved legacy membership/audit and links it to the account. Wrong, unverified, pending and declined identities cannot claim. Concurrent/repeated activation cannot create duplicate memberships or send a second welcome email. Existing pending/declined or archived legacy applications are not silently overwritten; conflicts require operator support.

New notifications use the separate private `membership_request_emails` outbox with the existing Resend sending-only key. Intake dispatches only its own new request; a reviewer may retry all due emails. Leases, immutable v4 bodies, provider idempotency and retry cutoffs match the existing email delivery behavior. Earlier v1/v2/v3 renderers remain frozen for historical retries. Verify actual inbox delivery when testing; provider acceptance alone does not prove placement.

Run `bash tests/public-membership.database.test.sh` against the disposable local PostgreSQL fixture. It checks public-role denial, server-secret scope, validation, duplicate immutability, all persistent/concurrent limits, the combined queue and RLS, reviewer-only/stale decisions, wrong-email/unverified activation, historical conflicts, concurrent claims, outbox worker leases and deletion cascades. It never connects to production.

Production verification must cover a clearly labelled owner-controlled alias applying while signed out, receipt and founder-alert delivery, reviewer approval, the approval email, fresh signup and real email verification, explicit activation, account/Slack guards and invitation sharing. Do not announce the new flow as live until the migration and this journey are verified.

The historical setup and migration notes below describe the original account-first flow and its preserved tables.

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
- `membership_is_reviewer` reports whether the current verified account is allowlisted. `membership_counts` gives reviewers aggregate queue counts.
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

Existing signed-in users and tool users remain distinct from approved members.

## Verification before launch

The isolated database checks can be run locally with PostgreSQL 15 binaries:

```sh
bash tests/membership.database.test.sh
```

Set `AIPEX_TEST_PG_BIN` when the binaries are installed elsewhere. The runner creates a temporary cluster under `/private/tmp`, binds only loopback on port 55450 with its own socket directory, supplies fictional Auth identities and removes the cluster after shutdown. It never connects to Neon. It checks the migration, privileges, row isolation, payload validation, audit records and two concurrent reviews competing for the final place under the original 50-member limit. That limit was later removed; see below.

Use disposable, genuinely email-verified test accounts in an isolated Neon child branch where possible. Never disable verification or delete real applications to make a test pass.

1. A signed-out or unverified account cannot submit; a valid application is saved as pending with the actual verified identity and email.
2. Duplicate submissions return the same row without overwriting it. Passing an email, status or reviewer identity in the JSON is rejected.
3. Applicant A cannot read applicant B, write the table directly, call the review/count RPCs or create a reviewer row.
4. Jamie can read the queue and explicitly approve or decline one pending application. The decision, reviewer and audit entry agree.
5. A stale review cannot overwrite an earlier decision. Two simultaneous approvals for the final place cannot exceed the configured limit; test this in an isolated branch with a small temporary limit.
6. Applicants see their own saved status. No queue, names, affiliations, application text or reviewer audit is exposed publicly or sent to analytics.

## Archive disposable test applications

Apply `neon/migrations/20261030190000_archive_test_applications.sql` before deploying the queue's archive filter. It adds an operator-only `archived_at` timestamp; it does not archive any records automatically. The reviewer queue and counts exclude archived applications, and database checks reject attempts to review them, including from an already-open review page.

Only pending applications can be archived. As the database operator, identify each disposable test by its account ID and confirmed test details, then set `archived_at` and advance `updated_at` together. Check the exact affected rows before committing. Never archive real applications merely to clean up a test run. Restore an archived test by clearing `archived_at` and advancing `updated_at` again.

Archiving leaves the application, Auth account, reviewer access, decision audits and email delivery history intact. It sends no application or decision emails and does not free or grant a member place. Applicants retain access to their own saved status; archive management is not exposed through the Data API or reviewer UI. Run `bash tests/membership-archive.database.test.sh` for isolated permission, queue-count, review-guard and restoration checks.

## Remove the member limit

Deploy the application first, then apply `neon/migrations/20261118190000_remove_member_limit.sql`. The current app works with either database version, but an older deployment expects the `limit` count that this migration removes. The migration redefines `review_membership` and `membership_counts` without the 50-member limit and drops the `membership_admissions` table. It changes no applications, reviews or emails. Run `bash tests/membership-limit-removal.database.test.sh` to check approvals past 50 in a disposable database.

## Email and privacy

The shared, versioned email theme in `src/lib/email-theme-v1.ts` matches the green invitation palette and uses an email-compatible PNG rendered from the website’s existing green icon. Deploy support for membership template version five before applying `neon/migrations/20261125160000_green_email_templates.sql`. That migration changes only future outbox defaults and allowed versions in the historical and public-application outboxes. It does not update existing events, approve applications, backfill or send notifications. Versions one to four remain frozen for retries, including their original logo assets. All new receipts, reviewer alerts, approvals and declines use the green theme once the migration is applied.

Neon SMTP continues to provide signup and recovery emails using its existing key. Membership notifications use a separate Resend sending-only key restricted to `theaipex.org`, from the existing Resend account tied to `green.jcb@gmail.com`. The fallback authorised by Jamie is a new account tied to `hello@theaipex.org`, only if the original account cannot be used; do not provision or switch to another account automatically.

Apply `neon/migrations/20261030170000_membership_emails.sql` to the same AIPEX production branch. It adds a private transactional outbox: the first application insert queues the founder alert and applicant receipt; a pending-to-approved or pending-to-declined transition queues that decision email. Retried submissions and stale decisions do not create duplicate events. Historical records are not emailed automatically.

Set server-only `RESEND_API_KEY` and `MEMBERSHIP_EMAIL_DISPATCH_SECRET` in the AIPEX Vercel production environment. Generate a cryptographically random dispatch secret of at least 32 characters. As the database operator, separately store only its SHA-256 hash in `membership_email_settings`:

```sql
insert into public.membership_email_settings (singleton, dispatch_secret_hash)
values (true, pg_catalog.decode('HEX_SHA256_OF_DISPATCH_SECRET', 'hex'));
```

Do not put the raw secret in SQL history, logs, public variables, source control or chat. The app still has no owner database URL or management token. Claiming or acknowledging an email requires both the server-only dispatch secret and a verified applicant/reviewer JWT. Applicants can dispatch their own notifications; only reviewers can dispatch other applicants' notifications or inspect aggregate queue counts. Direct outbox/settings access is revoked from application roles. Preview deployments do not send membership emails.

Emails use `AIPEX <hello@theaipex.org>` with replies to `hello@theaipex.org`. Founder alerts go only to `green.jcb@gmail.com`. Applicant recipients are derived from the verified application record. Founder alerts contain the name, role, organisation and authenticated review link, not the written application. No recipient, sender or email body is accepted from browser inputs.

Version two adds the website's exchange mark as an email-compatible PNG, retains a readable text wordmark, makes the My account status link explicit and shortens the approval message. The same public image URL is used for everyone, without recipient IDs or tracking parameters; keep this versioned image available for older emails. Deploy application support for both versions **before** applying `neon/migrations/20261031100000_membership_email_template_v2.sql`. That migration changes only the version assigned to future events. Existing version-one messages and retries keep their original payloads through the frozen version-one renderer.

Version three adds a **Join the Slack community** button to approval emails. Deploy the application with server-only `AIPEX_SLACK_INVITE_URL` configured before applying `neon/migrations/20261031190000_membership_email_template_v3.sql`. The button opens `/community/slack`, which requires a fresh verified session and the account's approved, nonarchived application. The reusable Slack invitation is never included in email HTML or public source. Existing version-one and version-two events retain their original payloads; the migration changes only future defaults. The Slack link is configured without an expiry, allows up to 400 joins, and notifies the owner when used. Replace the private variable and redeploy if the link is revoked or reaches its join limit. An approved member can forward the underlying Slack link after opening it.

Server actions schedule delivery with Next.js `after` after the application or decision is committed. Each immutable version-one event uses its UUID as the Resend idempotency key. Concurrent dispatch uses row locks and five-minute leases. Failed requests remain queued with backoff, up to five attempts. There is no manual send step: every decision, and every visit to the reviewer page, also retries any due emails in the background using the reviewer's session. There is no unattended cron worker, because claiming emails requires a verified applicant or reviewer session. Permanent errors and unconfirmed attempts nearing the provider's 24-hour idempotency window require manual investigation; do not clear their state, generate a fresh key or blindly resend them. Preserve version-one email content for retries, and introduce a new template version for future content changes.

The reviewer page does not show email status; the database operator can check the outbox or `membership_email_counts`. Provider acceptance is not proof of inbox placement. Verify real delivery in Resend and the recipient inbox. Email failures must not undo an application/decision or imply it failed to save. Applicants continue to see their saved status in My account.

Run `bash tests/membership-emails.database.test.sh` for isolated transactional, permission, retry and concurrency checks; the test never connects to Neon. The content and delivery unit tests stub the provider and never send real mail. For live checks, use only clearly labelled QA applications and genuine verified owner-controlled email aliases. Never approve or decline a real applicant merely to test an email. Do not backfill all historical applications; any selected QA backfill must be explicit and use the same event uniqueness rules.

Do not publish member details or add applicants to third-party groups automatically. Requests for a copy or deletion should follow the existing identity-verified support process at `hello@theaipex.org`. Before opening recruitment, publish the application-data purpose and retention arrangements in Privacy. Keep administrative access limited to the intended reviewer and necessary infrastructure operators.

## Member invitation sharing

My account shows **Invite someone to AIPEX** to approved, nonarchived members and to reviewers (who already count as members). A failed membership lookup hides the feature. The server checks membership before rendering the sharing card.

The sharing dialog offers copy link, native sharing where supported, email, WhatsApp, LinkedIn and a downloadable QR code. All options point to `https://theaipex.org/membership`, with no member identity, referral identifier or raw Slack invitation. Recipients still sign up, verify their email and apply for individual review; sharing does not grant membership. The website does not send invitations automatically.

QR codes are generated locally as black-on-white SVGs using `qrcode-generator`, with a four-module quiet zone. No QR service receives the link or member details. Unit checks cover visibility and sharing destinations; independent rasterization/decoding verifies the actual SVG opens the application page.
