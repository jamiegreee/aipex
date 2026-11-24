# Contact enquiries

The public `/contact` form asks for name, email and message. A valid submission sends one plain-text email to `hello@theaipex.org` using the existing domain-restricted `RESEND_API_KEY` in the Resend account belonging to `green.jcb@gmail.com`. The visitor’s validated address is only the reply-to address. No account, upload, new database table or automatic email to the visitor is required.

The form uses the existing server-only `MEMBERSHIP_EMAIL_DISPATCH_SECRET` to sign contact-specific, one-hour form tokens. Tokens require at least two seconds before submission. They do not grant account or membership access. The contact page is dynamic so it does not share a cached token between visitors. Preview deployments cannot send contact email.

Server validation rejects missing, duplicate, oversized or file fields, invalid email addresses, control characters and the hidden spam field. Same-origin checks supplement Next.js Server Action checks. A bounded in-memory limiter allows three submissions per network identity per ten minutes and twenty per server instance per hour; raw IP addresses are not retained by the limiter. These limits reset on cold starts and are not shared between Vercel instances. They provide basic protection, not a global quota. If sustained abuse occurs, add edge-level limits without weakening the existing checks.

Delivery waits for a valid provider acceptance ID before showing success. Failed or ambiguous deliveries leave the message in the form. An identical retry uses the same content-bound idempotency key within the token’s lifetime. No provider error body, credential or message content is logged. There is no contact outbox or automatic background retry. Enquiries are held in the organisation’s email inbox and provider delivery records, rather than the account database.

`/contact` is excluded from Google Analytics. The privacy policy explains that contact details are emailed to AIPEX so the enquiry can be answered.

Run `npm test`, `npm run lint` and a production build. Tests use a stubbed provider and do not send email. For a live smoke test, submit one clearly labelled fictional test with an owner-controlled reply address, verify the visible confirmation and email delivery, and avoid sending to arbitrary visitors.

Vercel’s edge supplies the network header used by the limiter: [request headers](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for).
