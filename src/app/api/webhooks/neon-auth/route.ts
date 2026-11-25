import { AuthEmailError, AuthEmailVerifier, authEmailMessage, boundedText, sendAuthEmail } from "@/lib/auth-email-webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;
let verifier: AuthEmailVerifier | null = null;
let configuredBase = "";

export async function POST(request: Request) {
  const base = process.env.NEON_AUTH_BASE_URL;
  const key = process.env.RESEND_API_KEY;
  const reply = (status: number) => new Response(null, { status, headers: { "Cache-Control": "private, no-store" } });
  if (!base || !key || process.env.VERCEL_ENV === "preview") return reply(503);
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return reply(415);
  try {
    const raw = await boundedText(request.body);
    if (!verifier || base !== configuredBase) { verifier = new AuthEmailVerifier(base); configuredBase = base; }
    const payload = await verifier.verify(raw, request.headers);
    const message = authEmailMessage(payload, request.headers, base);
    // Acknowledge only after provider acceptance. The managed Auth flow waits
    // for this response; retries reuse the same versioned idempotency key.
    return reply(await sendAuthEmail(key, message) ? 204 : 503);
  } catch (error) {
    return reply(error instanceof AuthEmailError ? error.status : 400);
  }
}
