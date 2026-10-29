import assert from "node:assert/strict";
import test from "node:test";
import { foundingMemberLimit, membershipInterestOptions, parseMembershipForm } from "../src/lib/membership";

function application() {
  const form = new FormData();
  form.set("fullName", "  Zoë Nguyễn  ");
  form.set("role", "Policy adviser");
  form.set("organisation", "Public Policy Office");
  form.set("country", "United Kingdom");
  form.set("profileUrl", "https://linkedin.com/in/zoe-nguyen/?trk=private#details");
  form.append("interests", "public-institutions");
  form.append("interests", "international");
  form.set("motivation", "I want to compare practical approaches to preparing public institutions for advanced AI.");
  form.set("contribution", "Experience developing public-service policy.\r\nHappy to exchange evidence.");
  form.set("agreement", "on");
  form.set("website", "");
  return form;
}

test("membership applications preserve international text and derive no identity from form input", () => {
  const form = application();
  form.set("email", "someone-else@example.com");
  form.set("user_id", "another-user");
  form.set("status", "approved");
  const result = parseMembershipForm(form);
  assert.deepEqual(result.errors, {});
  assert.ok(result.data);
  assert.equal(result.data.fullName, "Zoë Nguyễn");
  assert.equal(result.data.profileUrl, "https://www.linkedin.com/in/zoe-nguyen");
  assert.equal(result.data.contribution, "Experience developing public-service policy.\nHappy to exchange evidence.");
  assert.equal(result.data.agreement, true);
  assert.equal("email" in result.data, false);
  assert.equal("user_id" in result.data, false);
  assert.equal("status" in result.data, false);
  assert.equal(foundingMemberLimit, 50);

  for (const name of ["山田 太郎", "عائشة حسن", "श्रेया कुमार", "A\u0301ine Ó Briain"]) {
    form.set("fullName", name);
    assert.equal(parseMembershipForm(form).data?.fullName, name.normalize("NFC"));
  }
});

test("membership applications enforce text boundaries without requiring optional fields", () => {
  const bounds = [
    ["fullName", 2, 100], ["role", 2, 120], ["organisation", 2, 160],
    ["country", 2, 100], ["motivation", 40, 1500], ["contribution", 0, 1000],
  ] as const;
  for (const [field, minimum, maximum] of bounds) {
    const form = application();
    form.set(field, "é".repeat(maximum));
    assert.ok(parseMembershipForm(form).data, `${field} accepts its maximum`);
    form.set(field, "é".repeat(maximum + 1));
    assert.ok(parseMembershipForm(form).errors[field], `${field} rejects an oversized value`);
    if (minimum) {
      form.set(field, "a".repeat(minimum - 1));
      assert.ok(parseMembershipForm(form).errors[field], `${field} enforces its minimum`);
    }
  }
  const form = application();
  form.delete("profileUrl"); form.delete("contribution");
  assert.equal(parseMembershipForm(form).data?.profileUrl, "");
  assert.equal(parseMembershipForm(form).data?.contribution, "");
  form.set("fullName", "𠮷".repeat(100));
  assert.ok(parseMembershipForm(form).data, "length limits count Unicode characters, not UTF-16 units");
  form.set("profileUrl", "https://www.linkedin.com/in/" + "x".repeat(300));
  assert.ok(parseMembershipForm(form).errors.profileUrl);
});

test("public profile links reject hostile protocols, misleading hosts and non-profile LinkedIn URLs", () => {
  for (const url of [
    "javascript:alert(1)", "http://www.linkedin.com/in/person", "//www.linkedin.com/in/person",
    "https://www.linkedin.com.evil.test/in/person", "https://evil.test/in/person",
    "https://www.linkedin.com/company/organisation", "https://www.linkedin.com/in/person/posts",
    "https://person:password@www.linkedin.com/in/person", "https://www.linkedin.com:8443/in/person",
    "https://www.linkedin.com/in/name%2Fother", "https://www.linkedin.com/in/name%0Aother",
    "https://www.linkedin.com/in/name%ZZ", "https://www.linkedin.com/in/a b", "https://www.linkedin.com/in/",
    "https://www.linkedin.com/in/person@somewhere", "https://www.linkedin.com/in/name!",
    "https://linkedin.com/in/" + "x".repeat(275),
  ]) {
    const form = application(); form.set("profileUrl", url);
    assert.ok(parseMembershipForm(form).errors.profileUrl, url);
    assert.equal(parseMembershipForm(form).data, undefined);
  }
  const form = application();
  form.set("profileUrl", "https://WWW.LINKEDIN.COM/in/person-name");
  assert.equal(parseMembershipForm(form).data?.profileUrl, "https://www.linkedin.com/in/person-name");
  form.set("profileUrl", "https://www.linkedin.com/in/zoë-nguyễn");
  assert.equal(parseMembershipForm(form).data?.profileUrl, "https://www.linkedin.com/in/zo%C3%AB-nguy%E1%BB%85n");
});

test("interest choices require a bounded unique set of known options and explicit agreement", () => {
  for (const choices of [[], ["unknown"], ["economy", "economy"], membershipInterestOptions.map(({ value }) => value)]) {
    const form = application(); form.delete("interests");
    for (const value of choices) form.append("interests", value);
    assert.ok(parseMembershipForm(form).errors.interests);
  }
  const form = application(); form.delete("interests");
  for (const { value } of membershipInterestOptions.slice(0, 4)) form.append("interests", value);
  assert.ok(parseMembershipForm(form).data);
  for (const value of ["", "false", "off", "0"]) {
    form.set("agreement", value);
    assert.ok(parseMembershipForm(form).errors.agreement);
  }
  form.delete("agreement");
  assert.ok(parseMembershipForm(form).errors.agreement);
});

test("malformed multipart values, duplicate scalar fields, control characters and the honeypot are rejected", () => {
  const form = application();
  form.append("fullName", "Another person");
  assert.ok(parseMembershipForm(form).errors.fullName);
  form.set("fullName", new Blob(["not a name"], { type: "text/plain" }));
  assert.ok(parseMembershipForm(form).errors.fullName);
  for (const name of ["Jane\nSmith", "Jane\u0000Smith", "Jane\u007fSmith", "Jane\u202eSmith"]) {
    form.set("fullName", name);
    assert.ok(parseMembershipForm(form).errors.fullName);
  }
  form.set("fullName", "Jane Smith");
  form.set("motivation", "A valid paragraph with an unsupported\u0000 character in its explanation.");
  assert.ok(parseMembershipForm(form).errors.motivation);
  form.set("motivation", "A valid paragraph about how public institutions can plan for advanced artificial intelligence.");
  form.set("website", "https://spam.example");
  assert.ok(parseMembershipForm(form).errors.form);
  assert.equal(parseMembershipForm(form).data, undefined);
});
