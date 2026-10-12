// Management API configuration for the dedicated AIPEX project.
// Never logs tokens, SMTP passwords or response configuration.
const project = process.env.SUPABASE_PROJECT_REF;
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!project || !/^[a-z0-9]{20}$/.test(project))
  throw new Error(
    "Set SUPABASE_PROJECT_REF to the dedicated AIPEX project reference.",
  );
const site = process.env.NEXT_PUBLIC_SITE_URL || "https://theaipex.org";
if (new URL(site).protocol !== "https:")
  throw new Error("Production auth requires an HTTPS site URL.");
const template = (heading, description, path, button) =>
  `<!doctype html><html lang="en"><body style="margin:0;background:#f5f3ec;color:#20251f;font-family:Arial,sans-serif"><div style="max-width:560px;margin:40px auto;padding:32px"><p style="font-size:12px;letter-spacing:2px;color:#254bdd">AI POLICY EXCHANGE</p><h1 style="font-family:Georgia,serif;font-weight:400;font-size:36px">${heading}</h1><p style="line-height:1.7">${description}</p><p style="margin:32px 0"><a href="{{ .SiteURL }}${path}" style="display:inline-block;background:#254bdd;color:white;text-decoration:none;padding:16px 24px">${button}</a></p><p style="font-size:12px;line-height:1.7">If you didn't request this, you can ignore this email. Your account password has not been changed.</p><hr style="border:0;border-top:1px solid #d9dcd0"><p style="font-size:12px">AIPEX · Building AI policy capacity</p></div></body></html>`;
const config = {
  site_url: site,
  uri_allow_list: `${site}/auth/callback`,
  disable_signup: false,
  external_email_enabled: true,
  mailer_autoconfirm: false,
  mailer_allow_unverified_email_sign_ins: false,
  mailer_secure_email_change_enabled: true,
  password_min_length: 10,
  refresh_token_rotation_enabled: true,
  mailer_subjects_confirmation: "Confirm your AIPEX learning account",
  mailer_subjects_recovery: "Reset your AIPEX password",
  mailer_templates_confirmation_content: template(
    "Your policy practice starts here.",
    "Confirm your email to save course progress and written work in your AIPEX account.",
    "/auth/confirm?token_hash={{ .TokenHash }}&amp;type=email",
    "Confirm email & start learning",
  ),
  mailer_templates_recovery_content: template(
    "A fresh start.",
    "We received a request to reset your AIPEX password. Use this link to choose a new one.",
    "/auth/confirm?token_hash={{ .TokenHash }}&amp;type=recovery&amp;next=/reset-password",
    "Reset password",
  ),
};
const smtpNames = [
  "AIPEX_SMTP_HOST",
  "AIPEX_SMTP_PORT",
  "AIPEX_SMTP_USER",
  "AIPEX_SMTP_PASSWORD",
  "AIPEX_SMTP_FROM",
];
const smtpPresent = smtpNames.filter((name) => Boolean(process.env[name]));
if (smtpPresent.length && smtpPresent.length !== smtpNames.length)
  throw new Error(
    "Provide all five AIPEX_SMTP_* settings, or leave them all unset to preserve existing SMTP configuration.",
  );
if (smtpPresent.length)
  Object.assign(config, {
    smtp_host: process.env.AIPEX_SMTP_HOST,
    smtp_port: process.env.AIPEX_SMTP_PORT,
    smtp_user: process.env.AIPEX_SMTP_USER,
    smtp_pass: process.env.AIPEX_SMTP_PASSWORD,
    smtp_admin_email: process.env.AIPEX_SMTP_FROM,
    smtp_sender_name: "AIPEX",
  });
if (!process.argv.includes("--apply")) {
  console.log(
    `Ready to configure ${project}: confirmed-email accounts, ten-character passwords, AIPEX confirmation/recovery templates and ${smtpPresent.length ? "provided" : "existing"} SMTP. No changes made. Use --apply to configure the chosen project.`,
  );
} else {
  if (!token)
    throw new Error("Set SUPABASE_ACCESS_TOKEN in the process environment.");
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${project}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    },
  );
  if (!response.ok)
    throw new Error(
      `Auth configuration was not applied (HTTP ${response.status}). Inspect the project settings; no credential-bearing response is printed.`,
    );
  console.log(
    "AIPEX auth configuration applied. Verify public email delivery before promoting the app.",
  );
}
