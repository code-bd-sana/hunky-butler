/**
 * The public address of the customer-facing site.
 *
 * Booking confirmations, payment reminders and review requests all link the
 * customer back to the site. Those links were hard-coded to
 * https://hunky-butler.vercel.app, a stale Vercel deployment that is still
 * serving a full copy of the site. Real customers were being sent there to pay
 * a balance and to leave a review, on a host the live system does not deploy to
 * and does not control.
 *
 * Driven by FRONTEND_URL so it can differ per environment, defaulting to the
 * live domain rather than to whatever was convenient during development. Any
 * trailing slash is trimmed so callers can safely write `${SITE_URL}/dashboard`.
 */
export const SITE_URL = (
  process.env.FRONTEND_URL || "https://www.hunkybutlerservice.co.uk"
).replace(/\/+$/, "");

export const siteLink = (path = "") =>
  `${SITE_URL}/${String(path).replace(/^\/+/, "")}`;
