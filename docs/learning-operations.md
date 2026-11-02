# AIPEX learning

Two original self-paced courses, twelve lessons each, live in `src/content/courses/`. Every lesson includes teaching, objectives, a written exercise, a self-review rubric, worked answer, two knowledge checks and primary-source reading. Course edition: 2026-10-13.

The catalogue and first lesson of each course are public. Accounts unlock the remaining lessons and enrolment enables saved work. Readers may take lessons in any order. Completion requires passing both checks, meeting the response’s minimum word count, and confirming self-review. Written work is not AI-graded or externally accredited. Later edits preserve completion.

## Infrastructure

- Vercel: existing `aipex` application in `jamiegreees-projects`.
- Neon: dedicated **AIPEX** organisation, **AIPEX Learning** project `empty-block-17582000`, London AWS region, Free plan. Production branch `br-dawn-union-zamwo3z4`, database `neondb`.
- Neon Auth: managed accounts with verified email and verification links; application name AIPEX.
- Neon Data API: authenticated queries with table privileges and per-learner RLS. Automatic public-schema grants were turned off when enabling the API.
- Resend: existing personal account, verified `theaipex.org`, Ireland sending region. Sender `AIPEX <hello@theaipex.org>`. Sending-only key **AIPEX account emails**, restricted to this domain, stored in Neon SMTP.
- Hostinger manages DNS. Existing iCloud inbound mail is retained.

The owner selected Neon’s free backend with Vercel to avoid a Supabase paid upgrade or maintaining another service on the VPS. Monty and other applications are outside this task.

## Development

Use Node 22 or newer; run `npm ci`. Copy `.env.example` to ignored `.env.local` and fill the branch-specific Auth and Data API endpoints. Generate the cookie secret with `openssl rand -base64 48`. Keep secrets out of Git.

```sh
npm run dev -- --port 3100
npm test
npm run lint
npm run build
npm audit --omit=dev
```

For local tests, explicitly allow `http://127.0.0.1:3100` in the branch’s Auth trusted domains. Remove this from the production branch after launch checks. Development should use a dedicated child branch and its own Auth configuration, not learners’ production records.

## Database setup

Enable Neon Auth and Data API for the chosen AIPEX branch, leaving blanket public-schema access off. Apply `neon/migrations/20261013131000_learning_accounts_and_progress.sql` once, as the database operator. The inspected Neon Auth `user.id` column is UUID; enrolments reference it with cascading deletion. Refresh the Data API schema cache after applying migrations.

Both course tables enable RLS before authenticated privileges are granted. Learners can select, insert and update only their own rows; anonymous and PUBLIC roles have no privileges. Composite primary keys begin with `user_id`, supporting ownership queries. The app deploys no owner database connection or privileged API key: each query carries the learner’s Neon JWT.

Completion is a private participation record, not a tamper-proof professional credential. Authenticated learners can also access their own records through the Data API, so course work is self-assessed rather than independently certified.

## Accounts and email

In branch Auth settings, set application name AIPEX, require email verification, choose verification links, and trust the exact website origin. Production uses `https://theaipex.org` and `https://www.theaipex.org`. Trust specific preview origins only for testing, never a wildcard across arbitrary Vercel projects. Disable Allow Localhost in production once testing is done.

Neon SMTP uses host `smtp.resend.com`, port `465`, username `resend`, password the restricted account-email Resend key, sender email `hello@theaipex.org`, sender name AIPEX. That key stays in Neon SMTP. Membership notifications use a separate sending-only Resend key in Vercel production; see `docs/membership-operations.md`. Email click/open tracking is not configured.

Hostinger’s Resend sending records were saved and verified on 13 October 2026: TXT `resend._domainkey`, CNAME `rsend` to `rsend-euw1.forge.rmta.net`, CNAME `send` to `send.forge.rmta.net`, TTL 3600. The domain dashboard is the source of truth for the public DKIM key. Keep Resend receiving disabled and preserve existing iCloud MX, SPF and DKIM records.

Signup requests a confirmation email, then the learner signs in after confirmation. Reset emails lead to `/reset-password?token=...`; reset tokens are sent server-side to Neon, then the learner signs in with the updated password. Neon and Next.js handle auth cookies and server actions. Cookies are HttpOnly and SameSite Lax; HTTPS deployment is required for production. Server reads and writes independently check a verified account. Private routes are dynamic; portfolio exports use private/no-store caching. Knowledge-check grading runs on the server.

## Vercel configuration

Set `NEON_AUTH_BASE_URL`, `NEON_DATA_API_URL`, `NEON_AUTH_COOKIE_SECRET` and `NEXT_PUBLIC_SITE_URL=https://theaipex.org` in production. Membership notifications also require the separate domain-restricted `RESEND_API_KEY` and `MEMBERSHIP_EMAIL_DISPATCH_SECRET` described in the membership operations guide. Preview deployments need matching site origins and branch endpoints. Do not put owner database credentials, account SMTP passwords or management API tokens in application environments.

Before promoting, verify real signup, confirmation, login, saved drafts, completions, logout and password reset against the dedicated backend. Review Data API advisors and test cross-user isolation. Run the build, lint, curriculum tests and production dependency audit.

## Integration checks

`npm run test:integration` runs against the local Next.js app backed by explicitly selected Neon endpoints. Ignored `.env.test` supplies `NEON_TEST_AUTH_BASE_URL`, `NEON_TEST_ORIGIN=http://127.0.0.1:3100`, `NEON_TEST_EMAIL_A`, `NEON_TEST_EMAIL_B` and `NEON_TEST_PASSWORD`. Accounts must be disposable AIPEX QA aliases in the owner’s Gmail inbox and have completed real confirmation first. No production learner accounts are used or deleted by this runner.

The checks cover verified sign-in, HttpOnly cookies, anonymous and cross-origin denial, repeat enrolment, failed checks, short responses, self-review, draft saves, all 24 completions, dashboard, portfolio exports, cross-user reads/writes and session revocation at logout. Test confirmation and reset email delivery separately through the real signup and recovery flows; never switch off verification to make tests pass.

## Support

Learners can export written work as Markdown from My learning. Identity-verified account deletion requests go to hello@theaipex.org. An authorised operator can delete the Neon Auth user; foreign-key cascades remove course records. Never delete an account just because a support email names its address.

Keep lesson slugs stable so saved work remains attached. Review primary-source links when guidance changes and update the course edition for substantive changes. Exercise answers are not sent to an AI grading service. Optional Google Analytics loads only after explicit consent on the production domain; see `docs/analytics.md` for configuration and verification.

Primary setup documentation: [Neon Next.js server auth](https://neon.com/docs/auth/reference/nextjs-server), [production checklist](https://neon.com/docs/auth/production-checklist), [Data API access control](https://neon.com/docs/data-api/access-control).


## Revising course checks

Apply `neon/migrations/20261013150000_quiz_revision.sql` before deploying the reviewed edition, then refresh the Data API schema. The additive `quiz_revision` column defaults old records and old-client writes to the initial edition. Current app writes specify `quizRevision`; UI restores selections only for matching editions and rejects stale submissions before saving. Written responses, scores and completion records are preserved. When changing question content or option order again, update `quizRevision` as well.
