/** Version-two email palette: the website's default dark theme (src/app/theme.css).
 * Email clients can't read CSS variables, so the values are copied here.
 * Keep this module immutable for safe retries; a new design gets a new version. */
export const emailTheme = {
  background: "#10140f", // --color-bg
  surface: "#181d17", // --color-surface
  border: "#2a3128", // --color-border
  ink: "#eceae2", // --color-ink
  muted: "#8d9488", // --color-muted
  accent: "#e5edb5", // --color-accent / --color-accent-fill (lime)
  onAccent: "#10140f", // --color-on-accent
  link: "#e5edb5",
  logo: "https://theaipex.org/brand/aipex-mark-email-green-v1.png",
} as const;

export const emailFooterLine =
  "AI Policy Exchange · The private community for people working on AI policy across government and industry.";

const serif = "Georgia,'Times New Roman',serif";
const sans = "Arial,Helvetica,sans-serif";
const mono = "'IBM Plex Mono',Menlo,Consolas,monospace";

export function emailDocument(title: string, content: string, label = "AIPEX") {
  const escapedTitle = emailEscape(title);
  const t = emailTheme;
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${escapedTitle}</title></head>
<body bgcolor="${t.background}" style="margin:0;padding:32px 16px;background:${t.background};color:${t.ink};font-family:${sans};font-size:16px">
<table role="presentation" bgcolor="${t.background}" style="width:100%;border-collapse:collapse;background:${t.background}"><tr><td align="center">
<table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse"><tr><td style="padding:0 0 24px">
<table role="presentation" style="border-collapse:collapse"><tr>
<td style="padding:0 12px 0 0;vertical-align:middle"><img src="${t.logo}" width="40" height="40" alt="" style="display:block;border:0;width:40px;height:40px"></td>
<td style="padding:0;vertical-align:middle;font-size:16px;font-weight:bold;line-height:1.1;color:${t.ink}">AI Policy<br>Exchange.</td>
</tr></table>
</td></tr>
<tr><td bgcolor="${t.surface}" style="padding:36px 32px;background:${t.surface};border:1px solid ${t.border};border-top:3px solid ${t.accent};color:${t.ink}">
<p style="margin:0 0 18px;font-family:${mono};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${t.muted}">${emailEscape(label)}</p>
<h1 style="margin:0 0 24px;font-family:${serif};font-size:32px;line-height:1.15;font-weight:normal;color:${t.ink}">${escapedTitle}</h1>
${content}
<p style="margin:28px 0 0;padding:20px 0 0;border-top:1px solid ${t.border};font-size:14px;line-height:1.6;color:${t.muted}">Questions? Reply to this email or contact <a href="mailto:hello@theaipex.org" style="color:${t.link}">hello@theaipex.org</a>.</p>
</td></tr>
<tr><td style="padding:20px 0 0;font-size:12px;line-height:1.6;color:${t.muted}">${emailEscape(emailFooterLine)}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export function emailEscape(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

export function emailButton(link: string, text: string) {
  const t = emailTheme;
  return `<table role="presentation" style="margin:28px 0;border-collapse:collapse"><tr><td bgcolor="${t.accent}" style="background:${t.accent}"><a href="${emailEscape(link)}" style="display:inline-block;padding:14px 20px;background:${t.accent};color:${t.onAccent};text-decoration:none;font-weight:bold;line-height:1.4">${emailEscape(text)}</a></td></tr></table>`;
}
