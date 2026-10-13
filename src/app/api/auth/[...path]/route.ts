import { createAuth, authConfigured } from "@/lib/auth";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
const unavailable = () =>
  Response.json(
    { error: "Accounts are being configured. Please try again shortly." },
    { status: 503 },
  );
export async function GET(request: Request, context: Context) {
  return authConfigured()
    ? createAuth().handler().GET(request, context)
    : unavailable();
}
export async function POST(request: Request, context: Context) {
  return authConfigured()
    ? createAuth().handler().POST(request, context)
    : unavailable();
}
