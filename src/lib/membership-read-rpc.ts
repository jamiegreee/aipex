import type { NeonPostgrestClient } from "@neondatabase/postgrest-js";

export type MembershipReadOperation =
  | "membership_is_reviewer"
  | "membership_counts"
  | "public_membership_counts";

const operations = new Set<string>([
  "membership_is_reviewer", "membership_counts", "public_membership_counts",
]);
const countKeys = ["pending", "approved", "declined"] as const;

function validResult(operation: MembershipReadOperation, data: unknown): boolean {
  if (operation === "membership_is_reviewer") return typeof data === "boolean";
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const counts = data as Record<string, unknown>;
  // Earlier membership_counts versions also returned a member limit. Only
  // these three required counts are consumed; extra metadata is ignored.
  return countKeys.every(key =>
    Object.hasOwn(counts, key) && typeof counts[key] === "number" &&
    Number.isSafeInteger(counts[key]) && counts[key] >= 0,
  );
}

function shape(value: unknown): string {
  return value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
}

/** A transport fallback for these read-only functions, never an authorization
 * fallback. The caller's client must freeze its JWT and disable fetch caching. */
export async function readMembershipRpc(client: NeonPostgrestClient, operation: MembershipReadOperation) {
  if (!operations.has(operation)) throw new Error("Unsupported membership read operation.");
  const post = await client.rpc(operation);
  // Valid false is a real denial. Explicit errors must never be retried here.
  if (post.error !== null || validResult(operation, post.data)) return post;

  const get = await client.rpc(operation, {}, { get: true });
  const getValid = get.error === null && validResult(operation, get.data);
  console.warn("Membership read RPC used GET compatibility fallback.", {
    operation,
    postStatus: post.status,
    getStatus: get.status,
    postShape: shape(post.data),
    getShape: shape(get.data),
    getValid,
  });
  if (!getValid) throw new Error("Membership review data could not be checked.");
  return get;
}
