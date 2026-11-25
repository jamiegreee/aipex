"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { createClient } from "@/lib/database";
import { scheduleMembershipEmails } from "@/lib/membership-email-server";
import { contactRequestAllowed } from "@/lib/contact";
import { parsePublicMembershipForm, verifyMembershipFormToken } from "@/lib/public-membership";
import { membershipFormToken, publicMembershipClient, publicMembershipConfigured, publicMembershipRateKey, schedulePublicMembershipEmails } from "@/lib/public-membership-server";

export type MembershipActionState = {
  errors?: Record<string, string>;
  error?: string;
  success?: boolean;
  notice?: string;
  token?: string;
};

export async function submitMembership(
  _: MembershipActionState,
  form: FormData,
): Promise<MembershipActionState> {
  const state = await submitPublicApplication(form);
  if (state.success || state.token) return state;
  const token = form.get("token");
  // Preserve a refreshed token across later field/transport errors.
  return { ...state, ...(typeof token === "string" && token.length <= 200 ? { token } : {}) };
}

async function submitPublicApplication(form: FormData): Promise<MembershipActionState> {
  const parsed = parsePublicMembershipForm(form);
  if (!parsed.data) return { errors: parsed.errors };
  try {
    const requestHeaders = new Headers(await headers());
    if (!contactRequestAllowed(requestHeaders)) return { error: "Refresh this page before applying.", token: membershipFormToken() };
    if (!publicMembershipConfigured()) return { error: "Applications are temporarily unavailable. Please contact hello@theaipex.org." };
    const rawToken = form.get("token");
    const token = verifyMembershipFormToken(typeof rawToken === "string" ? rawToken : "", process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET!);
    if ("error" in token) return token.error === "early"
      ? { error: "Please wait a moment, then submit your application again." }
      : { error: "This form has expired. Your answers are still here; please try again.", token: membershipFormToken() };
    const client = await publicMembershipClient();
    const { data, error } = await client.rpc("submit_public_membership", {
      p_dispatch_secret: process.env.MEMBERSHIP_EMAIL_DISPATCH_SECRET!,
      p_application: parsed.data, p_rate_key: publicMembershipRateKey(requestHeaders),
    });
    if (error || (data !== null && (typeof data !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data))))
      return {
        error: "Your application could not be saved. Your answers are still here. Please try again, or contact hello@theaipex.org if the problem continues.",
      };
    if (typeof data === "string") await schedulePublicMembershipEmails(data);
    revalidatePath("/membership");
    revalidatePath("/account");
    return { success: true };
  } catch {
    return {
      error: "We could not confirm your application was saved. Your answers are still here. Please try again; sending the same application again will not create a duplicate.",
    };
  }
}

export async function reviewMembership(
  _: MembershipActionState,
  form: FormData,
): Promise<MembershipActionState> {
  const userId = form.get("userId");
  const decision = form.get("decision");
  const expectedUpdatedAt = form.get("expectedUpdatedAt");
  const source = form.get("source") ?? "account";
  if (
    typeof userId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ||
    !["approved", "declined"].includes(String(decision)) ||
    typeof expectedUpdatedAt !== "string" ||
    expectedUpdatedAt.length > 64 ||
    !Number.isFinite(Date.parse(expectedUpdatedAt)) || !["account", "request"].includes(String(source))
  ) return { error: "Refresh the review page and try again." };
  try {
    const user = await currentUser(true);
    if (!user) return { error: "Sign in again before reviewing applications." };
    const client = await createClient();
    // Reviewer authority and stale-decision checks are enforced atomically in SQL.
    const { error } = await client.rpc(source === "request" ? "review_public_membership" : "review_membership", {
      [source === "request" ? "p_request_id" : "p_user_id"]: userId,
      p_decision: decision,
      p_expected_updated_at: expectedUpdatedAt,
    });
    if (error) {
      if (/already_reviewed|stale_application|application_changed/.test(error.message))
        return { error: "This application changed in another session. Refresh before reviewing it." };
      if (/not_reviewer|reviewer_required|not_authorized|permission denied/.test(error.message))
        return { error: "This account does not have permission to review applications." };
      return { error: "The decision could not be saved. Refresh to check the current status before trying again." };
    }
    // Reviewers may send any due email: this sends the decision email and
    // retries anything still waiting from an earlier attempt.
    await scheduleMembershipEmails();
    await schedulePublicMembershipEmails();
    revalidatePath("/admin/membership");
    revalidatePath("/account");
    revalidatePath("/membership");
    return { success: true };
  } catch {
    return { error: "We could not confirm the decision was saved. Refresh and check the current status before trying again." };
  }
}

/** Approval is attached only by a fresh verified identity and a deliberate POST. */
export async function activateMembership(): Promise<MembershipActionState> {
  let approved = false;
  try {
    const user = await currentUser(true);
    if (!user) return { error: "Verify your email and sign in before activating membership." };
    const client = await createClient();
    const { data, error } = await client.rpc("claim_approved_membership");
    if (error) return { error: "We couldn’t activate membership for this account. Please contact hello@theaipex.org using the email you applied with." };
    approved = data === true;
  } catch { return { error: "Membership could not be checked. Please try again shortly." }; }
  if (!approved) return { error: "No approved membership matches this verified email. Use the email address you applied with, or contact hello@theaipex.org." };
  revalidatePath("/account");
  revalidatePath("/membership");
  revalidatePath("/admin/membership");
  redirect("/community/slack");
}
