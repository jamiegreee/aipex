import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { ContactRateLimiter, createContactToken } from "./contact";

export const contactRateLimiter = new ContactRateLimiter();

// Derive contact-only signatures from an existing server secret. The secret
// and its hash never leave the server; no additional credentials are needed.
export function contactFormSecret() {
  return process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET || "";
}

export function contactFormToken() {
  const secret = contactFormSecret();
  return secret.length >= 32 ? createContactToken(secret) : "";
}

export function contactEmailConfigured() {
  return process.env.VERCEL_ENV !== "preview" &&
    Boolean(process.env.RESEND_API_KEY && contactFormSecret().length >= 32);
}

export function contactRateIdentity(requestHeaders: Headers, secret: string) {
  // Vercel overwrites this header at the edge. Do not trust proxy headers on
  // arbitrary local hosting. Only a short-lived HMAC is retained in memory.
  const forwarded = process.env.VERCEL === "1"
    ? requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0].trim()
    : null;
  const identity = forwarded && isIP(forwarded) ? forwarded : "unknown";
  return createHmac("sha256", secret)
    .update(`aipex-contact-rate-v1:${identity}`)
    .digest("hex");
}
