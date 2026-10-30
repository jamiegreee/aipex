import assert from "node:assert/strict";
import test from "node:test";
import {
  buildMembershipEmail,
  type MembershipEmailEvent,
  type MembershipEmailKind,
} from "../src/lib/membership-email-content";

function event(kind: MembershipEmailKind): MembershipEmailEvent {
  return {
    id: "aaf1a6d0-3e91-40f8-bf31-103d1c6d4f9e",
    kind,
    recipient_email: kind === "founder_alert" ? "green.jcb@gmail.com" : "applicant+aipex@example.org",
    applicant_name: "Zoë Nguyễn",
    applicant_role: "Policy adviser",
    applicant_organisation: "Public Policy Office",
    template_version: 1,
  };
}

test("all membership emails are transactional, with both readable HTML and plain text", () => {
  for (const kind of ["founder_alert", "application_received", "application_approved", "application_declined"] as const) {
    const message = buildMembershipEmail(event(kind));
    assert.equal(message.from, "AIPEX <hello@theaipex.org>");
    assert.equal(message.reply_to, "hello@theaipex.org");
    assert.match(message.html, /<html lang="en">/);
    assert.match(message.html, /<h1 /);
    assert.ok(message.text.includes("Zoë Nguyễn"));
    assert.ok(message.html.includes("Zoë Nguyễn"));
    assert.ok(message.text.length > 150);
    assert.ok(!message.html.includes("<script"));
    assert.ok(!message.html.includes("<img"), "no tracking pixel or remote image");
    assert.ok(!/[\r\n]/u.test(message.subject));
    assert.equal(message.tags.find(tag => tag.name === "event_id")?.value, event(kind).id);
    assert.deepEqual(buildMembershipEmail(event(kind)), message, "retry content stays deterministic");
  }
});

test("founder alerts contain a short professional summary and a fixed authenticated review link", () => {
  const message = buildMembershipEmail(event("founder_alert"));
  assert.deepEqual(message.to, ["green.jcb@gmail.com"]);
  assert.equal(message.subject, "New AIPEX membership application");
  assert.match(message.text, /Role: Policy adviser/);
  assert.match(message.text, /Organisation: Public Policy Office/);
  assert.ok(message.text.includes("https://theaipex.org/admin/membership"));
  assert.ok(message.html.includes('href="https://theaipex.org/admin/membership"'));
  assert.throws(() => buildMembershipEmail({ ...event("founder_alert"), recipient_email: "someone-else@example.org" }), /invalid_membership_review_recipient/);
});

test("applicant receipts and decisions have distinct accurate copy and only fixed account/contact links", () => {
  const receipt = buildMembershipEmail(event("application_received"));
  const approval = buildMembershipEmail(event("application_approved"));
  const decline = buildMembershipEmail(event("application_declined"));
  assert.ok(receipt.text.includes("We will review your application and get back to you soon."));
  assert.ok(approval.text.includes("has been approved"));
  assert.ok(approval.text.includes("share the next steps with you soon"));
  assert.ok(decline.text.includes("unable to offer you membership at this stage"));
  assert.ok(decline.text.includes("Your AIPEX account remains available"));
  for (const message of [receipt, approval, decline]) {
    assert.deepEqual(message.to, ["applicant+aipex@example.org"]);
    assert.ok(!message.text.includes("Public Policy Office"), "unnecessary application details stay out of applicant email");
    assert.ok(!message.text.includes("Slack"));
    assert.ok(!message.text.includes("https://theaipex.org/admin"));
    const links = [...message.html.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, ["https://theaipex.org/account", "mailto:hello@theaipex.org"]);
  }
});

test("hostile profile text is escaped, does not inject links or headers, and keeps international names", () => {
  const payload = event("founder_alert");
  payload.applicant_name = 'Zoë\r\nBcc: attacker@example.org <script>alert("x")</script> & friends';
  payload.applicant_role = '<a href="https://evil.example">Adviser</a>';
  payload.applicant_organisation = "O'Reilly & <Partners>";
  const message = buildMembershipEmail(payload);
  assert.ok(!message.html.includes("<script>"));
  assert.ok(!message.html.includes('<a href="https://evil.example">'));
  assert.ok(message.html.includes("&lt;script&gt;"));
  assert.ok(message.html.includes("&amp; friends"));
  assert.ok(message.html.includes("O&#39;Reilly &amp; &lt;Partners&gt;"));
  assert.ok(message.text.includes('O\'Reilly & <Partners>'));
  assert.ok(!message.text.includes("Zoë\r\nBcc:"));
  assert.equal(message.subject, "New AIPEX membership application");
  assert.deepEqual(message.to, ["green.jcb@gmail.com"]);
  const links = [...message.html.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(links, ["https://theaipex.org/admin/membership", "mailto:hello@theaipex.org"]);
});

test("recipient addresses cannot introduce headers, extra recipients, or display-name syntax", () => {
  for (const recipient_email of [
    "person@example.org\r\nBcc: someone@example.org",
    "person@example.org,other@example.org", "person@example.org;other@example.org",
    "Person <person@example.org>", " person@example.org", "person@example.org ",
    "person@@example.org", "person@-example.org", "person@example..org", ".person@example.org",
    "person..name@example.org", "person@localhost", "person\u202e@example.org",
  ]) {
    assert.throws(() => buildMembershipEmail({ ...event("application_received"), recipient_email }), /invalid_membership_email_recipient/);
  }
  assert.deepEqual(buildMembershipEmail({ ...event("application_received"), recipient_email: "Applicant+AIPEX@Example.org" }).to, ["Applicant+AIPEX@Example.org"]);
});

test("unsupported event identifiers and future template versions fail closed", () => {
  assert.throws(() => buildMembershipEmail({ ...event("application_received"), id: "not-an-event" }), /unsupported_membership_email_event/);
  assert.throws(() => buildMembershipEmail({ ...event("application_received"), template_version: 2 }), /unsupported_membership_email_event/);
  assert.throws(() => buildMembershipEmail({ ...event("application_received"), kind: "arbitrary" as MembershipEmailKind }), /unsupported_membership_email_event/);
});
