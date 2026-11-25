import assert from "node:assert/strict";
import test from "node:test";
import { NeonPostgrestClient, fetchWithToken } from "@neondatabase/postgrest-js";
import { requireMembershipReviewer } from "../src/lib/membership-review-access";

const failure = { message: "Membership review access could not be checked." };

test("reviewer access accepts explicit database booleans without coercion", () => {
  assert.equal(requireMembershipReviewer(true), true);
  assert.equal(requireMembershipReviewer(false), false);
  for (const value of [undefined, null, "true", "false", "", 1, 0, NaN,
    [], [true], [false], {}, { membership_is_reviewer: true }, { data: true }, new Boolean(true)]) {
    assert.throws(() => requireMembershipReviewer(value), failure);
  }
});

function fixture(body: string, status = 200) {
  const calls: { path: string; method: string | undefined; body: BodyInit | null | undefined; headers: Headers }[] = [];
  const transport: typeof fetch = async (input, init) => {
    calls.push({
      path: new URL(String(input)).pathname,
      method: init?.method,
      body: init?.body,
      headers: new Headers(init?.headers),
    });
    return new Response(body, { status, headers: { "Content-Type": "application/json" } });
  };
  const client = new NeonPostgrestClient({
    dataApiUrl: "https://fixture.invalid/neondb/rest/v1",
    options: { global: { fetch: fetchWithToken(async () => "fictional-test-token", transport) } },
  });
  return { client, calls };
}

test("actual SDK RPC preserves boolean decisions over the authenticated HTTP wire", async () => {
  for (const expected of [true, false]) {
    const { client, calls } = fixture(JSON.stringify(expected));
    const result = await client.rpc("membership_is_reviewer");
    assert.equal(result.error, null);
    assert.equal(requireMembershipReviewer(result.data), expected);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].path, "/neondb/rest/v1/rpc/membership_is_reviewer");
    assert.equal(calls[0].method, "POST");
    assert.equal(calls[0].body, "{}");
    assert.equal(calls[0].headers.get("Content-Type"), "application/json");
    assert.equal(calls[0].headers.get("Authorization"), "Bearer fictional-test-token");
  }
});

test("SDK-normalized HTTP 404 empty arrays remain lookup failures rather than false access decisions", async () => {
  const { client, calls } = fixture("[]", 404);
  const result = await client.rpc("membership_is_reviewer");
  assert.equal(calls.length, 1);
  // The installed SDK converts this upstream error into an apparent success.
  // The application guard still distinguishes it from a real boolean false.
  assert.equal(result.error, null);
  assert.equal(result.status, 200);
  assert.deepEqual(result.data, []);
  assert.throws(() => requireMembershipReviewer(result.data), failure);
});

test("successful HTTP responses with nonboolean payloads cannot grant reviewer access", async () => {
  for (const value of [null, "true", "false", 1, [], [true], { membership_is_reviewer: true }]) {
    const { client } = fixture(JSON.stringify(value));
    const result = await client.rpc("membership_is_reviewer");
    assert.equal(result.error, null);
    assert.throws(() => requireMembershipReviewer(result.data), failure);
  }
});
