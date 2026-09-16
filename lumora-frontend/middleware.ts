import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Mock authentication check for local system
  const authenticated = request.cookies.has("local_auth");

  // Public unauthenticated whitelist: ONLY explicit login/auth pages or static asset pages
  const publicPrefixes = [
    "/login",
    "/register",
    "/resetpassword",
    "/newpassword",
    "/verifyemail",
    "/privacy-policy",
    "/about-us",
    "/api",
    "/_next",
    "/favicon.ico",
    "/images",
    "/"
  ];

  const isPublicRoute = publicPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix)
  );

  // STRICT AUTH WALL: If not authenticated and attempting to access ANY feature, game, course, library, or page outside public whitelist -> REDIRECT TO LOGIN IMMEDIATELY
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
