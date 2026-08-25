/**
 * Event layer for GA4, via the GTM dataLayer.
 *
 * Deliberately independent of the GTM container itself. Events are pushed to
 * window.dataLayer whether or not a container is loaded, so this can ship before
 * NEXT_PUBLIC_GTM_ID exists: nothing is sent anywhere until the container is
 * configured, and the moment it is, every event below starts arriving with no
 * further code change. Consent is GTM's job, not this file's; a dataLayer push
 * sets no cookies and leaves the browser only if a consented tag picks it up.
 *
 * WHAT IS MEASURED AND WHY
 *
 * The booking data says where the money is being lost, so that is what this
 * instruments rather than a generic pageview taxonomy:
 *
 *   - Only 41 of 241 real bookings are marked paid. Four fifths of the demand
 *     this site captures never turns into money, and nothing currently shows
 *     where in the run to payment it stops.
 *   - 44 of those bookings carry no price at all, because the distance lookup
 *     failed and the wizard fell back to zero. That failure is silent today.
 *   - The price is only revealed after six personal-data fields, so the drop at
 *     that gate is the single most valuable number the site does not have.
 *
 * Every event carries enough to segment by service, party size and travel
 * distance, because those are the three levers on price.
 */

const isBrowser = () => typeof window !== "undefined";

/**
 * Pushes an event, and can never throw.
 *
 * This is called from inside the quote and checkout flow. An analytics error
 * must never be able to stop somebody booking, so every failure is swallowed
 * and reported to the console rather than raised.
 */
export const track = (event, params = {}) => {
  if (!isBrowser() || !event) return;
  try {
    window.dataLayer = window.dataLayer || [];
    const clean = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") clean[k] = v;
    }
    window.dataLayer.push({ event, ...clean });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("analytics: could not record", event, err);
    }
  }
};

/** GA4 expects a currency alongside any monetary value. */
export const CURRENCY = "GBP";

/**
 * Distance is bucketed rather than sent raw, so reports group usefully and no
 * postcode-level location is sent to a third party.
 */
export const travelBand = (miles) => {
  const m = Number(miles);
  if (!Number.isFinite(m)) return "unknown";
  if (m <= 15) return "local";
  if (m <= 60) return "regional";
  return "long_distance";
};

export const EVENTS = {
  // The run to payment, in order.
  QUOTE_STARTED: "quote_started",
  QUOTE_PRICED: "quote_priced",
  QUOTE_PRICE_FAILED: "quote_price_failed",
  QUOTE_DETAILS_SUBMITTED: "quote_details_submitted",
  GENERATE_LEAD: "generate_lead",
  BEGIN_CHECKOUT: "begin_checkout",
  PAYMENT_DEFERRED: "payment_deferred",
  PURCHASE: "purchase",

  // Intent that never reaches the booking form. A hen party organiser who
  // phones is a conversion, and it is invisible today.
  CONTACT_CLICK: "contact_click",
  REVIEW_PROFILE_CLICK: "review_profile_click",
  NEWSLETTER_SUBMIT: "newsletter_submit",
};

/** Convenience wrapper for the contact links, which appear in several places. */
export const trackContactClick = (method, placement) =>
  track(EVENTS.CONTACT_CLICK, { contact_method: method, placement });
