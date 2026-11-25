import { createHmac } from "node:crypto";
import { parseMembershipForm, type MembershipInput } from "./membership";
import { createContactToken, verifyContactToken } from "./contact";

export type PublicMembershipInput = MembershipInput & { email: string };
const fields = new Set(["fullName", "email", "role", "organisation", "country", "profileUrl", "interests", "motivation", "contribution", "agreement", "website", "token"]);

export function parsePublicMembershipForm(form: FormData): { data?: PublicMembershipInput; errors: Record<string, string> } {
  const parsed = parseMembershipForm(form);
  const errors: Record<string, string> = { ...parsed.errors };
  for (const [key] of form) {
    if (!fields.has(key) && !key.startsWith("$ACTION_")) errors.form = "Refresh the form and try again.";
  }
  const emails = form.getAll("email");
  const raw = typeof emails[0] === "string" ? emails[0] : "";
  const email = raw.trim().toLowerCase();
  const parts = email.split("@");
  if (emails.length !== 1 || /[\u0000-\u001f\u007f-\u009f]/u.test(raw) || /\s/u.test(email) || email.length > 254 ||
    parts.length !== 2 || !parts[0] || parts[0].length > 64 || parts[0].startsWith(".") || parts[0].endsWith(".") || parts[0].includes("..") ||
    !/^[a-z0-9.!#$%&'*+\-/=?^_`{|}~]+$/i.test(parts[0]) ||
    !parts[1]?.includes(".") || !parts[1].split(".").every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) {
    errors.email = "Enter a valid email address so we can contact you about your application.";
  }
  const tokens = form.getAll("token");
  if (tokens.length > 1 || tokens.some(value => typeof value !== "string" || value.length > 200)) errors.form = "Refresh the form and try again.";
  if (!parsed.data || Object.keys(errors).length) return { errors };
  return { data: { ...parsed.data, email }, errors };
}

function formSecret(master: string) {
  if (master.length < 32) throw new Error("membership_form_not_configured");
  return createHmac("sha256", master).update("aipex-membership-form/v1").digest("hex");
}
export function createMembershipFormToken(master: string, now?: number) {
  return createContactToken(formSecret(master), now);
}
export function verifyMembershipFormToken(token: string, master: string, now?: number) {
  return verifyContactToken(token, formSecret(master), now);
}
export function membershipRateKey(identity: string, master: string) {
  return createHmac("sha256", formSecret(master)).update(`rate:v1:${identity}`).digest("hex");
}
