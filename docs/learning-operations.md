# AIPEX learning

Two original self-paced courses, twelve lessons each, are defined in `src/content/courses/`. Every lesson includes teaching, objectives, a written exercise, self-review rubric, worked answer, two knowledge checks and primary-source reading. Course edition: 2026-10-13.

The catalogue and first lesson of each course are public. Accounts are needed for the remaining lessons. Enrolment enables saved written work and checks; readers can take lessons in any order. All checks must pass, the written response must meet the minimum word count, and the learner must confirm self-review to complete a lesson. Written work is not AI-graded or externally accredited. Later edits preserve the completion record.

## Local development

Use Node 22 or newer and Docker. Install with `npm ci`. The dedicated Supabase stack uses project ID `aipex-learning` and ports 55420–55429, separate from other projects.

```sh
supabase start -x realtime,storage-api,imgproxy,postgres-meta,studio,edge-runtime,logflare,vector,supavisor
npm run dev -- --port 3100
```

Copy `.env.example` to `.env.local`, with the local API URL and publishable key from `supabase status`. Do not commit credentials. The local email inbox is at http://127.0.0.1:55424. Email confirmation is enabled locally to exercise the real signup flow.

Run `npm test`, `npm run lint` and `npm run build`. Integration tests require the dedicated local service-role key in ignored `.env.test` as `SUPABASE_SERVICE_ROLE_KEY`; run `npm run test:integration`. They refuse non-local databases, create disposable learners and clean those learners up. Tests cover all 24 completions, failed checks, short responses, self-review, saved drafts, dashboard, exports, unauthenticated/cross-origin access and cross-user RLS denial. The deployed app does not use a service-role key.

## Production setup

1. Create a dedicated Supabase project in the owner's chosen organisation, preferably London (`eu-west-2`). Confirm applicable plan/compute cost before creation.
2. Apply the migration in `supabase/migrations/`. Both public tables have RLS enabled. Only authenticated learners can select, insert and update their own rows. Anonymous users have no table access.
3. Configure custom SMTP for public email verification and password recovery. Supabase's default sender only delivers to project-team addresses. Keep email confirmations enabled. Use an appropriate verified sender for AIPEX; never disable confirmation as a delivery workaround.
4. Set Auth Site URL to `https://theaipex.org` and allow `https://theaipex.org/auth/callback`. Add specifically authorised preview callback URLs if testing preview accounts. Default Supabase confirmation and recovery templates use the PKCE `/auth/callback` flow. If using token-hash templates instead, use `/auth/confirm?token_hash={{ .TokenHash }}&type=email` (signup) or `type=recovery&next=/reset-password` (recovery). Token-hash confirmation also works when a user opens the email on a different device; see the setup script.
5. In Vercel production configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SITE_URL=https://theaipex.org`. Use the same dedicated database for authorised previews only. Never point production at localhost or a different organisation's application database.
6. Verify a real signup, confirmation, sign-in, draft save, completion, logout and password recovery against the production project before promoting the app. Confirm RLS and review Supabase security advisors. Audit with `npm audit --omit=dev`.

Proxy refreshes validated sessions and preserves response cache-control headers. Auth cookies are HttpOnly, SameSite Lax and Secure on HTTPS deployments. Server reads and writes independently check the current authenticated user. Sensitive routes are dynamic and exports use private/no-store caching. Knowledge-check answers are graded server-side; the reader client receives only prompts and options until submission. Course completion is a learner's private participation record, not a tamper-proof professional credential.

`scripts/configure-learning-auth.mjs` prepares confirmed-email settings and branded token-hash confirmation/recovery templates. Set `SUPABASE_PROJECT_REF` and, when applying, `SUPABASE_ACCESS_TOKEN` in the process environment. Optional SMTP configuration uses `AIPEX_SMTP_HOST`, `AIPEX_SMTP_PORT`, `AIPEX_SMTP_USER`, `AIPEX_SMTP_PASSWORD` and `AIPEX_SMTP_FROM`; all must be supplied together. Run without flags to inspect a credential-free summary, then use `--apply` for the explicitly chosen project. The script never prints credentials or response configuration. Keep these operator secrets out of Vercel app environments; the app needs only its publishable key.

### Selected email provider: Resend

The owner selected their existing personal Resend account. `theaipex.org` has been added in Ireland (`eu-west-1`); domain verification and SMTP configuration are still pending. The domain's authoritative DNS is managed in Hostinger. Existing inbound email uses iCloud Mail.

Resend supplied these three required DNS records during setup on 13 October 2026. Check the domain dashboard for the current values before applying them:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDzY8IkVwFBTc4EoNuCyK8QoasDbXt/x4Ppxgx25pJQ2T4UMua0FmWuWWhVGhALdgW/zwQ066XpYXlSSa+qJYRz7m7wo+wiyVRrgahvDL/MACLEwtLC433JuuVOc8GSr8LhgvdjksNcxJ4HfSrMV3Nd4O94L0OlJsK3yq8CeC7tnwIDAQAB` | Auto |
| CNAME | `rsend` | `rsend-euw1.forge.rmta.net` | 3600 |
| CNAME | `send` | `send.forge.rmta.net` | 3600 |

These configure sending only. Keep Resend receiving disabled and preserve the root domain's iCloud MX records. The DKIM value is a public verification key, not a private credential. Check for existing host records before adding anything; do not overwrite a conflicting record without investigating it. Leave email open/click tracking disabled for confirmation and recovery links.

Once verified, use a sending-only API key scoped to this domain as the SMTP password. Store it securely in Supabase's SMTP configuration, not in application code or public environment variables. The [official Resend Supabase SMTP guide](https://resend.com/docs/send-with-supabase-smtp) specifies host `smtp.resend.com`, port `465`, username `resend` and the API key as password. The intended sender is `AIPEX <hello@theaipex.org>`.

## Support and upkeep

The learner can export private written work from My learning as Markdown. Account deletion requests go to hello@theaipex.org as described in the privacy notice. An authorised operator can delete the Auth user through Supabase; foreign-key cascades remove enrolments and exercises. Verify the requester's identity before acting. Do not delete an account merely because a support email names an address.

Review primary-source links and content when guidance changes. Update the course edition for substantive curriculum changes. Preserve lesson slugs to keep saved work attached; if removing a lesson or changing completion requirements, plan a migration and communicate it. The application has no analytics or advertising cookies and does not send exercise answers to AI services.

Production dependency audit is clean after updating Next.js to 16.4.0. npm currently reports a transitive development-only `braces` advisory through Next's ESLint plugin; the suggested force fix would downgrade the framework's lint configuration. Do not use `npm audit fix --force` to hide that report.
