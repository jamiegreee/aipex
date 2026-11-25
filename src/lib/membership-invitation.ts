/** Public application links never contain a member's identity or Slack access. */
export const membershipInvitationUrl = "https://theaipex.org/membership";
export const membershipInvitationTitle = "Invitation to AIPEX";
export const membershipInvitationText =
  "Apply to join AIPEX, a community for people working on AI policy across the public and private sectors. Every application is reviewed.";

export const membershipInvitationShare = {
  title: membershipInvitationTitle,
  text: membershipInvitationText,
  url: membershipInvitationUrl,
} as const;

const invitationBody = `${membershipInvitationText}\n\n${membershipInvitationUrl}`;

export const membershipInvitationLinks = {
  email: `mailto:?subject=${encodeURIComponent(membershipInvitationTitle)}&body=${encodeURIComponent(invitationBody)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(invitationBody)}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(membershipInvitationUrl)}`,
} as const;

type MembershipInvitationAccess = {
  application: { status: string; archived_at?: string | null } | null;
  reviewer: boolean;
  membershipUnavailable: boolean;
};

/** Reviewers already count as members. Status failures never enable sharing. */
export function canShareMembershipInvitation({
  application,
  reviewer,
  membershipUnavailable,
}: MembershipInvitationAccess): boolean {
  if (membershipUnavailable !== false) return false;
  if (reviewer === true) return true;
  return application?.status === "approved" && application.archived_at == null;
}
