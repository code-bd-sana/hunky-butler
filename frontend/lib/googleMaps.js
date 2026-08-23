/**
 * Google Maps API key access.
 *
 * The key was previously hard-coded in six tracked files, including as a
 * fallback in a server route:
 *
 *   const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIza...";
 *
 * This repository is public, and the key has been in its history since
 * 15 October 2025. The server-side Places Details call succeeds, and
 * server-to-server requests send no HTTP referrer, which means the key is not
 * referrer-restricted. Anyone who reads the repository can use it, and the
 * usage is billed to the account that owns it.
 *
 * Removing it from the working tree does not remove it from history, so
 * THE KEY MUST BE ROTATED IN GOOGLE CLOUD. This change stops the new key from
 * ever being committed; it does not protect the old one.
 *
 * Two separate keys are expected, because they need different restrictions:
 *
 *   NEXT_PUBLIC_GOOGLE_MAPS_KEY  browser key, for Maps JS, Places autocomplete
 *                                and map embeds. Public by necessity, so it
 *                                must be restricted by HTTP referrer to the
 *                                site's own domains, and limited to the Maps
 *                                JavaScript and Places APIs.
 *
 *   GOOGLE_API_KEY               server-only key, for Places Details in the
 *                                reviews route. Never sent to the browser, so
 *                                it should be IP-restricted where possible and
 *                                must never be prefixed NEXT_PUBLIC_.
 *
 * There is deliberately no fallback value. If the variable is missing the
 * feature fails visibly in logs rather than silently falling back to a key
 * committed in public source.
 */

/** Browser key. Safe to reference in client components. */
export const GOOGLE_MAPS_BROWSER_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

/** True when the browser key is configured. Callers should degrade gracefully. */
export const hasGoogleMapsKey = () => Boolean(GOOGLE_MAPS_BROWSER_KEY);

/** Maps JavaScript loader URL, or null when no key is configured. */
export const mapsJsUrl = (libraries = "places") =>
  hasGoogleMapsKey()
    ? `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_BROWSER_KEY}&libraries=${libraries}`
    : null;

/**
 * Map embed URL for a place query.
 *
 * Returns undefined when no key is configured, so React omits the src
 * attribute entirely rather than rendering src="" (which a browser resolves to
 * the current page and would embed the page inside itself).
 */
export const mapEmbedUrl = (query) =>
  hasGoogleMapsKey()
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_BROWSER_KEY}&q=${encodeURIComponent(
        query
      )}`
    : undefined;
