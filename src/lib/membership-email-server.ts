import "server-only";
import { after } from "next/server";
import { NeonPostgrestClient, fetchWithToken } from "@neondatabase/postgrest-js";
import { createAuth } from "./auth";
import { deliverMembershipEmailBatch, sendMembershipEmail, type ClaimedMembershipEmail } from "./membership-email-delivery";

export function membershipEmailConfigured() {
  return process.env.VERCEL_ENV !== "preview" &&
    Boolean(process.env.RESEND_API_KEY && process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET);
}

/** Capture the session before after() runs: refreshing auth cookies after the
 * response has been sent is not safe. No owner database credential is used. */
export async function prepareMembershipEmailDispatch() {
  if (!membershipEmailConfigured()) throw new Error("membership_email_not_configured");
  const { data, error } = await createAuth().token();
  if (error || !data?.token) throw new Error("membership_email_session_unavailable");
  const token = data.token;
  const client = new NeonPostgrestClient({
    dataApiUrl: process.env.NEON_DATA_API_URL!,
    options: { global: { fetch: fetchWithToken(async () => token) } },
  });
  return (userId?: string) => dispatchWithClient(client, userId);
}

export async function dispatchMembershipEmails(userId?: string) {
  const dispatch = await prepareMembershipEmailDispatch();
  return dispatch(userId);
}

async function dispatchWithClient(client: NeonPostgrestClient, userId?: string) {
  const secret = process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET!;
  const { data, error } = await client.rpc("claim_membership_emails", {
    p_dispatch_secret: secret,
    p_user_id: userId ?? null,
    p_limit: 5,
  });
  if (error || !Array.isArray(data)) throw new Error("membership_email_queue_unavailable");
  return deliverMembershipEmailBatch(data as ClaimedMembershipEmail[], {
    send: (eventId, payload) => sendMembershipEmail(process.env.RESEND_API_KEY!, eventId, payload),
    finish: async (event, result) => {
      const { data: saved, error: saveError } = await client.rpc("finish_membership_email", {
        p_dispatch_secret: secret,
        p_event_id: event.event_id,
        p_lease_token: event.lease_token,
        p_provider_id: "providerId" in result ? result.providerId : null,
        p_error: "error" in result ? result.error : null,
        p_retryable: "retryable" in result ? result.retryable : false,
      });
      return !saveError && saved === true;
    },
    // Keep a single batch below the default Resend request rate. Independent
    // invocations can still get a 429; those events stay queued for safe retry.
    pause: () => new Promise(resolve => setTimeout(resolve, 550)),
  });
}

/** Sends due emails in the background after the response. Applicants send
 * their own; a reviewer's session (no userId) sends every due email, so
 * anything an earlier attempt left behind goes out without a manual step. */
export async function scheduleMembershipEmails(userId?: string) {
  try {
    const dispatch = await prepareMembershipEmailDispatch();
    after(async () => {
      try { await dispatch(userId); }
      catch { console.error("Membership emails remain queued and will be retried automatically."); }
    });
  } catch {
    console.error("Membership emails remain queued and will be retried automatically.");
  }
}
