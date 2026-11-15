import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/lib/routes";
import { SESSION_COOKIE } from "@/lib/sessionCookie";

// A fast first gate: no session cookie means no point rendering an app page.
// It can't tell whether the cookie is still valid; the app layout checks that with GET /auth/me.
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const signIn = new URL(routes.signIn, request.url);
  signIn.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(signIn);
}

// Every signed-in page goes here as it's built.
export const config = {
  matcher: ["/home/:path*"],
};
