/** The invitation stays on the server; emails contain only this stable gateway. */
export const membershipSlackPath = "/community/slack";

type SlackGatewayDependencies = {
  currentUser: (requireFresh: true) => Promise<{ id: string; emailVerified?: boolean } | null>;
  hasApprovedMembership: (userId: string) => Promise<boolean>;
  invitationUrl: () => string | undefined;
};

const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
  Vary: "Cookie",
};

function redirect(location: string): Response {
  return new Response(null, { status: 307, headers: { ...privateHeaders, Location: location } });
}

function invitationForAIPEX(value: string | undefined): string | null {
  // Accept only the exact workspace invitation format created in Slack. Reject
  // other workspaces, credentials, query strings and URL normalization tricks.
  return value && value === value.trim() && /^https:\/\/join\.slack\.com\/t\/theaipolicyexchange\/shared_invite\/zt-[A-Za-z0-9_-]+$/.test(value)
    ? value
    : null;
}

/** Keep all authorization branches in the handler used by the actual route. */
export async function membershipSlackResponse(dependencies: SlackGatewayDependencies): Promise<Response> {
  try {
    const user = await dependencies.currentUser(true);
    if (!user || user.emailVerified !== true) {
      return redirect(`/login?next=${encodeURIComponent(membershipSlackPath)}`);
    }
    if (!(await dependencies.hasApprovedMembership(user.id))) return redirect("/membership");

    const invitation = invitationForAIPEX(dependencies.invitationUrl());
    if (invitation) return redirect(invitation);
  } catch {
    // Session, database and configuration failures never expose the invitation.
  }

  return new Response(
    "The Slack invitation is temporarily unavailable. Please try again shortly or contact hello@theaipex.org.",
    {
      status: 503,
      headers: { ...privateHeaders, "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
