import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import {
  ContactRateLimiter,
  contactIdempotencyKey,
  contactRequestAllowed,
  createContactEmail,
  createContactToken,
  parseContactForm,
  sendContactEmail,
  verifyContactToken,
  type ContactInput,
} from "../src/lib/contact";

const secret = "contact-token-test-secret-with-at-least-32-characters";
const now = 1_800_000_000_000;
const nonce = "b920dada-6782-4ad2-93bb-c3a022356bbc";
const input: ContactInput = { name: "Amélie Chen", email: "amelie+policy@example.org", message: "Could we discuss public-sector AI policy?" };
const key = contactIdempotencyKey(nonce, input);
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const form = (patch: Partial<ContactInput> = {}) => {
  const values = { ...input, ...patch };
  const result = new FormData();
  Object.entries(values).forEach(([field, value]) => result.set(field, value));
  return result;
};
const stub = (handler: (url: string | URL | Request, init?: RequestInit) => Promise<Response>) => handler as typeof fetch;

test("contact input normalizes Unicode, trims fields and retains ordinary multiline messages", () => {
  const parsed = parseContactForm(form({ name: "  Ame\u0301lie Chen ", email: ` ${input.email} `, message: "  A policy question.\r\nSecond line.\tThanks.  " }));
  assert.deepEqual(parsed.errors, {});
  assert.deepEqual(parsed.data, { name: input.name, email: input.email, message: "A policy question.\nSecond line.\tThanks." });
  const f = form();
  f.set("website", "");
  f.set("$ACTION_ID_test", "framework value");
  assert.ok(parseContactForm(f).data);
});

test("invalid fields, empty values, unsupported controls, duplicate values and files never produce contact data", () => {
  for (const patch of [
    { name: "" }, { message: "short" }, { email: "person@example" },
    { email: "person@example.org\r\nBcc: other@example.org" },
    { email: "Person <person@example.org>" }, { email: "a@example.org,b@example.org" },
    { email: "a..b@example.org" }, { email: "a@-example.org" },
    { email: "person@exämple.org" }, { name: "First\nName" },
    { message: "Unsupported \u0000 character" }, { name: "Unsafe\u202ename" },
  ]) assert.equal(parseContactForm(form(patch)).data, undefined, JSON.stringify(patch));
  for (const field of ["name", "email", "message", "website", "token"]) {
    const f = form();
    f.append(field, "first");
    f.append(field, "second");
    assert.equal(parseContactForm(f).data, undefined, field);
    const file = form();
    file.set(field, new File(["not text"], "test.txt"));
    assert.equal(parseContactForm(file).data, undefined, `${field} file`);
  }
  const extra = form(); extra.set("to", "other@example.org");
  assert.equal(parseContactForm(extra).error !== undefined, true);
  const robot = form(); robot.set("website", "https://bot.example");
  assert.equal(parseContactForm(robot).data, undefined);
});

test("length limits are enforced and returned form values remain bounded without splitting emoji", () => {
  for (const [field, maximum] of [["name", 100], ["email", 254], ["message", 5000]] as const) {
    const result = parseContactForm(form({ [field]: "x".repeat(maximum + 1) }));
    assert.equal(result.data, undefined);
    assert.ok(result.errors[field]);
    assert.equal(Array.from(result.values[field]).length, maximum);
  }
  assert.ok(parseContactForm(form({ name: "😀".repeat(100), message: "😀".repeat(10) })).data);
  assert.equal(parseContactForm(form({ name: "😀".repeat(101) })).values.name, "😀".repeat(100));
  const controls = parseContactForm(form({ name: " A\u0000B ", message: "A harmless\u0000 message" }));
  assert.equal(controls.values.name, "AB");
  assert.equal(controls.values.message, "A harmless message");
});

test("signed tokens are unpredictable, domain separated, bounded in time and reject tampering", () => {
  const token = createContactToken(secret, now);
  const verified = verifyContactToken(token, secret, now + 2_000);
  assert.ok("nonce" in verified);
  assert.notEqual(token, createContactToken(secret, now));
  assert.deepEqual(verifyContactToken(token, secret, now + 1_999), { error: "early" });
  assert.ok("nonce" in verifyContactToken(token, secret, now + 3_600_000));
  assert.deepEqual(verifyContactToken(token, secret, now + 3_600_001), { error: "expired" });
  assert.deepEqual(verifyContactToken(token, secret, now - 1), { error: "invalid" });
  assert.deepEqual(verifyContactToken(token, `${secret}-other`, now + 2_000), { error: "invalid" });
  for (const changed of [token.replace("v1.", "v2."), token.replace(String(now), String(now - 2000)), token.slice(0, -1) + (token.endsWith("a") ? "b" : "a"), "x".repeat(201), ""]) {
    assert.deepEqual(verifyContactToken(changed, secret, now + 2_000), { error: "invalid" });
  }
  assert.throws(() => createContactToken("short", now), /not_configured/);
  assert.deepEqual(verifyContactToken(token, "short", now + 2_000), { error: "invalid" });
});

test("contact messages have fixed sender, recipient and subject, with visitor address only in reply-to", () => {
  const email = createContactEmail({ ...input, message: "<script>alert('html')</script>\nContent stays plain text." });
  assert.equal(email.from, "AIPEX <hello@theaipex.org>");
  assert.deepEqual(email.to, ["hello@theaipex.org"]);
  assert.equal(email.reply_to, input.email);
  assert.equal(email.subject, "AIPEX contact enquiry");
  assert.ok(email.text.includes("<script>"));
  assert.equal("html" in email, false);
  assert.throws(() => createContactEmail({ ...input, email: "person@example.org\r\nBcc: injected@example.org" }), /invalid_contact_input/);
});

test("idempotency keys reveal no personal text and change with either nonce or content", () => {
  assert.equal(contactIdempotencyKey(nonce, input), key);
  assert.match(key, /^aipex-contact\/v1\/[0-9a-f]{64}$/);
  assert.ok(!key.includes(input.email) && !key.includes(input.name));
  assert.notEqual(contactIdempotencyKey("c920dada-6782-4ad2-93bb-c3a022356bbc", input), key);
  assert.notEqual(contactIdempotencyKey(nonce, { ...input, message: input.message + " Thank you." }), key);
  assert.throws(() => contactIdempotencyKey("not-a-nonce", input), /invalid_contact_nonce/);
});

test("transport uses fixed provider, timeout and identical key/payload on retry", async () => {
  const calls: { url: string | URL | Request; init?: RequestInit }[] = [];
  const send = stub(async (url, init) => {
    calls.push({ url, init });
    return Response.json({ id: "a920dada-6782-4ad2-93bb-c3a022356bbc" });
  });
  assert.equal(await sendContactEmail(secret, key, input, send), true);
  assert.equal(await sendContactEmail(secret, key, input, send), true);
  for (const call of calls) {
    assert.equal(call.url, "https://api.resend.com/emails");
    assert.equal(call.init?.method, "POST");
    assert.equal(call.init?.cache, "no-store");
    assert.ok(call.init?.signal instanceof AbortSignal);
    const headers = new Headers(call.init?.headers);
    assert.equal(headers.get("Authorization"), `Bearer ${secret}`);
    assert.equal(headers.get("Idempotency-Key"), key);
    assert.deepEqual(JSON.parse(String(call.init?.body)), createContactEmail(input));
  }
  assert.equal(calls[0].init?.body, calls[1].init?.body);
});

test("provider failures and ambiguous successes stay false without exposing or parsing provider error bodies", async () => {
  for (const status of [400, 401, 403, 409, 422, 429, 500, 503]) {
    const response = new Response("private provider error", { status });
    assert.equal(await sendContactEmail(secret, key, input, stub(async () => response)), false);
    assert.equal(response.bodyUsed, false);
  }
  for (const body of [null, {}, [], { id: "wrong" }, { id: 1 }, { id: null }]) {
    assert.equal(await sendContactEmail(secret, key, input, stub(async () => Response.json(body))), false);
  }
  assert.equal(await sendContactEmail(secret, key, input, stub(async () => new Response("not JSON"))), false);
  assert.equal(await sendContactEmail(secret, key, input, stub(async () => { throw new DOMException("private timeout", "TimeoutError"); })), false);
  let attempts = 0;
  const unused = stub(async () => { attempts++; return Response.json({ id: "a920dada-6782-4ad2-93bb-c3a022356bbc" }); });
  assert.equal(await sendContactEmail(secret, "bad\r\nkey", input, unused), false);
  assert.equal(await sendContactEmail(secret, key, { ...input, email: "bad@example.org\n" }, unused), false);
  assert.equal(attempts, 0);
});

test("limiter enforces per-identity and global ceilings, expiry, hashed identifiers and clock safety", () => {
  const limiter = new ContactRateLimiter();
  assert.equal(limiter.consume("192.0.2.1", now), false);
  for (let i = 0; i < 3; i++) assert.equal(limiter.consume(hash("same"), now + i), true);
  assert.equal(limiter.consume(hash("same"), now + 3), false);
  assert.equal(limiter.consume(hash("same"), now + 600_000), true);
  assert.equal(limiter.consume(hash("different"), now + 599_999), false);
  const global = new ContactRateLimiter();
  for (let i = 0; i < 20; i++) assert.equal(global.consume(hash(String(i)), now), true);
  for (let i = 20; i < 1_100; i++) assert.equal(global.consume(hash(String(i)), now), false);
  assert.equal(global.consume(hash("another"), now + 600_000), false, "per-identity expiry does not reset hourly budget");
  assert.equal(global.consume(hash("another"), now + 3_600_000), true);
});

test("request boundary rejects cross-site, missing/mismatched origins and malformed/oversize lengths", () => {
  const headers = (patch: Record<string, string> = {}) => new Headers({ origin: "https://theaipex.org", host: "theaipex.org", "sec-fetch-site": "same-origin", ...patch });
  assert.equal(contactRequestAllowed(headers()), true);
  assert.equal(contactRequestAllowed(headers({ "content-length": "64000" })), true);
  assert.equal(contactRequestAllowed(new Headers({ origin: "http://localhost:3100", host: "localhost:3100" })), true);
  const invalidHeaders: Array<Record<string, string>> = [
    { origin: "" }, { host: "" }, { origin: "null" }, { origin: "https://other.example" },
    { origin: "https://user:pass@theaipex.org" }, { origin: "https://theaipex.org/path" },
    { origin: "ftp://theaipex.org" }, { "sec-fetch-site": "cross-site" },
    { "content-length": "64001" }, { "content-length": "-1" },
    { "content-length": "1.5" }, { "content-length": "abc" },
  ];
  for (const patch of invalidHeaders) assert.equal(contactRequestAllowed(headers(patch)), false, JSON.stringify(patch));
});
