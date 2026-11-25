/** Only an explicit database boolean is an access decision. A malformed or
 * missing RPC response must not masquerade as an ordinary nonmember account. */
export function requireMembershipReviewer(data: unknown): boolean {
  if (typeof data !== "boolean") {
    throw new Error("Membership review access could not be checked.");
  }
  return data;
}
