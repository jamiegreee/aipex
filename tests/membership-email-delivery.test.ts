import assert from "node:assert/strict";
import test from "node:test";
import {
  deliverMembershipEmailBatch,
  sendMembershipEmail,
  type ClaimedMembershipEmail,
  type MembershipEmailResult,
} from "../src/lib/membership-email-delivery";
import { buildMembershipEmail, type MembershipEmailPayload } from "../src/lib/membership-email-content";

const providerId = "e3098790-cfe6-4ffd-b2d2-cd4c7167d9f9";
const secretFixture = "fictional-test-key-never-sent";

function claimed(index = 1): ClaimedMembershipEmail {
  return {
    event_id: `aaf1a6d0-3e91-40f8-bf31-${String(index).padStart(12, "0")}`,
    lease_token: `e1887491-9319-4a6b-bb0c-${String(index).padStart(12, "0")}`,
    kind: "application_received",
    recipient_email: "verified-applicant@example.org",
    applicant_name: "Fictional applicant",
    applicant_role: "Policy adviser",
    applicant_organisation: "Fictional policy office",
    template_version: 1,
  };
}

function payload(): MembershipEmailPayload {
  const event = claimed();
  return buildMembershipEmail({ ...event, id: event.event_id });
}

function fetchStub(handler: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>): typeof fetch {
  return handler as typeof fetch;
}

test("transport uses only the fixed Resend endpoint and the same event idempotency key across retries", async () => {
  const calls: { input: RequestInfo | URL; init?: RequestInit }[] = [];
  const responses = [new Response("rate limited", { status: 429 }), Response.json({ id: providerId })];
  const send = fetchStub(async (input, init) => {
    calls.push({ input, init });
    return responses[calls.length - 1];
  });
  const event = claimed();
  const message = payload();
  assert.deepEqual(await sendMembershipEmail(secretFixture, event.event_id, message, send), {
    error: "resend_http_429", retryable: true,
  });
  assert.deepEqual(await sendMembershipEmail(secretFixture, event.event_id, message, send), { providerId });
  assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.equal(call.input, "https://api.resend.com/emails");
    assert.equal(call.init?.method, "POST");
    const headers = new Headers(call.init?.headers);
    assert.equal(headers.get("Authorization"), `Bearer ${secretFixture}`);
    assert.equal(headers.get("Content-Type"), "application/json");
    assert.equal(headers.get("Idempotency-Key"), `aipex-membership/${event.event_id}`);
    assert.deepEqual(JSON.parse(String(call.init?.body)), message);
    assert.equal(call.init?.cache, "no-store");
    assert.ok(call.init?.signal instanceof AbortSignal);
  }
  assert.equal(calls[0].init?.body, calls[1].init?.body, "retry retains the exact event content");
});

test("only a valid provider email ID confirms acceptance; malformed successes stay unconfirmed", async () => {
  for (const body of [null, {}, [], { id: null }, { id: 123 }, { id: "" }, { id: "not-a-provider-id" }]) {
    const result = await sendMembershipEmail(secretFixture, claimed().event_id, payload(),
      fetchStub(async () => Response.json(body)));
    assert.deepEqual(result, { error: "resend_unconfirmed_response", retryable: true });
  }
  const invalidJson = await sendMembershipEmail(secretFixture, claimed().event_id, payload(),
    fetchStub(async () => new Response("not JSON", { status: 200 })));
  assert.deepEqual(invalidJson, { error: "resend_unconfirmed_response", retryable: true });
  const accepted = await sendMembershipEmail(secretFixture, claimed().event_id, payload(),
    fetchStub(async () => Response.json({ id: providerId, private_details: "not returned" })));
  assert.deepEqual(accepted, { providerId });
});

test("retryable provider/network failures and permanent bad requests return bounded codes without private error data", async () => {
  for (const [status, retryable] of [[429, true], [503, true], [400, false], [422, false]] as const) {
    const response = new Response(JSON.stringify({ message: "private@example.org rejected; secret credential details" }), { status });
    const result = await sendMembershipEmail(secretFixture, claimed().event_id, payload(), fetchStub(async () => response));
    assert.deepEqual(result, { error: `resend_http_${status}`, retryable });
    assert.equal(response.bodyUsed, false, "private provider error body is never parsed");
    assert.ok(!JSON.stringify(result).includes("private@example.org"));
    assert.ok(!JSON.stringify(result).includes(secretFixture));
  }
  for (const error of [new Error(`network failed for private@example.org with ${secretFixture}`), new DOMException("timeout", "TimeoutError")]) {
    const result = await sendMembershipEmail(secretFixture, claimed().event_id, payload(), fetchStub(async () => { throw error; }));
    assert.deepEqual(result, { error: "resend_unconfirmed_response", retryable: true });
    assert.ok(!JSON.stringify(result).includes("private@example.org"));
    assert.ok(!JSON.stringify(result).includes(secretFixture));
  }
});

test("batch records every delivery outcome with its claimed event and lease, including failed deliveries", async () => {
  const events = [claimed(1), claimed(2), claimed(3)];
  const finishes: { event: ClaimedMembershipEmail; result: MembershipEmailResult }[] = [];
  const sends: string[] = [];
  let pauses = 0;
  const result = await deliverMembershipEmailBatch(events, {
    send: async eventId => {
      sends.push(eventId);
      return eventId === events[0].event_id ? { providerId } :
        eventId === events[1].event_id ? { error: "resend_http_429", retryable: true } :
          { error: "resend_http_400", retryable: false };
    },
    finish: async (event, delivery) => { finishes.push({ event, result: delivery }); return true; },
    pause: async () => { pauses++; },
  });
  assert.deepEqual(result, { claimed: 3, accepted: 1, failed: 2, unconfirmed: 0 });
  assert.deepEqual(sends, events.map(event => event.event_id));
  assert.equal(pauses, 2);
  assert.equal(finishes.length, 3);
  for (let index = 0; index < events.length; index++) {
    assert.equal(finishes[index].event, events[index], "finish receives the original claimed lease");
    assert.equal(finishes[index].event.lease_token, events[index].lease_token);
  }
  assert.deepEqual(finishes[1].result, { error: "resend_http_429", retryable: true });
  assert.deepEqual(finishes[2].result, { error: "resend_http_400", retryable: false });
});

test("lost acknowledgements stay unconfirmed rather than accepted or failed, and do not resend within the batch", async () => {
  const events = [claimed(1), claimed(2), claimed(3)];
  const sent: string[] = [];
  const finished: string[] = [];
  const result = await deliverMembershipEmailBatch(events, {
    send: async eventId => { sent.push(eventId); return { providerId }; },
    finish: async event => {
      finished.push(event.event_id);
      if (event.event_id === events[0].event_id) return false;
      if (event.event_id === events[1].event_id) throw new Error("database acknowledgement lost");
      return true;
    },
  });
  assert.deepEqual(result, { claimed: 3, accepted: 1, failed: 0, unconfirmed: 2 });
  assert.deepEqual(sent, events.map(event => event.event_id));
  assert.deepEqual(finished, sent);
});

test("invalid or redirected recipients are finished as permanent event errors without calling the provider", async () => {
  const events = [
    { ...claimed(1), recipient_email: "recipient@example.org\r\nBcc: attacker@example.org" },
    { ...claimed(2), kind: "founder_alert" as const, recipient_email: "attacker@example.org" },
  ];
  const outcomes: MembershipEmailResult[] = [];
  let providerCalls = 0;
  const result = await deliverMembershipEmailBatch(events, {
    send: async () => { providerCalls++; return { providerId }; },
    finish: async (_event, delivery) => { outcomes.push(delivery); return true; },
  });
  assert.equal(providerCalls, 0);
  assert.deepEqual(outcomes, [
    { error: "invalid_membership_email_event", retryable: false },
    { error: "invalid_membership_email_event", retryable: false },
  ]);
  assert.deepEqual(result, { claimed: 2, accepted: 0, failed: 2, unconfirmed: 0 });
});

test("delivery content comes from the claimed application snapshot and ignores unrelated form-shaped fields", async () => {
  const event = Object.assign(claimed(), {
    email: "form-attacker@example.org", from: "attacker@example.org", to: ["form-attacker@example.org"],
    subject: "Forged subject", html: '<a href="https://evil.example">forged</a>',
    form: { recipient_email: "form-attacker@example.org", fullName: "Forged applicant" },
  });
  const payloads: MembershipEmailPayload[] = [];
  await deliverMembershipEmailBatch([event], {
    send: async (_eventId, message) => { payloads.push(message); return { providerId }; },
    finish: async () => true,
  });
  assert.equal(payloads.length, 1);
  assert.deepEqual(payloads[0].to, ["verified-applicant@example.org"]);
  assert.equal(payloads[0].from, "AIPEX <hello@theaipex.org>");
  assert.ok(payloads[0].text.includes("Hello Fictional applicant,"));
  assert.ok(!JSON.stringify(payloads[0]).includes("form-attacker@example.org"));
  assert.ok(!JSON.stringify(payloads[0]).includes("Forged"));
  assert.ok(!payloads[0].html.includes("evil.example"));
});

test("an unexpected sender rejection remains retryable and is durably recorded without exposing its error", async () => {
  const outcomes: MembershipEmailResult[] = [];
  const result = await deliverMembershipEmailBatch([claimed()], {
    send: async () => { throw new Error(`provider outcome unknown: private@example.org ${secretFixture}`); },
    finish: async (_event, delivery) => { outcomes.push(delivery); return true; },
  });
  assert.deepEqual(outcomes, [{ error: "resend_unconfirmed_response", retryable: true }]);
  assert.deepEqual(result, { claimed: 1, accepted: 0, failed: 1, unconfirmed: 0 });
  assert.ok(!JSON.stringify(outcomes).includes("private@example.org"));
  assert.ok(!JSON.stringify(outcomes).includes(secretFixture));
});
