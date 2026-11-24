import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
export type ContactFormResult = {
  values: ContactInput;
  data?: ContactInput;
  errors: ContactErrors;
  error?: string;
};

const limits = { name: 100, email: 254, message: 5_000 } as const;
const singleLineControls = /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u;
const multilineControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const allowedFields = new Set(["name", "email", "message", "website", "token"]);
const formError = "Your message could not be submitted. Refresh the page and try again.";

function bounded(value: string, maximum: number): string {
  return Array.from(value).slice(0, maximum).join("");
}

function validEmail(value: string): boolean {
  if (value.length > limits.email || !/^[\x21-\x7e]+$/.test(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length > 0 && local.length <= 64 &&
    !local.startsWith(".") && !local.endsWith(".") && !local.includes("..") &&
    /^[A-Za-z0-9.!#$%&'*+\-/=?^_`{|}~]+$/.test(local) &&
    domain.length <= 253 && domain.includes(".") && domain.split(".").every(label =>
      label.length >= 1 && label.length <= 63 && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label));
}

/** Validate both browser submissions and values passed to the email builder. */
export function parseContactForm(form: FormData): ContactFormResult {
  const values: ContactInput = { name: "", email: "", message: "" };
  const errors: ContactErrors = {};
  let error: string | undefined;
  for (const [field] of form) {
    if (!allowedFields.has(field) && !field.startsWith("$ACTION_")) error = formError;
  }
  for (const field of ["name", "email", "message"] as const) {
    const entries = form.getAll(field);
    if (entries.length !== 1 || typeof entries[0] !== "string") {
      errors[field] = `Enter one ${field === "email" ? "email address" : field}.`;
      continue;
    }
    const raw = entries[0];
    // Check single-line controls before trimming so CRLF header injection is
    // rejected even when the injected characters occur at either end.
    const normalized = raw.replace(/\r\n?/g, "\n").normalize("NFC").trim();
    const controls = field === "message" ? multilineControls : singleLineControls;
    values[field] = bounded(normalized.replace(
      field === "message"
        ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/gu
        : /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/gu,
      "",
    ), limits[field]);
    if (controls.test(field === "message" ? normalized : raw)) {
      errors[field] = `Remove unsupported control characters from your ${field}.`;
      continue;
    }
    const length = Array.from(normalized).length;
    if (length > limits[field]) {
      errors[field] = `Keep your ${field} to ${limits[field].toLocaleString("en-GB")} characters or fewer.`;
    } else if (field === "email" && !validEmail(normalized)) {
      errors.email = "Enter a valid email address.";
    } else if (length < (field === "message" ? 10 : 1)) {
      errors[field] = field === "message"
        ? "Write a message of at least 10 characters."
        : `Enter your ${field}.`;
    }
  }
  const honeypot = form.getAll("website");
  if (honeypot.length > 1 || honeypot.some(value => typeof value !== "string" || value.trim() !== "")) {
    error = formError;
  }
  const tokens = form.getAll("token");
  if (tokens.length > 1 || tokens.some(value => typeof value !== "string" || value.length > 200)) error = formError;
  return error || Object.keys(errors).length ? { values, errors, ...(error ? { error } : {}) } : { values, data: values, errors };
}

function tokenSignature(secret: string, timestamp: string, nonce: string): string {
  return createHmac("sha256", secret).update(`aipex-contact-token/v1\0${timestamp}\0${nonce}`).digest("hex");
}

export function createContactToken(secret: string, now = Date.now()): string {
  if (secret.length < 32 || !Number.isSafeInteger(now) || now < 0) throw new Error("contact_token_not_configured");
  const nonce = randomUUID();
  const timestamp = String(now);
  return `v1.${timestamp}.${nonce}.${tokenSignature(secret, timestamp, nonce)}`;
}

export function verifyContactToken(
  token: string,
  secret: string,
  now = Date.now(),
): { nonce: string } | { error: "invalid" | "early" | "expired" } {
  if (secret.length < 32 || typeof token !== "string" || token.length > 200 || !Number.isSafeInteger(now) || now < 0) {
    return { error: "invalid" };
  }
  const match = /^v1\.(0|[1-9]\d{0,15})\.([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.([0-9a-f]{64})$/.exec(token);
  if (!match) return { error: "invalid" };
  const [, timestamp, nonce, signature] = match;
  const issuedAt = Number(timestamp);
  if (!Number.isSafeInteger(issuedAt) || issuedAt > now) return { error: "invalid" };
  const expected = tokenSignature(secret, timestamp, nonce);
  if (!timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) return { error: "invalid" };
  if (now - issuedAt > 60 * 60_000) return { error: "expired" };
  if (now - issuedAt < 2_000) return { error: "early" };
  return { nonce };
}

export function contactIdempotencyKey(nonce: string, input: ContactInput): string {
  if (!uuid.test(nonce)) throw new Error("invalid_contact_nonce");
  const digest = createHash("sha256").update(JSON.stringify([nonce, input.name, input.email, input.message])).digest("hex");
  return `aipex-contact/v1/${digest}`;
}

export function createContactEmail(input: ContactInput) {
  const form = new FormData();
  form.set("name", input.name);
  form.set("email", input.email);
  form.set("message", input.message);
  const result = parseContactForm(form);
  if (!result.data) throw new Error("invalid_contact_input");
  const { name, email, message } = result.data;
  return {
    from: "AIPEX <hello@theaipex.org>",
    to: ["hello@theaipex.org"],
    reply_to: email,
    subject: "AIPEX contact enquiry",
    text: `A new message was sent through the AIPEX contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };
}

/** Sending is awaited: a timeout never becomes an unverified success message. */
export async function sendContactEmail(
  apiKey: string,
  key: string,
  input: ContactInput,
  send: typeof fetch = fetch,
): Promise<boolean> {
  if (!/^aipex-contact\/v1\/[0-9a-f]{64}$/.test(key) || !apiKey) return false;
  try {
    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      body: JSON.stringify(createContactEmail(input)),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const body: unknown = await response.json();
    return Boolean(body && typeof body === "object" && "id" in body && typeof body.id === "string" && uuid.test(body.id));
  } catch {
    return false;
  }
}

/** Modest in-memory abuse protection; limits are per server instance, not global. */
export class ContactRateLimiter {
  private identities = new Map<string, number[]>();
  private global: number[] = [];
  private latestTime = 0;

  consume(hashedIdentity: string, now = Date.now()): boolean {
    // Reject raw identifiers rather than accidentally retaining an IP address.
    if (!/^[0-9a-f]{64}$/i.test(hashedIdentity) || !Number.isSafeInteger(now) || now < this.latestTime) return false;
    this.latestTime = now;
    for (const [identity, requests] of this.identities) {
      const recent = requests.filter(time => time > now - 10 * 60_000);
      if (recent.length) this.identities.set(identity, recent);
      else this.identities.delete(identity);
    }
    this.global = this.global.filter(time => time > now - 60 * 60_000);
    const requests = this.identities.get(hashedIdentity) ?? [];
    if (requests.length >= 3 || this.global.length >= 20 || (!this.identities.has(hashedIdentity) && this.identities.size >= 1_000)) return false;
    this.identities.set(hashedIdentity, [...requests, now]);
    this.global.push(now);
    return true;
  }
}

export function contactRequestAllowed(headers: Headers): boolean {
  try {
    const value = headers.get("origin") ?? "";
    const origin = new URL(value);
    const host = headers.get("host");
    if (!["http:", "https:"].includes(origin.protocol) || value !== origin.origin || !host || origin.host.toLowerCase() !== host.toLowerCase()) return false;
    if (headers.get("sec-fetch-site")?.toLowerCase() === "cross-site") return false;
    const length = headers.get("content-length");
    if (length !== null && (!/^\d+$/.test(length) || !Number.isSafeInteger(Number(length)) || Number(length) > 64_000)) return false;
    return true;
  } catch {
    return false;
  }
}
