import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("SECURITY: JWT_SECRET environment variable is not set. Server cannot start without it.");
}
const JWT_SECRET = new TextEncoder().encode(jwtSecret);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  // Get session token from cookies
  const token = request.cookies.get("ayu_admin_session")?.value;

  let isValidAdmin = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload && payload.role === "ADMIN") {
        isValidAdmin = true;
      }
    } catch {
      isValidAdmin = false;
    }
  }

  // If unauthorized:
  if (!isValidAdmin) {
    // 1. Admin API route: strictly return 403 Forbidden
    if (isAdminApiRoute) {
      return NextResponse.json(
        {
          error: "Forbidden. Admin access required.",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // 2. Admin UI page: redirect to /login with callbackUrl
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
