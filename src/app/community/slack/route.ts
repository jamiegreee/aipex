import { currentUser } from "@/lib/auth";
import { createClient } from "@/lib/database";
import { membershipSlackResponse } from "@/lib/membership-slack";

export const dynamic = "force-dynamic";

export async function GET() {
  return membershipSlackResponse({
    currentUser,
    hasApprovedMembership: async (userId) => {
      const client = await createClient();
      const { data, error } = await client
        .from("membership_applications")
        .select("user_id")
        .eq("user_id", userId)
        .eq("status", "approved")
        .is("archived_at", null)
        .maybeSingle();
      if (error) throw new Error("membership_unavailable");
      return data?.user_id === userId;
    },
    invitationUrl: () => process.env.AIPEX_SLACK_INVITE_URL,
  });
}
