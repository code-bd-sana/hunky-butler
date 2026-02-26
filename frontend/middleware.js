import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: "aidfjnvociydfnovfadf",
  });

  // ❗ token null হলে redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = token.role;

  // payments → customer & butler
  if (pathname === "/dashboard/payments") {
    if (userRole !== "customer" && userRole !== "butler") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // users → admin only
  if (pathname === "/dashboard/users") {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // admin only routes
  const adminRoutes = [
    "/dashboard/financials",
    "/dashboard/services",
    "/dashboard/adminTools",
  ];

  if (adminRoutes.includes(pathname) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // schedule → butler only
  if (pathname === "/dashboard/schedule") {
    if (userRole !== "butler") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-shot"],
};
