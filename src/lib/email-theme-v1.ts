/** Version-one invitation palette, shared by membership v5 and account v2.
 * Keep this module immutable for safe retries; a new design gets a new version. */
export const emailTheme = {
  background: "#f6f7f1",
  surface: "#ffffff",
  ink: "#18221d",
  muted: "#53614f",
  accent: "#e8edb6",
  link: "#36583d",
  logo: "https://theaipex.org/brand/aipex-mark-email-green-v1.png",
} as const;

export function emailDocument(title: string, content: string) {
  const escapedTitle = emailEscape(title);
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapedTitle}</title></head>
<body style="margin:0;padding:32px 16px;background:${emailTheme.background};color:${emailTheme.ink};font-family:Arial,Helvetica,sans-serif;font-size:16px">
<table role="presentation" style="width:100%;border-collapse:collapse"><tr><td align="center">
<table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background:${emailTheme.surface}"><tr><td style="padding:36px 28px;border-top:3px solid ${emailTheme.accent}">
<table role="presentation" style="margin:0 0 28px;border-collapse:collapse"><tr>
<td style="padding:0 12px 0 0;vertical-align:middle"><img src="${emailTheme.logo}" width="40" height="40" alt="" style="display:block;border:0;width:40px;height:40px"></td>
<td style="padding:0;vertical-align:middle;font-size:16px;font-weight:bold;line-height:1.1;color:${emailTheme.ink}">AI Policy<br>Exchange.</td>
</tr></table>
<h1 style="margin:0 0 24px;font-size:28px;line-height:1.25;font-weight:normal">${escapedTitle}</h1>
${content}
<p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:${emailTheme.muted}">Questions? Reply to this email or contact <a href="mailto:hello@theaipex.org" style="color:${emailTheme.link}">hello@theaipex.org</a>.</p>
</td></tr></table>
<p style="max-width:600px;margin:20px 0 0;font-size:12px;line-height:1.6;color:${emailTheme.muted}">AI Policy Exchange · Helping governments prepare for advanced AI.</p>
</td></tr></table>
</body></html>`;
}

export function emailEscape(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

export function emailButton(link: string, text: string) {
  return `<p style="margin:28px 0"><a href="${emailEscape(link)}" style="display:inline-block;padding:13px 18px;background:${emailTheme.accent};color:${emailTheme.ink};text-decoration:none;font-weight:bold;line-height:1.4">${emailEscape(text)}</a></p>`;
}
