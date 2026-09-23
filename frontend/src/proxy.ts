import { NextResponse, type NextRequest } from "next/server";
import {
  isAuthEnabled,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  shouldRefreshSession,
  signSessionToken,
  verifySessionToken,
} from "@/features/auth/server/session-token";

const LOGIN_PATH = "/login";

/**
 * Optimistic auth gate + sliding session refresh. This is a UX layer only:
 * pages and Route Handlers re-verify the session in the DAL.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isAuthEnabled()) {
    return pathname === LOGIN_PATH ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (pathname === LOGIN_PATH) {
    return session ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  if (shouldRefreshSession(session)) {
    response.cookies.set(SESSION_COOKIE_NAME, await signSessionToken(session.sid), sessionCookieOptions());
  }
  return response;
}

export const config = {
  // Skip static assets and public SEO/metadata files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|llms.txt|manifest.webmanifest|opengraph-image).*)",
  ],
};
