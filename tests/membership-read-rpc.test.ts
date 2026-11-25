import assert from "node:assert/strict";
import test from "node:test";
import { NeonPostgrestClient, fetchWithToken } from "@neondatabase/postgrest-js";
import { readMembershipRpc, type MembershipReadOperation } from "../src/lib/membership-read-rpc";

type ResponseFixture = { body: unknown; status?: number };
function fixture(responses: ResponseFixture[]) {
  const calls: { path: string; method?: string; body?: BodyInit | null; authorization: string | null; cache?: RequestCache }[] = [];
  const transport: typeof fetch = async (input, init) => {
    calls.push({ path: new URL(String(input)).pathname, method: init?.method,
      body: init?.body, authorization: new Headers(init?.headers).get("Authorization"), cache: init?.cache });
    const response = responses[calls.length - 1];
    assert.ok(response, "no unbounded retry or unexpected HTTP call");
    return Response.json(response.body, { status: response.status ?? 200 });
  };
  // Production supplies one frozen caller JWT and an uncached fetch wrapper.
  const uncached: typeof fetch = (input, init) => transport(input, { ...init, cache: "no-store" });
  const client = new NeonPostgrestClient({
    dataApiUrl: "https://fixture.invalid/neondb/rest/v1",
    options: { global: { fetch: fetchWithToken(async () => "fictional-fixed-caller-token", uncached) } },
  });
  return { client, calls };
}

test("a malformed POST normalized from HTTP 404 [] retries once with GET and a strict valid decision", async t => {
  const warning = t.mock.method(console, "warn", () => {});
  const { client, calls } = fixture([{ status: 404, body: [] }, { body: true }]);
  const result = await readMembershipRpc(client, "membership_is_reviewer");
  assert.equal(result.data, true);
  assert.equal(result.error, null);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls.map(call => call.method), ["POST", "GET"]);
  assert.equal(calls[0].body, "{}");
  assert.equal(calls[1].body, undefined);
  for (const call of calls) {
    assert.equal(call.path, "/neondb/rest/v1/rpc/membership_is_reviewer");
    assert.equal(call.authorization, "Bearer fictional-fixed-caller-token");
    assert.equal(call.cache, "no-store");
  }
  assert.equal(warning.mock.callCount(), 1);
  assert.deepEqual(warning.mock.calls[0].arguments, ["Membership read RPC used GET compatibility fallback.", {
    operation: "membership_is_reviewer", postStatus: 200, getStatus: 200,
    postShape: "array", getShape: "boolean", getValid: true,
  }]);
});

test("valid true and false decisions are returned without GET or fallback logging", async t => {
  const warning = t.mock.method(console, "warn", () => {});
  for (const expected of [true, false]) {
    const { client, calls } = fixture([{ body: expected }]);
    const result = await readMembershipRpc(client, "membership_is_reviewer");
    assert.equal(result.data, expected);
    assert.equal(calls.length, 1);
  }
  assert.equal(warning.mock.callCount(), 0);
});

test("explicit authorization errors never trigger a GET attempt", async t => {
  const warning = t.mock.method(console, "warn", () => {});
  for (const status of [401, 403]) {
    const { client, calls } = fixture([{ status, body: { code: "42501", message: "private provider message" } }]);
    const result = await readMembershipRpc(client, "membership_is_reviewer");
    assert.equal(result.status, status);
    assert.equal(result.error?.code, "42501");
    assert.equal(calls.length, 1);
  }
  assert.equal(warning.mock.callCount(), 0);
});

test("malformed or unauthorized GET responses fail closed without coercion or further retries", async t => {
  const warning = t.mock.method(console, "warn", () => {});
  for (const response of [
    { body: null }, { body: "true" }, { body: [true] }, { body: { membership_is_reviewer: true } },
    { status: 403, body: { code: "42501", message: "private provider message" } },
  ]) {
    const { client, calls } = fixture([{ body: [] }, response]);
    await assert.rejects(readMembershipRpc(client, "membership_is_reviewer"), { message: "Membership review data could not be checked." });
    assert.equal(calls.length, 2);
    const metadata = warning.mock.calls.at(-1)!.arguments[1];
    assert.equal(metadata.getValid, false);
    assert.equal(JSON.stringify(metadata).includes("private provider message"), false);
    assert.equal(JSON.stringify(metadata).includes("fictional-fixed-caller-token"), false);
  }
});

test("a valid false GET remains a denial after malformed POST", async t => {
  t.mock.method(console, "warn", () => {});
  const { client, calls } = fixture([{ body: [] }, { body: false }]);
  const result = await readMembershipRpc(client, "membership_is_reviewer");
  assert.equal(result.data, false);
  assert.equal(calls.length, 2);
});

test("both whitelisted count RPCs accept only complete nonnegative safe integer records", async t => {
  t.mock.method(console, "warn", () => {});
  const counts = { pending: 3, approved: 1, declined: 0 };
  for (const operation of ["membership_counts", "public_membership_counts"] as const) {
    const direct = fixture([{ body: counts }]);
    assert.deepEqual((await readMembershipRpc(direct.client, operation)).data, counts);
    assert.equal(direct.calls.length, 1);
    const historical = fixture([{ body: { ...counts, limit: 50 } }]);
    assert.deepEqual((await readMembershipRpc(historical.client, operation)).data, { ...counts, limit: 50 });
    assert.equal(historical.calls.length, 1);
    const fallback = fixture([{ status: 404, body: [] }, { body: counts }]);
    assert.deepEqual((await readMembershipRpc(fallback.client, operation)).data, counts);
    assert.deepEqual(fallback.calls.map(call => call.method), ["POST", "GET"]);
    for (const body of [
      null, [], [counts], { ...counts, pending: "3" }, { ...counts, pending: null },
      { approved: 1, declined: 0 }, { ...counts, pending: -1 }, { ...counts, pending: 1.5 },
      { ...counts, pending: Number.MAX_SAFE_INTEGER + 1 },
    ]) {
      const invalid = fixture([{ body: [] }, { body }]);
      await assert.rejects(readMembershipRpc(invalid.client, operation), { message: "Membership review data could not be checked." });
      assert.equal(invalid.calls.length, 2);
    }
  }
});

test("unlisted operations are rejected before any HTTP request", async () => {
  for (const operation of ["review_membership", "submit_public_membership", "", "membership_is_reviewer/other"]) {
    const { client, calls } = fixture([]);
    await assert.rejects(readMembershipRpc(client, operation as MembershipReadOperation), { message: "Unsupported membership read operation." });
    assert.equal(calls.length, 0);
  }
});
