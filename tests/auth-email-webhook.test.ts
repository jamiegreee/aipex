import assert from "node:assert/strict";
import test from "node:test";
import { generateKeyPairSync, sign } from "node:crypto";
import { AuthEmailError, AuthEmailVerifier, authEmailMessage, boundedText, sendAuthEmail } from "../src/lib/auth-email-webhook";

const base = "https://ep-test.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth";
const now = 1_800_000_000_000;
const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "qa-key", alg: "EdDSA" };
const event = () => ({
  event_id: "decb0919-ed33-411a-93de-7dc60402356c", event_type: "send.magic_link", timestamp: new Date(now).toISOString(),
  context: { endpoint_id: "ep-test" }, user: { name: "QA applicant", email: "qa@example.org" },
  event_data: { link_type: "email-verification", link_url: `${base}/verify-email?token=fictional-token&callbackURL=https%3A%2F%2Ftheaipex.org%2Flogin%3Fnext%3D%252Fmembership%252Factivate`, expires_at: new Date(now + 3_600_000).toISOString(), token: "fictional-token", ip_address: "192.0.2.1" },
});
function signed(raw: string, timestamp = String(now), header: Record<string, string> = { alg: "EdDSA", kid: "qa-key" }) {
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payload = Buffer.from(`${timestamp}.${Buffer.from(raw).toString("base64url")}`).toString("base64url");
  const signature = sign(null, Buffer.from(`${encodedHeader}.${payload}`), privateKey).toString("base64url");
  return new Headers({ "x-neon-signature": `${encodedHeader}..${signature}`, "x-neon-signature-kid": header.kid ?? "qa-key",
    "x-neon-timestamp": timestamp, "x-neon-event-id": event().event_id, "x-neon-event-type": "send.magic_link" });
}
const fetchStub = (handler: (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>) => handler as typeof fetch;
test("detached Ed25519 signatures verify raw bytes against only the pinned JWKS and cache keys", async () => {
  const calls: string[] = [];
  const verifier = new AuthEmailVerifier(base, fetchStub(async (url, init) => {
    calls.push(String(url)); assert.equal(init?.redirect, "error");
    return Response.json({ keys: [jwk] });
  }), () => now);
  const raw = JSON.stringify(event(), null, 2);
  assert.deepEqual(await verifier.verify(raw, signed(raw)), event());
  assert.deepEqual(await verifier.verify(raw, signed(raw, String(now), { alg: "EdDSA" })), event());
  assert.deepEqual(await verifier.verify(raw, signed(raw)), event());
  assert.deepEqual(calls, [`${base}/.well-known/jwks.json`]);
  await assert.rejects(verifier.verify(JSON.stringify(event()), signed(raw)), { status: 401 });
  await assert.rejects(verifier.verify(raw.replace("QA applicant", "Someone else"), signed(raw)), { status: 401 });
});
test("invalid headers, algorithms, timestamps and injected key URLs fail before a key fetch", async () => {
  let fetched = 0;
  const verifier = new AuthEmailVerifier(base, fetchStub(async () => { fetched++; return Response.json({ keys: [jwk] }); }), () => now);
  const raw = JSON.stringify(event());
  for (const timestamp of ["", "abc", String(now - 300_001), String(now + 300_001)]) {
    await assert.rejects(verifier.verify(raw, signed(raw, timestamp)), { status: 401 });
  }
  await assert.rejects(verifier.verify(raw, signed(raw, String(now), { alg: "HS256", kid: "qa-key" })), { status: 401 });
  const headers = signed(raw); headers.set("x-neon-signature-kid", "other-key");
  await assert.rejects(verifier.verify(raw, headers), { status: 401 });
  assert.equal(fetched, 0);
  assert.throws(() => new AuthEmailVerifier("https://attacker.example/auth"), { status: 503 });
  assert.throws(() => new AuthEmailVerifier("http://ep-test.neon.tech/neondb/auth"), { status: 503 });
});
test("unknown keys refresh with a bound, rotate successfully, and never accept an untrusted key", async () => {
  let calls = 0; let clock = now;
  const next = generateKeyPairSync("ed25519");
  const nextJwk = { ...next.publicKey.export({ format: "jwk" }), kid: "next-key", alg: "EdDSA" };
  const verifier = new AuthEmailVerifier(base, fetchStub(async () => { calls++; return Response.json({ keys: calls === 1 ? [jwk] : [nextJwk] }); }), () => clock);
  const raw = JSON.stringify(event()); await verifier.verify(raw, signed(raw));
  const header = Buffer.from(JSON.stringify({ alg: "EdDSA", kid: "next-key" })).toString("base64url");
  const payload = Buffer.from(`${now}.${Buffer.from(raw).toString("base64url")}`).toString("base64url");
  const sig = sign(null, Buffer.from(`${header}.${payload}`), next.privateKey).toString("base64url");
  const headers = signed(raw); headers.set("x-neon-signature", `${header}..${sig}`); headers.set("x-neon-signature-kid", "next-key");
  await assert.rejects(verifier.verify(raw, headers), { status: 503 }); assert.equal(calls, 1);
  clock += 10_001; await verifier.verify(raw, headers); assert.equal(calls, 2);
});
test("temporary JWKS failures remain retryable without suppressing the next delivery attempt", async () => {
  let calls = 0;
  const verifier = new AuthEmailVerifier(base, fetchStub(async () => ++calls === 1 ? new Response(null, { status: 503 }) : Response.json({ keys: [jwk] })), () => now);
  const raw = JSON.stringify(event());
  await assert.rejects(verifier.verify(raw, signed(raw)), { status: 503 });
  assert.deepEqual(await verifier.verify(raw, signed(raw)), event());
  assert.equal(calls, 2);
});
test("only supported same-endpoint, matching-envelope, unexpired email links are accepted", () => {
  const value = event(); const headers = signed(JSON.stringify(value));
  const message = authEmailMessage(value, headers, base, now);
  assert.equal(message.link, value.event_data.link_url);
  assert.deepEqual(Object.keys(message).sort(), ["email", "eventId", "kind", "link", "name"]);
  for (const change of [
    { event_id: "other-id" }, { event_type: "user.created" }, { context: { endpoint_id: "ep-someone-else" } },
    { event_data: { ...value.event_data, link_type: "unknown" } },
    { event_data: { ...value.event_data, link_url: "https://attacker.example/verify" } },
    { event_data: { ...value.event_data, link_url: `${base}/verify-email?callbackURL=https%3A%2F%2Fattacker.example` } },
    { event_data: { ...value.event_data, expires_at: new Date(now - 1).toISOString() } },
  ]) assert.throws(() => authEmailMessage({ ...value, ...change }, headers, base, now), AuthEmailError);
});
test("bounded streaming input rejects excess bytes and malformed UTF-8", async () => {
  assert.equal(await boundedText(new Response("test").body, 4), "test");
  await assert.rejects(boundedText(new Response("large").body, 4), { status: 413 });
  await assert.rejects(boundedText(new Response(new Uint8Array([255])).body), { status: 400 });
});
test("transport confirms provider acceptance and uses the same opaque idempotency key on retries", async () => {
  const value = event(); const message = authEmailMessage(value, signed(JSON.stringify(value)), base, now);
  const calls: RequestInit[] = [];
  const stub = fetchStub(async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails"); calls.push(init!);
    return calls.length === 1 ? new Response("", { status: 429 }) : Response.json({ id: "b6b744ab-b187-4b7d-b86d-35dfe67b5a17" });
  });
  assert.equal(await sendAuthEmail("fictional-key", message, stub), false);
  assert.equal(await sendAuthEmail("fictional-key", message, stub), true);
  assert.equal(new Headers(calls[0].headers).get("Idempotency-Key"), new Headers(calls[1].headers).get("Idempotency-Key"));
  assert.match(new Headers(calls[0].headers).get("Idempotency-Key")!, /^aipex-auth-email\/v2\/[0-9a-f]{64}$/);
  assert.ok(!new Headers(calls[0].headers).get("Idempotency-Key")!.includes("qa@example.org"));
  assert.equal(calls[0].body, calls[1].body);
  assert.ok(!String(calls[0].body).includes("192.0.2.1"));
  assert.equal(await sendAuthEmail("fictional-key", message, fetchStub(async () => Response.json({}))), false);
  assert.equal(await sendAuthEmail("fictional-key", message, fetchStub(async () => { throw new Error("private details"); })), false);
});
