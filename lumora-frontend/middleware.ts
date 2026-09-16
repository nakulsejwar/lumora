import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Authentication check for session cookie
  const authenticated = request.cookies.has("local_auth");

  // Exact public pages allowed without login
  const isExactPublicPage =
    pathname === "/" ||
    pathname === "/privacy-policy" ||
    pathname === "/about-us" ||
    pathname === "/favicon.ico";

  // Public auth & static asset prefixes
  const publicPrefixes = [
    "/login",
    "/register",
    "/resetpassword",
    "/newpassword",
    "/verifyemail",
    "/api",
    "/_next",
    "/images",
  ];

  const isPublicPrefix = publicPrefixes.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(prefix + "/") ||
      pathname.startsWith(prefix + "?")
  );

  const isPublicRoute = isExactPublicPage || isPublicPrefix;

  // STRICT AUTH WALL: If not authenticated and trying to access ANY course, game, library, score, or feature page -> REDIRECT TO LOGIN IMMEDIATELY
  if (!authenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    if (pathname && pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and visiting auth pages or root `/`, redirect to `/courses`
  if (authenticated) {
    if (["/register", "/login", "/"].includes(pathname)) {
      return NextResponse.redirect(new URL("/courses", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
