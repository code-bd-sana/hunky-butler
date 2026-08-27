/**
 * Attempt limiting for the authentication endpoints.
 *
 * There is no rate limiting anywhere on this API, so the login endpoint accepts
 * unlimited guesses. The administrator password is currently "123", which means
 * the account can be taken in the time it takes to send a few requests, and
 * every authorization fix in the system rests on that account. Changing the
 * password is the client's to do; making brute force impractical is ours.
 *
 * KEYED ON THE TARGET EMAIL, NOT THE CLIENT IP, AND DELIBERATELY SO.
 *
 * The API runs behind the Coolify reverse proxy and Express is not configured
 * with `trust proxy`, so req.ip is the proxy's address for every visitor. An IP
 * keyed limiter would therefore put the entire internet in one bucket and lock
 * the whole site out after a handful of requests. That is an outage, not a
 * defence.
 *
 * Keying on the email being attempted avoids the proxy question completely and
 * targets the actual risk: someone working through passwords against one
 * account. It cannot be dodged by rotating IP addresses, which an IP limiter
 * can be.
 *
 * The trade is that somebody could burn another person's attempts on purpose to
 * be a nuisance. The limits below are set generously enough that a real person
 * will not meet them, and the window is short, so the worst case is a wait
 * rather than a lockout. Nothing is ever locked permanently.
 *
 * State is in memory. There is a single API container, so this is sufficient
 * today. If the API is ever scaled to more than one instance, this needs to move
 * to Redis or the limit becomes per instance.
 */

const buckets = new Map();

/** Stops the map growing without bound on a long running process. */
const prune = (now) => {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
};

let lastPrune = 0;
const PRUNE_EVERY_MS = 60_000;

export const consumeAttempt = (key, { limit, windowMs, now = Date.now() }) => {
  if (now - lastPrune > PRUNE_EVERY_MS) {
    prune(now);
    lastPrune = now;
  }

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
};

/** Clears all state. Exists for tests. */
export const resetRateLimits = () => buckets.clear();

/**
 * Builds middleware that limits attempts against a single email address.
 *
 * Requests with no email are allowed through rather than lumped into one shared
 * bucket, which would be the same all-in-one-bucket mistake as keying on the
 * proxy IP. Those requests fail validation in the controller anyway.
 */
export const limitByEmail = ({ limit, windowMs, scope, message }) => {
  return (req, res, next) => {
    const raw = req.body?.email ?? req.params?.email;
    const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    if (!email) return next();

    const result = consumeAttempt(`${scope}:${email}`, { limit, windowMs });
    if (result.allowed) return next();

    res.set("Retry-After", String(result.retryAfterSeconds));
    return res.status(429).json({
      message:
        message ||
        `Too many attempts. Please try again in ${Math.ceil(result.retryAfterSeconds / 60)} minute(s).`,
    });
  };
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
