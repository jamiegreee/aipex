"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { createClient } from "@/lib/database";
import { parseMembershipForm } from "@/lib/membership";

export type MembershipActionState = {
  errors?: Record<string, string>;
  error?: string;
  success?: boolean;
};

export async function submitMembership(
  _: MembershipActionState,
  form: FormData,
): Promise<MembershipActionState> {
  const parsed = parseMembershipForm(form);
  if (!parsed.data) return { errors: parsed.errors };
  try {
    const user = await currentUser(true);
    if (!user)
      return {
        error: "Sign in with a verified email before applying. Your answers are still here; copy them before leaving this page.",
      };
    const client = await createClient();
    // The database also verifies identity and derives email/status itself.
    const { error } = await client.rpc("submit_membership", {
      p_application: parsed.data,
    });
    if (error)
      return {
        error: "Your application could not be saved. Your answers are still here. Please try again, or contact hello@theaipex.org if the problem continues.",
      };
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
  if (
    typeof userId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ||
    !["approved", "declined"].includes(String(decision)) ||
    typeof expectedUpdatedAt !== "string" ||
    expectedUpdatedAt.length > 64 ||
    !Number.isFinite(Date.parse(expectedUpdatedAt))
  ) return { error: "Refresh the review page and try again." };
  try {
    const user = await currentUser(true);
    if (!user) return { error: "Sign in again before reviewing applications." };
    const client = await createClient();
    // Reviewer authority and the cohort limit are enforced atomically in SQL.
    const { error } = await client.rpc("review_membership", {
      p_user_id: userId,
      p_decision: decision,
      p_expected_updated_at: expectedUpdatedAt,
    });
    if (error) {
      if (error.message.includes("cohort_full"))
        return { error: "The founding group has reached 50 approved members. Leave this application pending while you decide on the next group." };
      if (/already_reviewed|stale_application|application_changed/.test(error.message))
        return { error: "This application changed in another session. Refresh before reviewing it." };
      if (/not_reviewer|reviewer_required|not_authorized|permission denied/.test(error.message))
        return { error: "This account does not have permission to review applications." };
      return { error: "The decision could not be saved. Refresh to check the current status before trying again." };
    }
    revalidatePath("/admin/membership");
    revalidatePath("/account");
    revalidatePath("/membership");
    return { success: true };
  } catch {
    return { error: "We could not confirm the decision was saved. Refresh and check the current status before trying again." };
  }
}
