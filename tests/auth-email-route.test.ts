import assert from "node:assert/strict";
import test from "node:test";
import { generateKeyPairSync, sign } from "node:crypto";
import { POST } from "../src/app/api/webhooks/neon-auth/route";

test("webhook route verifies before sending and acknowledges only real provider acceptance", async () => {
  const saved = { base: process.env.NEON_AUTH_BASE_URL, key: process.env.RESEND_API_KEY, deployment: process.env.VERCEL_ENV, fetch: global.fetch };
  const base = "https://ep-route-test.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth";
  const keys = generateKeyPairSync("ed25519");
  const jwk = { ...keys.publicKey.export({ format: "jwk" }), kid: "route-test-key", alg: "EdDSA" };
  let sends = 0; let accepted = true;
  try {
    process.env.NEON_AUTH_BASE_URL = base; process.env.RESEND_API_KEY = "fictional-route-test-key"; process.env.VERCEL_ENV = "production";
    global.fetch = (async (url: RequestInfo | URL) => {
      if (String(url) === `${base}/.well-known/jwks.json`) return Response.json({ keys: [jwk] });
      assert.equal(String(url), "https://api.resend.com/emails"); sends++;
      return accepted ? Response.json({ id: "d0544707-62e0-49ba-82b2-2b45527c6495" }) : new Response(null, { status: 429 });
    }) as typeof fetch;
    const stamp = String(Date.now());
    const raw = JSON.stringify({ event_id: "evt-route-qa", event_type: "send.magic_link", context: { endpoint_id: "ep-route-test" },
      user: { email: "qa@example.org" }, event_data: { link_type: "email-verification", link_url: `${base}/verify-email?token=fictional`, expires_at: new Date(Date.now() + 60_000).toISOString() } });
    const protectedHeader = Buffer.from(JSON.stringify({ alg: "EdDSA", kid: "route-test-key" })).toString("base64url");
    const signedPayload = Buffer.from(`${stamp}.${Buffer.from(raw).toString("base64url")}`).toString("base64url");
    const signature = sign(null, Buffer.from(`${protectedHeader}.${signedPayload}`), keys.privateKey).toString("base64url");
    const headers = { "content-type": "application/json", "x-neon-timestamp": stamp, "x-neon-signature-kid": "route-test-key",
      "x-neon-signature": `${protectedHeader}..${signature}`, "x-neon-event-id": "evt-route-qa", "x-neon-event-type": "send.magic_link" };
    const request = () => new Request("https://theaipex.org/api/webhooks/neon-auth", { method: "POST", headers, body: raw });
    const result = await POST(request()); assert.equal(result.status, 204); assert.match(result.headers.get("cache-control")!, /no-store/); assert.equal(sends, 1);
    accepted = false; assert.equal((await POST(request())).status, 503); assert.equal(sends, 2);
    assert.equal((await POST(new Request("https://theaipex.org/api/webhooks/neon-auth", { method: "POST", headers: { "content-type": "application/json" }, body: raw }))).status, 401); assert.equal(sends, 2);
    process.env.VERCEL_ENV = "preview"; assert.equal((await POST(request())).status, 503); assert.equal(sends, 2);
  } finally {
    global.fetch = saved.fetch;
    for (const [name, value] of [["NEON_AUTH_BASE_URL", saved.base], ["RESEND_API_KEY", saved.key], ["VERCEL_ENV", saved.deployment]]) {
      if (value === undefined) delete process.env[name!]; else process.env[name!] = value;
    }
  }
});
