import "server-only";
import { createClient } from "./database";
import type { MembershipApplication } from "./membership";

export type MembershipCounts = {
  pending: number;
  approved: number;
  declined: number;
};
export type MembershipReviewApplication = Omit<MembershipApplication, "user_id"> & { id: string; source: "account" | "request" };

function reportReviewFailure(operation: string, result: { status: number; error: { code?: string } | null; data: unknown }) {
  // Never log a database message, row, email address or token. These fixed
  // operation names and response types identify a broken API/schema contract.
  console.error("Membership review data unavailable.", {
    operation,
    status: result.status,
    code: /^[A-Z0-9_]{1,16}$/.test(result.error?.code ?? "") ? result.error?.code : undefined,
    shape: result.data === null ? "null" : Array.isArray(result.data) ? "array" : typeof result.data,
  });
}

export async function membershipApplication(userId: string) {
  const client = await createClient();
  const { data, error } = await client
    .from("membership_applications")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error("Membership applications could not be loaded.");
  return data as MembershipApplication | null;
}

export async function membershipReviewer() {
  const client = await createClient();
  const { data, error } = await client.rpc("membership_is_reviewer");
  if (error) throw new Error("Membership review access could not be checked.");
  return data === true;
}

export async function membershipReviewQueue(status: string, page: number) {
  const client = await createClient();
  const [applications, legacy, requests] = await Promise.all([
    client
      .from("membership_review_queue")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(page * 25, page * 25 + 24),
    client.rpc("membership_counts"),
    client.rpc("public_membership_counts"),
  ]);
  let failed = false;
  if (applications.error || !Array.isArray(applications.data)) {
    reportReviewFailure("membership_review_queue", applications);
    failed = true;
  }
  for (const [operation, result] of [["membership_counts", legacy], ["public_membership_counts", requests]] as const) {
    if (result.error || !result.data || typeof result.data !== "object" || Array.isArray(result.data) ||
      !["pending", "approved", "declined"].every(key => Number.isSafeInteger(result.data[key]) && Number(result.data[key]) >= 0)) {
      reportReviewFailure(operation, result);
      failed = true;
    }
  }
  if (failed) throw new Error("Membership applications could not be loaded.");
  const countValues = Object.fromEntries(["pending", "approved", "declined"].map(key => [key, Number(legacy.data[key]) + Number(requests.data[key])]));
  return {
    applications: (applications.data ?? []) as MembershipReviewApplication[],
    counts: countValues as MembershipCounts,
  };
}
