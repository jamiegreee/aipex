import assert from "node:assert/strict";
import test from "node:test";
import { buildAuthEmail, type AuthEmailMessage } from "../src/lib/auth-email-content";

function message(kind: AuthEmailMessage["kind"] = "email-verification"): AuthEmailMessage {
  return {
    eventId: "aaf1a6d0-3e91-40f8-bf31-103d1c6d4f9e",
    email: "applicant+aipex@example.org",
    name: "Zoë Nguyễn",
    kind,
    link: "https://auth.example.org/neondb/auth/verify-email?token=fictional-token&callbackURL=https%3A%2F%2Ftheaipex.org%2Flogin%3Fnext%3D%252Faccount",
  };
}

test("all auth purposes have AIPEX logo, styling, readable fallback branding and no provider footer", () => {
  for (const kind of ["email-verification", "forget-password", "sign-in"] as const) {
    const result = buildAuthEmail(message(kind));
    assert.equal(result.from, "AIPEX <hello@theaipex.org>");
    assert.deepEqual(result.to, ["applicant+aipex@example.org"]);
    assert.equal(result.reply_to, "hello@theaipex.org");
    assert.match(result.html, /<html lang="en">/);
    assert.match(result.html, /role="presentation"/);
    assert.match(result.html, /border-top:3px solid #e5edb5/);
    assert.match(result.html, /background:#e5edb5;color:#10140f/);
    assert.match(result.html, /background:#10140f/);
    assert.doesNotMatch(result.html, /#3549d8/);
    assert.match(result.html, /AI Policy<br>Exchange\./);
    assert.match(result.text, /AI Policy Exchange\./);
    const images = [...result.html.matchAll(/<img\b[^>]+>/g)].map(m => m[0]);
    assert.equal(images.length, 1);
    assert.match(images[0], /src="https:\/\/theaipex.org\/brand\/aipex-mark-email-green-v1.png"/);
    assert.match(images[0], /width="40" height="40"/);
    assert.ok(!images[0].includes(message(kind).eventId));
    assert.ok(!images[0].includes(message(kind).email));
    assert.doesNotMatch(result.html + result.text, /powered by|\bneon\b|better auth|unsubscribe|tracking_pixel/i);
    assert.ok(result.text.includes("Zoë Nguyễn"));
    assert.deepEqual(buildAuthEmail(message(kind)), result);
  }
});

test("verification, reset and sign-in have distinct accurate copy and calls to action", () => {
  const verify = buildAuthEmail(message());
  const reset = buildAuthEmail(message("forget-password"));
  const signIn = buildAuthEmail(message("sign-in"));
  assert.equal(verify.subject, "Verify your email — AIPEX");
  assert.match(verify.html, />Verify your email\.<\/h1>/);
  assert.match(verify.html, />Verify email<\/a>/);
  assert.match(verify.text, /finish setting up your AIPEX account/);
  assert.equal(reset.subject, "Reset your password — AIPEX");
  assert.match(reset.html, />Reset password<\/a>/);
  assert.match(reset.text, /choose a new password/);
  assert.equal(signIn.subject, "Your sign-in link — AIPEX");
  assert.match(signIn.html, />Sign in<\/a>/);
  assert.match(signIn.text, /Use this link to sign in/);
});

test("the exact supplied verification URL and callback survive in both email formats", () => {
  const input = message();
  const result = buildAuthEmail(input);
  assert.ok(result.text.includes(input.link));
  const escaped = input.link.replaceAll("&", "&amp;");
  assert.equal([...result.html.matchAll(/href="([^"]+)"/g)].filter(m => m[1] === escaped).length, 2);
  assert.ok(result.html.includes(`>${escaped}</a>`));
  assert.ok(!result.html.includes(input.eventId));
  assert.ok(!result.text.includes(input.eventId));
  assert.deepEqual(buildAuthEmail({ ...input, eventId: "dced265a-cb75-4387-aa67-d010a5305fe2" }), result,
    "event identifiers affect transport idempotency, not visible content");
  assert.deepEqual(buildAuthEmail({ ...input, eventId: "evt_fixture" }), result,
    "safe opaque identifiers do not couple rendering to a provider ID format");
});

test("names and URL attributes cannot inject markup and Unicode names are bounded by code points", () => {
  const input = message();
  input.name = 'Zoë\r\n<script>alert("x")</script> & O\'Reilly';
  input.link = "https://auth.example.org/verify?token=fictional&value=%22%3E%3Cscript%3E";
  const result = buildAuthEmail(input);
  assert.doesNotMatch(result.html, /<script>/);
  assert.match(result.html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
  assert.match(result.html, /&amp; O&#39;Reilly/);
  assert.ok(!result.text.includes("Zoë\r\n"));
  const bounded = buildAuthEmail({ ...message(), name: "😀".repeat(101) });
  assert.match(bounded.text, new RegExp(`Hello ${"😀".repeat(100)},`));
  assert.ok(!bounded.text.includes("😀".repeat(101)));
  assert.ok(!bounded.html.includes("\ufffd"));
  assert.match(buildAuthEmail({ ...message(), name: "" }).text, /Hello,/);
});

test("recipient addresses cannot add headers, recipients, display names or hidden controls", () => {
  for (const email of [
    "person@example.org\r\nBcc:evil@example.org", "person@example.org,evil@example.org",
    "person@example.org;evil@example.org", "Person <person@example.org>",
    " person@example.org", "person@example.org ", "person@@example.org", "person@localhost",
    "person@example..org", "person@-example.org", ".person@example.org", "person..name@example.org",
    "person\u202e@example.org", `person@${"a".repeat(64)}.org`,
  ]) assert.throws(() => buildAuthEmail({ ...message(), email }), /invalid_auth_email_recipient/);
  assert.deepEqual(buildAuthEmail({ ...message(), email: "Applicant+AIPEX@Example.org" }).to, ["Applicant+AIPEX@Example.org"]);
});

test("malformed event purposes, IDs and unsafe URLs fail closed", () => {
  for (const eventId of ["", "event with spaces", "bad\r\nheader", "a".repeat(201)]) {
    assert.throws(() => buildAuthEmail({ ...message(), eventId }), /unsupported_auth_email_event/);
  }
  assert.throws(() => buildAuthEmail({ ...message(), kind: "unknown" as AuthEmailMessage["kind"] }), /unsupported_auth_email_event/);
  for (const link of ["javascript:alert(1)", "http://auth.example.org/verify", "https://user:password@auth.example.org/verify", "https://auth.example.org/verify\r\n", "/relative", "", `https://auth.example.org/${"a".repeat(8_192)}`]) {
    assert.throws(() => buildAuthEmail({ ...message(), link }), /invalid_auth_email_link/);
  }
});
