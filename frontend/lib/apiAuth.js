import { getSession } from "next-auth/react";

/**
 * Shared auth header builder for every RTK Query slice that hits the API.
 *
 * Every slice used to attach identity with two plain headers:
 *
 *   headers.set("x-user-email", session.user.email);
 *   headers.set("x-user-role", session.user.role);
 *
 * The API trusted those verbatim, so anyone could send
 * `x-user-email: admin@gmail.com` and be treated as the admin. This replaces
 * them with the session's signed JWT sent as a Bearer token, which the API
 * verifies cryptographically. There is deliberately NO fallback to the old
 * headers: if the token cannot be obtained the request goes out unauthenticated
 * and the API returns 401, rather than falling back to a forgeable identity.
 */

// The signed JWT changes only when the session does, so it is cached in memory
// and refreshed when the session's expiry moves. This avoids hitting
// /api/auth/token on every single API request.
let cached = { token: null, sessionExpires: null };

async function getBearerToken() {
  // getSession is cheap and cached by NextAuth; used here to detect whether the
  // session has changed since we last fetched the raw token.
  const session = await getSession();
  if (!session) {
    cached = { token: null, sessionExpires: null };
    return null;
  }

  if (cached.token && cached.sessionExpires === session.expires) {
    return cached.token;
  }

  try {
    const res = await fetch("/api/auth/token", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const { token } = await res.json();
    cached = { token: token || null, sessionExpires: session.expires };
    return cached.token;
  } catch {
    return null;
  }
}

/**
 * Drop-in `prepareHeaders` for createApi / fetchBaseQuery.
 * Runs on the client only; on the server there is no session to attach.
 */
export const prepareAuthHeaders = async (headers) => {
  if (typeof window === "undefined") return headers;

  const token = await getBearerToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

/** Clear the cached token, e.g. on logout. */
export const clearAuthTokenCache = () => {
  cached = { token: null, sessionExpires: null };
};
