import { buildMembershipEmail, type MembershipEmailEvent, type MembershipEmailPayload } from "./membership-email-content";

export type ClaimedMembershipEmail = Omit<MembershipEmailEvent, "id"> & {
  event_id: string;
  lease_token: string;
};
export type MembershipEmailResult =
  | { providerId: string }
  | { error: string; retryable: boolean };
export type MembershipEmailBatchResult = {
  claimed: number;
  accepted: number;
  failed: number;
  unconfirmed: number;
};

/** No provider error bodies or credentials are returned to the UI or logs. */
export async function sendMembershipEmail(
  apiKey: string,
  eventId: string,
  payload: MembershipEmailPayload,
  send: typeof fetch = fetch,
): Promise<MembershipEmailResult> {
  try {
    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `aipex-membership/${eventId}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        error: `resend_http_${response.status}`,
        retryable: [401, 403, 408, 409, 425, 429].includes(response.status) || response.status >= 500,
      };
    }
    const body: unknown = await response.json();
    if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id)) {
      return { error: "resend_unconfirmed_response", retryable: true };
    }
    return { providerId: body.id };
  } catch {
    // A timeout may follow provider acceptance. Retry only with the same event
    // key and immutable versioned content; SQL stops retries before the 24-hour edge.
    return { error: "resend_unconfirmed_response", retryable: true };
  }
}

export async function deliverMembershipEmailBatch(
  events: ClaimedMembershipEmail[],
  dependencies: {
    send: (eventId: string, payload: MembershipEmailPayload) => Promise<MembershipEmailResult>;
    finish: (event: ClaimedMembershipEmail, result: MembershipEmailResult) => Promise<boolean>;
    pause?: () => Promise<void>;
  },
): Promise<MembershipEmailBatchResult> {
  const result: MembershipEmailBatchResult = { claimed: events.length, accepted: 0, failed: 0, unconfirmed: 0 };
  for (let index = 0; index < events.length; index++) {
    if (index > 0) await dependencies.pause?.();
    const event = events[index];
    let delivery: MembershipEmailResult;
    let payload: MembershipEmailPayload | null = null;
    try {
      payload = buildMembershipEmail({ ...event, id: event.event_id });
      delivery = { error: "invalid_membership_email_event", retryable: false };
    } catch {
      delivery = { error: "invalid_membership_email_event", retryable: false };
    }
    if (payload) {
      try { delivery = await dependencies.send(event.event_id, payload); }
      catch { delivery = { error: "resend_unconfirmed_response", retryable: true }; }
    }
    try {
      if (!(await dependencies.finish(event, delivery))) {
        result.unconfirmed++;
      } else if ("providerId" in delivery) {
        result.accepted++;
      } else {
        result.failed++;
      }
    } catch {
      // Do not mark an accepted-but-unrecorded email as failed or retry with a
      // new key. Its lease and existing event ID remain in the private outbox.
      result.unconfirmed++;
    }
  }
  return result;
}
