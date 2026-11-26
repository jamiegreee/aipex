/**
 * Deterministic, versioned content for transactional membership emails.
 * Call only with an immutable event claimed from the private database outbox.
 * Recipients and application details must never come from browser form fields.
 */
import { buildMembershipEmail as buildMembershipEmailV1 } from "./membership-email-content-v1";
import { buildMembershipEmail as buildMembershipEmailV2 } from "./membership-email-content-v2";
import { buildMembershipEmail as buildMembershipEmailV3 } from "./membership-email-content-v3";
import { buildMembershipEmail as buildMembershipEmailV4 } from "./membership-email-content-v4";
import { buildMembershipEmail as buildMembershipEmailV5 } from "./membership-email-content-v5";
import { emailButton, emailDocument, emailFooterLine } from "./email-theme-v2";

export const membershipEmailFrom = "AIPEX <hello@theaipex.org>";
export const membershipEmailReplyTo = "hello@theaipex.org";
export const membershipReviewRecipient = "green.jcb@gmail.com";

export type MembershipEmailKind =
  | "founder_alert"
  | "application_received"
  | "application_approved"
  | "application_declined";

export type MembershipEmailEvent = {
  id: string;
  kind: MembershipEmailKind;
  recipient_email: string;
  applicant_name: string;
  applicant_role: string;
  applicant_organisation: string;
  template_version?: number;
};

export type MembershipEmailPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
  tags: { name: string; value: string }[];
};

const reviewUrl = "https://theaipex.org/admin/membership";
const activationSignupUrl = "https://theaipex.org/signup?next=%2Fmembership%2Factivate";
const kinds = new Set<MembershipEmailKind>([
  "founder_alert", "application_received", "application_approved", "application_declined",
]);

function cleanLine(value: string, maximum: number): string {
  return Array.from(value.normalize("NFC")
    .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/gu, " ")
    .replace(/\s+/gu, " ").trim()).slice(0, maximum).join("");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function checkedRecipient(value: string): string {
  // Exactly one bare address. Reject header injection and display-name/list syntax.
  // International letters are retained; the sending provider validates delivery.
  if (value !== value.trim() || value.length > 254 ||
    /[\s\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069<>(),;:"\\]/u.test(value)) {
    throw new Error("invalid_membership_email_recipient");
  }
  const parts = value.split("@");
  if (parts.length !== 2 || !parts[0] || parts[0].length > 64 ||
    parts[0].startsWith(".") || parts[0].endsWith(".") || parts[0].includes("..") ||
    !/^[\p{L}\p{M}\p{N}.!#$%&'*+\-\/=?^_`{|}~]+$/u.test(parts[0]) ||
    !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/iu.test(parts[1])) {
    throw new Error("invalid_membership_email_recipient");
  }
  return value;
}

function paragraph(value: string): string {
  return `<p style="margin:0 0 20px;line-height:1.65">${escapeHtml(value)}</p>`;
}

function documentHtml(title: string, content: string, link: string | null, linkText: string): string {
  return emailDocument(title, `${content}\n${link ? emailButton(link, linkText) : ""}`, "AIPEX / Membership");
}

export function buildMembershipEmail(event: MembershipEmailEvent): MembershipEmailPayload {
  // Retried outbox events keep the exact body originally sent to the provider.
  // New copy is a new version; missing versions retain the historical default.
  if (event.template_version === undefined || event.template_version === 1) {
    return buildMembershipEmailV1(event);
  }
  if (event.template_version === 2) {
    return buildMembershipEmailV2(event);
  }
  if (event.template_version === 3) {
    return buildMembershipEmailV3(event);
  }
  if (event.template_version === 4) {
    return buildMembershipEmailV4(event);
  }
  if (event.template_version === 5) {
    return buildMembershipEmailV5(event);
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(event.id) ||
    !kinds.has(event.kind) || event.template_version !== 6) {
    throw new Error("unsupported_membership_email_event");
  }
  const recipient = checkedRecipient(event.recipient_email);
  if (event.kind === "founder_alert" && recipient.toLowerCase() !== membershipReviewRecipient) {
    throw new Error("invalid_membership_review_recipient");
  }
  const name = cleanLine(event.applicant_name, 100);
  const role = cleanLine(event.applicant_role, 120);
  const organisation = cleanLine(event.applicant_organisation, 160);
  const greeting = name ? `Hello ${name},` : "Hello,";
  let subject: string;
  let heading: string;
  let paragraphs: string[];
  let link: string | null = null;
  let linkText = "";

  switch (event.kind) {
    case "founder_alert":
      subject = "New AIPEX membership application";
      heading = "A new application is ready to review.";
      paragraphs = [
        "A new AIPEX membership application has been submitted.",
        `Name: ${name || "Applicant"}`,
        `Role: ${role || "Not supplied"}`,
        `Organisation: ${organisation || "Not supplied"}`,
        "Sign in to AIPEX to read the application and record your decision.",
      ];
      link = reviewUrl;
      linkText = "Review the application";
      break;
    case "application_received":
      subject = "We’ve received your AIPEX application";
      heading = "Thank you for applying.";
      paragraphs = [
        greeting,
        "We’ve received your application for AIPEX membership. We will review your application and get back to you soon.",
        "The AIPEX team",
      ];
      break;
    case "application_approved":
      subject = "Welcome to AIPEX";
      heading = "Welcome to AIPEX.";
      paragraphs = [
        greeting,
        "Your application for AIPEX membership has been approved. Welcome to the community.",
        "Create your AIPEX account using the same email address you used to apply, then verify your email to activate your membership and join the Slack community.",
        "If you already have an AIPEX account with this email address, sign in instead.",
        "The AIPEX team",
      ];
      link = activationSignupUrl;
      linkText = "Create your account";
      break;
    case "application_declined":
      subject = "Your AIPEX membership application";
      heading = "An update on your application.";
      paragraphs = [
        greeting,
        "Thank you for your interest in AIPEX. We’re unable to offer you membership at this stage.",
        "We appreciate the time you took to apply.",
        "The AIPEX team",
      ];
      break;
  }

  return {
    from: membershipEmailFrom,
    to: [event.kind === "founder_alert" ? membershipReviewRecipient : recipient],
    reply_to: membershipEmailReplyTo,
    subject,
    html: documentHtml(heading, paragraphs.map(paragraph).join("\n"), link, linkText),
    text: [heading, ...paragraphs, ...(link ? [`${linkText}: ${link}`] : []), "Questions? Reply to this email or contact hello@theaipex.org.", emailFooterLine].join("\n\n"),
    tags: [
      { name: "category", value: "membership" },
      { name: "event_id", value: event.id },
      { name: "kind", value: event.kind },
    ],
  };
}
