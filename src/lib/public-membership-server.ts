import "server-only";
import { NeonPostgrestClient, fetchWithToken } from "@neondatabase/postgrest-js";
import { isIP } from "node:net";
import { after } from "next/server";
import { createAuth } from "./auth";
import { createMembershipFormToken, membershipRateKey } from "./public-membership";
import { deliverMembershipEmailBatch, sendMembershipEmail, type ClaimedMembershipEmail } from "./membership-email-delivery";

export function publicMembershipConfigured() {
  return process.env.VERCEL_ENV !== "preview" && Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_DATA_API_URL &&
    process.env.RESEND_API_KEY && (process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET?.length ?? 0) >= 32);
}
export function membershipFormToken() {
  const secret = process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET ?? "";
  return secret.length >= 32 ? createMembershipFormToken(secret) : "";
}

/** Guest JWTs have no account identity and no table permissions. Only the
 * server-secret-protected intake/one-request outbox RPCs are granted. */
export async function publicMembershipClient() {
  const base = process.env.NEON_AUTH_BASE_URL?.replace(/\/$/, "");
  if (!base || !process.env.NEON_DATA_API_URL) throw new Error("membership_not_configured");
  const response = await fetch(`${base}/token/anonymous`, { cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error("membership_guest_unavailable");
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !("token" in body) || typeof body.token !== "string") throw new Error("membership_guest_unavailable");
  const token = body.token;
  return new NeonPostgrestClient({ dataApiUrl: process.env.NEON_DATA_API_URL,
    options: { global: { fetch: fetchWithToken(async () => token) } } });
}
export function publicMembershipRateKey(requestHeaders: Headers) {
  const value = process.env.VERCEL === "1" ? requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0].trim() : null;
  return membershipRateKey(value && isIP(value) ? value : "unknown", process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET!);
}

export async function schedulePublicMembershipEmails(requestId?: string) {
  if (process.env.VERCEL_ENV === "preview" || !publicMembershipConfigured()) return;
  try {
    // The reviewer captures a live JWT before after(); the public path uses
    // only a guest token and can dispatch its single new request.
    let client: NeonPostgrestClient;
    if (requestId) client = await publicMembershipClient();
    else {
      const { data, error } = await createAuth().token();
      if (error || !data?.token) throw new Error("membership_reviewer_session_unavailable");
      const token = data.token;
      client = new NeonPostgrestClient({ dataApiUrl: process.env.NEON_DATA_API_URL!, options: { global: { fetch: fetchWithToken(async () => token) } } });
    }
    const secret = process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET!;
    after(async () => {
      try {
        const { data, error } = await client.rpc("claim_public_membership_emails", {
          p_dispatch_secret: secret, p_request_id: requestId ?? null, p_limit: 5,
        });
        if (error || !Array.isArray(data)) throw new Error("queue_unavailable");
        await deliverMembershipEmailBatch(data as ClaimedMembershipEmail[], {
          send: (id, payload) => sendMembershipEmail(process.env.RESEND_API_KEY!, id, payload),
          finish: async (event, result) => {
            const { data: saved, error: saveError } = await client.rpc("finish_public_membership_email", {
              p_dispatch_secret: secret, p_event_id: event.event_id, p_lease_token: event.lease_token,
              p_provider_id: "providerId" in result ? result.providerId : null,
              p_error: "error" in result ? result.error : null,
              p_retryable: "retryable" in result ? result.retryable : false,
            });
            return !saveError && saved === true;
          },
          pause: () => new Promise(resolve => setTimeout(resolve, 550)),
        });
      } catch { console.error("Membership application emails remain queued for retry."); }
    });
  } catch { console.error("Membership application emails remain queued for retry."); }
}
