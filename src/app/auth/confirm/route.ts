import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/courses";
import { siteUrl } from "@/lib/site-url";
export async function GET(request: NextRequest) {
  const token_hash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (
    token_hash &&
    (type === "email" || type === "recovery" || type === "signup")
  ) {
    const client = await createClient();
    const { error } = await client.auth.verifyOtp({ token_hash, type });
    if (!error)
      return NextResponse.redirect(
        new URL(
          safeNext(
            request.nextUrl.searchParams.get("next"),
            type === "recovery" ? "/reset-password" : "/learn",
          ),
          siteUrl(),
        ),
      );
  }
  return NextResponse.redirect(new URL("/login?error=link", siteUrl()));
}
