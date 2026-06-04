import { NextResponse } from "next/server";

export default async function middleware(req) {
  // Bypassing all frontend middleware checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-shot"],
};
