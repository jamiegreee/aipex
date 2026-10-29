import { NextResponse, type NextRequest } from "next/server";
import { createAuth, authConfigured } from "@/lib/auth";
import { coursesEnabled } from "@/lib/site";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Old dashboard bookmarks should lead to the public tools before auth runs.
  if (!coursesEnabled && ["/learn", "/learn/"].includes(pathname)) {
    return NextResponse.redirect(new URL("/tools", request.url));
  }
  // Let hidden routes return their 404 before account middleware can redirect.
  if (
    !coursesEnabled &&
    (pathname === "/courses" ||
      pathname.startsWith("/courses/") ||
      ["/learn/portfolio", "/learn/portfolio/"].includes(pathname))
  ) {
    return NextResponse.next();
  }
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
    "/tools/:path*",
    "/learn/:path*",
    "/account",
    "/membership/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
