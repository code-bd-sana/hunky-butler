/**
 * Cookie consent state.
 *
 * The site previously set no non-essential cookies, so it correctly needed no
 * banner. Adding GA4 changes that: under UK PECR, analytics cookies require
 * consent before they are set. Consent Mode v2 handles this properly, by
 * telling Google the consent state rather than simply withholding the tag.
 *
 * Default is denied. Until a visitor chooses, Google receives cookieless pings
 * only, which means no analytics cookie is written and basic modelled traffic
 * still reaches GA4. Granting consent upgrades to full measurement.
 *
 * The choice is stored in localStorage, which is first-party and strictly
 * necessary for remembering a consent preference, so it does not itself
 * require consent.
 */

export const CONSENT_KEY = 'hbs_cookie_consent';
export const CONSENT_VERSION = 1;

/** Consent Mode v2 signals we manage. */
export const GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
};

export const DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
};

/**
 * Read the stored choice.
 * Returns 'granted', 'denied', or null when the visitor has not chosen yet.
 * Wrapped in try/catch because localStorage throws in some privacy modes.
 */
export function readConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // A version bump invalidates old choices, so consent can be re-sought if
    // the set of tags materially changes.
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed.state === 'granted' ? 'granted' : 'denied';
  } catch {
    return null;
  }
}

/** Persist the choice. Failure is non-fatal: the banner simply reappears. */
export function writeConsent(state) {
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ state, version: CONSENT_VERSION, at: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

/**
 * Push an updated consent state to Google via gtag.
 * Safe to call before GTM has loaded: the dataLayer queue is created here if
 * it does not exist, and Google reads it when the container initialises.
 */
export function updateGoogleConsent(state) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('consent', 'update', state === 'granted' ? GRANTED : DENIED);
}
