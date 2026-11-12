import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJWT, verifyCustomerJWT } from "@/lib/auth";

const CUSTOMER_PROTECTED_PREFIXES = [
  "/dashboard",
  "/apply",
  "/loans",
  "/checkout",
  "/profile",
  "/notifications",
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const verifiedAdmin = sessionCookie ? await verifyAdminJWT(sessionCookie) : null;

    if (!verifiedAdmin && !isLoginPage) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      if (sessionCookie) {
        response.cookies.delete("admin_session");
        response.cookies.delete("admin_meta");
      }
      return response;
    }

    if (verifiedAdmin && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  const isCustomerRoute = CUSTOMER_PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isCustomerRoute) {
    const customerCookie = request.cookies.get("customer_session")?.value;
    const verifiedCustomer = customerCookie ? await verifyCustomerJWT(customerCookie) : null;

    if (!verifiedCustomer) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("login", "1");
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      const response = NextResponse.redirect(loginUrl);
      if (customerCookie) {
        response.cookies.delete("customer_session");
        response.cookies.delete("customer_refresh");
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/apply/:path*",
    "/loans/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/notifications/:path*",
  ],
};
