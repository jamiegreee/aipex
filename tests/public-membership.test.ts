import assert from "node:assert/strict";
import test from "node:test";
import { createContactToken } from "../src/lib/contact";
import { createMembershipFormToken, membershipRateKey, parsePublicMembershipForm, verifyMembershipFormToken } from "../src/lib/public-membership";

const secret = "fictional-membership-test-secret-at-least-32-characters";
function application() {
  const form = new FormData();
  Object.entries({ email: "Applicant+invite@Example.org", fullName: "Test applicant", role: "Policy adviser", organisation: "Fictional policy team", country: "United Kingdom", motivation: "A fictional applicant testing a public application without an account.", agreement: "on" }).forEach(([key, value]) => form.set(key, value));
  form.append("interests", "economy");
  return form;
}
test("public applications need email and professional details, with no account identity", () => {
  const result = parsePublicMembershipForm(application());
  assert.deepEqual(result.errors, {});
  assert.equal(result.data?.email, "applicant+invite@example.org");
  assert.ok(!("userId" in result.data!));
  assert.ok(!("status" in result.data!));
});
test("email validation rejects lists, control characters, malformed and duplicated addresses", () => {
  for (const email of ["", "not-an-email", "a@b", "a@example.org,b@example.org", "victim@example.org\r\nBcc:a@b.org", "a..b@example.org", ".a@example.org", "a@example..org", "a@-example.org", `${"a".repeat(65)}@example.org`]) {
    const form = application(); form.set("email", email);
    assert.ok(parsePublicMembershipForm(form).errors.email, email);
  }
  const duplicate = application(); duplicate.append("email", "second@example.org");
  assert.ok(parsePublicMembershipForm(duplicate).errors.email);
});
test("public intake rejects authority fields and spam traps while preserving participation rules", () => {
  for (const [field, value] of [["userId", "someone-else"], ["status", "approved"], ["reviewed_by", "admin"], ["website", "spam"]]) {
    const form = application(); form.set(field, value);
    assert.equal(parsePublicMembershipForm(form).data, undefined);
  }
  const form = application(); form.delete("agreement");
  assert.ok(parsePublicMembershipForm(form).errors.agreement);
});
test("membership form tokens are bounded, expire and cannot be substituted with contact tokens", () => {
  const now = 1_800_000_000_000;
  const token = createMembershipFormToken(secret, now);
  assert.ok("nonce" in verifyMembershipFormToken(token, secret, now + 3_000));
  assert.deepEqual(verifyMembershipFormToken(token, secret, now + 1_000), { error: "early" });
  assert.deepEqual(verifyMembershipFormToken(token, secret, now + 3_600_001), { error: "expired" });
  assert.deepEqual(verifyMembershipFormToken(createContactToken(secret, now), secret, now + 3_000), { error: "invalid" });
  assert.deepEqual(verifyMembershipFormToken(token, secret + "wrong", now + 3_000), { error: "invalid" });
});
test("rate identifiers reveal no address and remain stable for persistent rolling limits", () => {
  const key = membershipRateKey("192.0.2.1", secret);
  assert.match(key, /^[0-9a-f]{64}$/);
  assert.equal(key.includes("192.0.2.1"), false);
  assert.equal(key, membershipRateKey("192.0.2.1", secret));
  assert.notEqual(key, membershipRateKey("192.0.2.2", secret));
  assert.notEqual(key, membershipRateKey("192.0.2.1", secret + "different"));
});
