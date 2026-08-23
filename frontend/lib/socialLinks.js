/**
 * Single source of truth for the company's social profiles.
 *
 * The header and footer previously hard-coded eight placeholder URLs that
 * pointed at bare platform homepages rather than the company's own profiles.
 * Two were worse than placeholders:
 *
 *   https://t.com         did not resolve in DNS at all (a typo for tumblr.com)
 *   https://telegram.com  is the Worcester Telegram, a Massachusetts newspaper.
 *                         Telegram's real domain is telegram.org
 *
 * Every page on the site linked to both. Keeping the URLs in one place means
 * the header and footer can no longer drift apart.
 *
 * Only profiles that have been confirmed to exist are listed here. If a profile
 * is later created for a platform in UNVERIFIED_PLATFORMS, add it below and it
 * will appear wherever SOCIAL_LINKS is rendered.
 */

export const SOCIAL_LINKS = [
  {
    key: "facebook",
    name: "Facebook",
    href: "https://www.facebook.com/hunkybutlerservice/",
    label: "Hunky Butler Service on Facebook",
    icon: "/socialIcon/fb.png",
  },
  {
    key: "instagram",
    name: "Instagram",
    href: "https://www.instagram.com/hunkybutlerservice/",
    label: "Hunky Butler Service on Instagram",
    icon: "/socialIcon/insta.png",
  },
  {
    key: "tiktok",
    name: "TikTok",
    href: "https://www.tiktok.com/@hunkybutlerservice",
    label: "Hunky Butler Service on TikTok",
    icon: null, // no PNG asset yet, rendered with react-icons where available
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    // wa.me deep link using the published business number, so the icon starts
    // a real conversation instead of opening whatsapp.com.
    href: "https://wa.me/447745865352",
    label: "Contact Hunky Butler Service on WhatsApp",
    icon: "/socialIcon/wp.png",
  },
];

/** Profiles rendered in the header, which uses the PNG icon set. */
export const HEADER_SOCIAL_LINKS = SOCIAL_LINKS.filter((s) => s.icon);

/**
 * Platforms that had a placeholder link but no confirmed company profile.
 * The icons were removed rather than left pointing at a platform homepage.
 * Create the profile, then add it to SOCIAL_LINKS above.
 */
export const UNVERIFIED_PLATFORMS = ["twitter", "youtube", "tumblr", "telegram"];

/** Absolute profile URLs for schema.org `sameAs`. */
export const SOCIAL_SAME_AS = SOCIAL_LINKS.filter(
  (s) => s.key !== "whatsapp"
).map((s) => s.href);
