import "server-only";
import { createClient } from "./database";
import type { MembershipApplication } from "./membership";

export type MembershipCounts = {
  pending: number;
  approved: number;
  declined: number;
  limit: number;
};

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
  const [applications, counts] = await Promise.all([
    client
      .from("membership_applications")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: true })
      .order("user_id", { ascending: true })
      .range(page * 25, page * 25 + 24),
    client.rpc("membership_counts"),
  ]);
  const countValues = counts.data as Record<string, unknown> | null;
  if (
    applications.error || counts.error || !Array.isArray(applications.data) ||
    !countValues || typeof countValues !== "object" || Array.isArray(countValues) ||
    !["pending", "approved", "declined", "limit"].every(key =>
      Number.isInteger(countValues[key]) && Number(countValues[key]) >= (key === "limit" ? 1 : 0),
    )
  )
    throw new Error("Membership applications could not be loaded.");
  return {
    applications: (applications.data ?? []) as MembershipApplication[],
    counts: countValues as MembershipCounts,
  };
}
