import assert from "node:assert/strict";
import test from "node:test";
import { membershipSlackPath, membershipSlackResponse } from "../src/lib/membership-slack";

const invitation = "https://join.slack.com/t/theaipolicyexchange/shared_invite/zt-test-invitation";

function assertPrivate(response: Response) {
  assert.equal(response.headers.get("Cache-Control"), "private, no-store, max-age=0");
  assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.equal(response.headers.get("Vary"), "Cookie");
}

test("anonymous and unverified visitors must sign in before any membership lookup or invitation access", async () => {
  for (const user of [null, { id: "unverified", emailVerified: false }]) {
    const response = await membershipSlackResponse({
      currentUser: async (fresh) => { assert.equal(fresh, true); return user; },
      hasApprovedMembership: async () => { assert.fail("unauthenticated lookup"); },
      invitationUrl: () => { assert.fail("unauthenticated invitation access"); },
    });
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("Location"), `/login?next=${encodeURIComponent(membershipSlackPath)}`);
    assertPrivate(response);
    assert.ok(!(await response.text()).includes(invitation));
  }
});

test("a verified account without an active approved application cannot obtain the invitation", async () => {
  const response = await membershipSlackResponse({
    currentUser: async () => ({ id: "pending-declined-or-archived", emailVerified: true }),
    hasApprovedMembership: async (id) => {
      assert.equal(id, "pending-declined-or-archived");
      return false;
    },
    invitationUrl: () => { assert.fail("unapproved invitation access"); },
  });
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("Location"), "/membership");
  assertPrivate(response);
});

test("only a fresh verified approved member is redirected to the configured AIPEX workspace", async () => {
  const calls: string[] = [];
  const response = await membershipSlackResponse({
    currentUser: async (fresh) => {
      assert.equal(fresh, true);
      calls.push("fresh session");
      return { id: "approved-member", emailVerified: true };
    },
    hasApprovedMembership: async (id) => {
      assert.equal(id, "approved-member");
      calls.push("active approved membership");
      return true;
    },
    invitationUrl: () => { calls.push("invitation"); return invitation; },
  });
  assert.deepEqual(calls, ["fresh session", "active approved membership", "invitation"]);
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("Location"), invitation);
  assert.equal(await response.text(), "");
  assertPrivate(response);
});

test("bad configuration cannot create an open redirect or expose the configured value", async () => {
  for (const value of [
    undefined, "", "https://evil.example/join", "https://join.slack.com.evil.example/t/theaipolicyexchange/shared_invite/zt-test",
    "http://join.slack.com/t/theaipolicyexchange/shared_invite/zt-test",
    "https://join.slack.com/t/another-workspace/shared_invite/zt-test",
    "https://evil.example@join.slack.com/t/theaipolicyexchange/shared_invite/zt-test",
    "https://join.slack.com:443/t/theaipolicyexchange/shared_invite/zt-test",
    `${invitation}?next=https://evil.example`, `${invitation}#fragment`, `${invitation}\r\nX-Test: value`,
    ` ${invitation}`, `${invitation} `, `${invitation}\n`, `${invitation}\r`,
    "https://join.slack.com/t/theaipolicyexchange/shared_invite/../zt-test",
    "https://join.slack.com/t/theaipolicyexchange/shared_invite/%7at-test",
  ]) {
    const response = await membershipSlackResponse({
      currentUser: async () => ({ id: "approved", emailVerified: true }),
      hasApprovedMembership: async () => true,
      invitationUrl: () => value,
    });
    assert.equal(response.status, 503, value);
    assert.equal(response.headers.get("Location"), null);
    assert.ok(!(await response.text()).includes("https://"));
    assertPrivate(response);
  }
});

test("authentication and database outages fail closed without leaking provider errors or invitation", async () => {
  for (const failingDependency of ["session", "membership", "configuration"]) {
    const response = await membershipSlackResponse({
      currentUser: async () => {
        if (failingDependency === "session") throw new Error(`private provider error ${invitation}`);
        return { id: "approved", emailVerified: true };
      },
      hasApprovedMembership: async () => {
        if (failingDependency === "membership") throw new Error(`private provider error ${invitation}`);
        return true;
      },
      invitationUrl: () => {
        if (failingDependency === "configuration") throw new Error(`private provider error ${invitation}`);
        return invitation;
      },
    });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Location"), null);
    const body = await response.text();
    assert.ok(!body.includes(invitation) && !body.includes("private provider error"));
    assert.match(body, /hello@theaipex\.org/);
    assertPrivate(response);
  }
});
