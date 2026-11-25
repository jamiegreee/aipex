import "server-only";
import { createClient } from "./database";
import type { MembershipApplication } from "./membership";

export type MembershipCounts = {
  pending: number;
  approved: number;
  declined: number;
};
export type MembershipReviewApplication = Omit<MembershipApplication, "user_id"> & { id: string; source: "account" | "request" };

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
      .from("membership_review_queue")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(page * 25, page * 25 + 24),
    Promise.all([client.rpc("membership_counts"), client.rpc("public_membership_counts")]).then(([legacy, requests]) => {
      if (legacy.error || requests.error) return { error: true, data: null };
      if (!legacy.data || !requests.data || typeof legacy.data !== "object" || typeof requests.data !== "object") return { error: true, data: null };
      const data = Object.fromEntries(["pending", "approved", "declined"].map(key => [key, Number(legacy.data[key]) + Number(requests.data[key])]));
      return { error: null, data };
    }),
  ]);
  const countValues = counts.data as Record<string, unknown> | null;
  if (
    applications.error || counts.error || !Array.isArray(applications.data) ||
    !countValues || typeof countValues !== "object" || Array.isArray(countValues) ||
    !["pending", "approved", "declined"].every(key =>
      Number.isInteger(countValues[key]) && Number(countValues[key]) >= 0,
    )
  )
    throw new Error("Membership applications could not be loaded.");
  return {
    applications: (applications.data ?? []) as MembershipReviewApplication[],
    counts: countValues as MembershipCounts,
  };
}
