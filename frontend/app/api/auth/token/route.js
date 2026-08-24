import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * Returns the current session's signed JWT to the browser that already holds
 * the session cookie.
 *
 * Why this exists:
 *
 * The API lives on api.hunkybutlerservice.co.uk, a different subdomain from the
 * site. NextAuth's session cookie is host-only (no Domain attribute is set), so
 * it is scoped to www and is never sent to the API. The API therefore could not
 * read the session from a cookie, and the app worked around that by sending a
 * plain `x-user-email` header, which the API trusted with no verification.
 * Anyone could forge that header and be treated as any user, including admin.
 *
 * This route runs on the site's own origin, where the cookie IS available, and
 * hands the client the RAW signed token. The client forwards it to the API as
 * an `Authorization: Bearer` header, and the API verifies the signature with
 * the shared NEXTAUTH_SECRET (its middleware already has a Bearer path). A
 * forged email header no longer authenticates anything.
 *
 * This exposes nothing new: the caller already holds the session cookie for
 * this exact session, so it already is this user. getToken only ever reads the
 * cookie on THIS request, so one session can never obtain another's token.
 */
export async function GET(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true, // the encoded, signed JWT string rather than the decoded claims
  });

  if (!token) {
    return NextResponse.json({ token: null }, { status: 401 });
  }

  // no-store: this is a per-session secret and must never be cached by a proxy
  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store" } }
  );
}
