import { NextResponse, type NextRequest } from "next/server";
import { createAuth, authConfigured } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  if (!authConfigured()) return NextResponse.next();
  // Public previews remain available. Authenticated requests get cookie refresh.
  const signedIn = request.cookies
    .getAll()
    .some((c) => c.name.endsWith("neon-auth.session_token"));
  if (signedIn || request.nextUrl.pathname.startsWith("/learn")) {
    const response = await createAuth().middleware({ loginUrl: "/login" })(
      request,
    );
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/courses/:path*",
    "/learn/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
