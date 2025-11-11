import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  

  const token = await getToken({ 
    req, 
    secret: "aidfjnvociydfnovfadf",
    secureCookie: process.env.NODE_ENV === 'production'
  });


  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = token?.role;

  if (pathname === "/dashboard/payments") {
 
    if (userRole !== 'customer' && userRole !== 'butler') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname === "/dashboard/messages") {
 
  }

  if (pathname === "/dashboard/users") {
    console.log(token, "I am your personal user")

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname === "/dashboard/financials") {

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname === "/dashboard/services") {

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname === "/dashboard/adminTools") {
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  
  if (pathname === "/dashboard/schedule") {
    if (userRole !== 'butler') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();  
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/payments",
    "/dashboard/messages", 
    "/dashboard/users",
    "/dashboard/profile",
    "/dashboard/financials",
    "/dashboard/services",
    "/dashboard/adminTools",
    "/dashboard/schedule",
    '/my-shot'
  ],
};