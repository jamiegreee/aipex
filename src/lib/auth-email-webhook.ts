import { createHash, createPublicKey, verify, type KeyObject } from "node:crypto";
import { buildAuthEmail, type AuthEmailMessage } from "./auth-email-content";

export class AuthEmailError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}
const invalid = () => new AuthEmailError(401, "Invalid email event.");
const unavailable = () => new AuthEmailError(503, "Email delivery is temporarily unavailable.");
const object = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));

/** Bound raw bytes before JSON parsing, including requests without Content-Length. */
export async function boundedText(body: ReadableStream<Uint8Array> | null, limit = 65_536) {
  if (!body) throw new AuthEmailError(400, "Missing email event.");
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > limit) { await reader.cancel(); throw new AuthEmailError(413, "Email event is too large."); }
      chunks.push(chunk.value);
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
  } catch (error) {
    if (error instanceof AuthEmailError) throw error;
    throw new AuthEmailError(400, "Invalid email event.");
  } finally { reader.releaseLock(); }
}

/** Only this configured Auth origin can provide verification keys. No key URL
 * or certificate URL from an incoming request is ever fetched. */
export class AuthEmailVerifier {
  readonly base: URL;
  private keys = new Map<string, KeyObject>();
  private expires = 0;
  private refreshedAt = -Infinity;
  private refreshing: Promise<void> | null = null;
  constructor(baseUrl: string, private readonly fetcher: typeof fetch = fetch, private readonly now = Date.now) {
    this.base = new URL(baseUrl);
    if (this.base.protocol !== "https:" || !this.base.hostname.endsWith(".neon.tech") || this.base.username || this.base.password || this.base.port || this.base.search || this.base.hash || !/^\/[^/]+\/auth\/?$/.test(this.base.pathname)) throw unavailable();
    this.base.pathname = this.base.pathname.replace(/\/$/, "");
  }
  private async refresh() {
    if (this.refreshing) return this.refreshing;
    if (this.now() - this.refreshedAt < 10_000) return;
    this.refreshing = (async () => {
      try {
        const response = await this.fetcher(`${this.base.href}/.well-known/jwks.json`, {
          cache: "no-store", redirect: "error", signal: AbortSignal.timeout(2_500), headers: { Accept: "application/json" },
        });
        if (!response.ok) throw unavailable();
        const body: unknown = JSON.parse(await boundedText(response.body, 32_768));
        if (!object(body) || !Array.isArray(body.keys) || body.keys.length > 20) throw unavailable();
        const keys = new Map<string, KeyObject>();
        for (const key of body.keys) {
          if (!object(key) || typeof key.kid !== "string" || key.kid.length > 200 || key.kty !== "OKP" || key.crv !== "Ed25519" ||
            (key.alg !== undefined && key.alg !== "EdDSA") || typeof key.x !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(key.x) || "d" in key) continue;
          if (keys.has(key.kid)) throw unavailable();
          keys.set(key.kid, createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: key.x }, format: "jwk" }));
        }
        if (!keys.size) throw unavailable();
        this.keys = keys;
        this.refreshedAt = this.now();
        this.expires = this.now() + 5 * 60_000;
      } catch { throw unavailable(); }
    })();
    try { await this.refreshing; } finally { this.refreshing = null; }
  }
  async verify(raw: string, headers: Headers): Promise<unknown> {
    if (Buffer.byteLength(raw, "utf8") > 65_536) throw new AuthEmailError(413, "Email event is too large.");
    const timestamp = headers.get("x-neon-timestamp") ?? "";
    const kid = headers.get("x-neon-signature-kid") ?? "";
    const signature = headers.get("x-neon-signature") ?? "";
    if (!/^\d{13}$/.test(timestamp) || Math.abs(this.now() - Number(timestamp)) > 5 * 60_000 ||
      !/^[A-Za-z0-9._:-]{1,200}$/.test(kid) || signature.length > 2_000) throw invalid();
    const parts = signature.split(".");
    if (parts.length !== 3 || parts[1] !== "" || !/^[A-Za-z0-9_-]{1,1024}$/.test(parts[0]) || !/^[A-Za-z0-9_-]{86}$/.test(parts[2])) throw invalid();
    let protectedHeader: unknown;
    try { protectedHeader = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")); }
    catch { throw invalid(); }
    if (!object(protectedHeader) || protectedHeader.alg !== "EdDSA" || (protectedHeader.kid !== undefined && protectedHeader.kid !== kid) ||
      "crit" in protectedHeader || "b64" in protectedHeader || "jku" in protectedHeader || "jwk" in protectedHeader || "x5u" in protectedHeader) throw invalid();
    const throttledUnknown = !this.keys.has(kid) && this.now() - this.refreshedAt < 10_000;
    if (throttledUnknown) throw unavailable();
    if (!this.keys.has(kid) || this.now() >= this.expires) await this.refresh();
    if (this.now() >= this.expires) throw unavailable();
    const key = this.keys.get(kid);
    if (!key) throw invalid();
    const payloadB64 = Buffer.from(raw, "utf8").toString("base64url");
    const boundPayload = Buffer.from(`${timestamp}.${payloadB64}`, "utf8").toString("base64url");
    if (!verify(null, Buffer.from(`${parts[0]}.${boundPayload}`, "utf8"), key, Buffer.from(parts[2], "base64url"))) throw invalid();
    try { return JSON.parse(raw); } catch { throw new AuthEmailError(400, "Invalid email event."); }
  }
}

export function authEmailMessage(payload: unknown, headers: Headers, authBaseUrl: string, now = Date.now()): AuthEmailMessage {
  if (!object(payload) || payload.event_type !== "send.magic_link" || payload.event_type !== headers.get("x-neon-event-type") ||
    typeof payload.event_id !== "string" || !/^[A-Za-z0-9._:-]{1,200}$/.test(payload.event_id) || payload.event_id !== headers.get("x-neon-event-id") ||
    !object(payload.context) || !object(payload.user) || !object(payload.event_data)) throw new AuthEmailError(400, "Invalid email event.");
  const base = new URL(authBaseUrl);
  if (payload.context.endpoint_id !== base.hostname.split(".")[0]) throw invalid();
  const data = payload.event_data;
  if (!["email-verification", "forget-password", "sign-in"].includes(String(data.link_type)) ||
    typeof data.link_url !== "string" || data.link_url.length > 8_192 || /[\s\u0000-\u001f\u007f<>"\\]/u.test(data.link_url) ||
    typeof data.expires_at !== "string" || data.expires_at.length > 40 || !Number.isFinite(Date.parse(data.expires_at)) || Date.parse(data.expires_at) <= now ||
    typeof payload.user.email !== "string") throw new AuthEmailError(400, "Invalid email event.");
  const link = new URL(data.link_url);
  const allowed = new Set([base.origin, "https://theaipex.org", "https://www.theaipex.org"]);
  if (link.protocol !== "https:" || !allowed.has(link.origin) || link.username || link.password || link.port || link.hash) throw invalid();
  for (const name of ["callbackURL", "callbackUrl", "redirectTo", "errorCallbackURL"]) {
    for (const value of link.searchParams.getAll(name)) {
      const callback = new URL(value, "https://theaipex.org");
      if (!["https://theaipex.org", "https://www.theaipex.org"].includes(callback.origin) || callback.username || callback.password || callback.port) throw invalid();
    }
  }
  return { eventId: payload.event_id, email: payload.user.email, name: typeof payload.user.name === "string" ? payload.user.name : "",
    kind: data.link_type as AuthEmailMessage["kind"], link: data.link_url };
}

export async function sendAuthEmail(apiKey: string, message: AuthEmailMessage, fetcher: typeof fetch = fetch): Promise<boolean> {
  if (!apiKey) return false;
  const payload = buildAuthEmail(message);
  try {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(5_000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `aipex-auth-email/v2/${createHash("sha256").update(message.eventId).digest("hex")}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return false;
    const body: unknown = await response.json();
    return object(body) && typeof body.id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id);
  } catch { return false; }
}
