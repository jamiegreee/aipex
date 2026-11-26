/** Version-three auth email content (dark site theme). Keep retry payloads deterministic: no clock,
 * event identifiers, tracking parameters or provider branding in visible copy. */
import { emailButton, emailDocument, emailTheme } from "./email-theme-v2";
export type AuthEmailMessage = {
  eventId: string;
  email: string;
  name: string;
  kind: "email-verification" | "forget-password" | "sign-in";
  link: string;
};

export type AuthEmailPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
};

const copy = {
  "email-verification": {
    subject: "Verify your email — AIPEX",
    heading: "Verify your email.",
    introduction: "Verify your email address to finish setting up your AIPEX account.",
    button: "Verify email",
  },
  "forget-password": {
    subject: "Reset your password — AIPEX",
    heading: "Reset your password.",
    introduction: "Use the link below to choose a new password for your AIPEX account.",
    button: "Reset password",
  },
  "sign-in": {
    subject: "Your sign-in link — AIPEX",
    heading: "Sign in to AIPEX.",
    introduction: "Use this link to sign in to your AIPEX account.",
    button: "Sign in",
  },
} as const;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function recipient(value: string): string {
  if (typeof value !== "string" || value !== value.trim() || value.length > 254 ||
    /[\s\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069<>(),;:"\\]/u.test(value)) {
    throw new Error("invalid_auth_email_recipient");
  }
  const parts = value.split("@");
  if (parts.length !== 2 || !parts[0] || parts[0].length > 64 ||
    parts[0].startsWith(".") || parts[0].endsWith(".") || parts[0].includes("..") ||
    !/^[\p{L}\p{M}\p{N}.!#$%&'*+\-\/=?^_`{|}~]+$/u.test(parts[0]) ||
    !parts[1].includes(".") || !parts[1].split(".").every(label =>
      label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/iu.test(label))) {
    throw new Error("invalid_auth_email_recipient");
  }
  return value;
}

function safeLink(value: string): string {
  if (typeof value !== "string" || value.length < 1 || value.length > 8_192 ||
    /[\s\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(value)) {
    throw new Error("invalid_auth_email_link");
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("unsafe");
  } catch {
    throw new Error("invalid_auth_email_link");
  }
  // The authenticated webhook handler separately pins the permitted host and
  // purpose. Do not rewrite the provider's token or callback query here.
  return value;
}

function displayName(value: string): string {
  if (typeof value !== "string") throw new Error("invalid_auth_email_name");
  return Array.from(value.normalize("NFC")
    .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/gu, " ")
    .replace(/\s+/gu, " ").trim()).slice(0, 100).join("");
}

export function buildAuthEmail(message: AuthEmailMessage): AuthEmailPayload {
  if (!message || !/^[A-Za-z0-9._:-]{1,200}$/.test(message.eventId) ||
    !Object.hasOwn(copy, message.kind)) {
    throw new Error("unsupported_auth_email_event");
  }
  const to = recipient(message.email);
  const link = safeLink(message.link);
  const name = displayName(message.name);
  const greeting = name ? `Hello ${name},` : "Hello,";
  const content = copy[message.kind];
  const ignore = "If you didn’t request this email, you can ignore it.";
  const fallback = "If the button doesn’t work, copy and paste this link into your browser:";
  const contact = "Questions? Reply to this email or contact hello@theaipex.org.";
  const html = emailDocument(content.heading, `
<p style="margin:0 0 20px;line-height:1.65">${escapeHtml(greeting)}</p>
<p style="margin:0 0 20px;line-height:1.65">${escapeHtml(content.introduction)}</p>
${emailButton(link, content.button)}
<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${emailTheme.muted}">${escapeHtml(fallback)}</p>
<p style="margin:0 0 20px;font-size:13px;line-height:1.6;overflow-wrap:anywhere;word-break:break-all"><a href="${escapeHtml(link)}" style="color:${emailTheme.link}">${escapeHtml(link)}</a></p>
<p style="margin:0 0 20px;line-height:1.65">${escapeHtml(ignore)}</p>`, "AIPEX / Account");

  return {
    from: "AIPEX <hello@theaipex.org>",
    to: [to],
    reply_to: "hello@theaipex.org",
    subject: content.subject,
    html,
    text: ["AI Policy Exchange.", content.heading, greeting, content.introduction,
      `${content.button}: ${link}`, ignore, contact].join("\n\n"),
  };
}
