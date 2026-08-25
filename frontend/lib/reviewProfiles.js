/**
 * Public review profiles.
 *
 * The site displays Google reviews inline, but never linked out to either
 * review profile, so a visitor could not read the full set or leave one of
 * their own. Both are strong proof: Trustpilot 4.9 from 112 reviews, and
 * Google 5.0 from 37.
 *
 * This matters more than usual right now, because the inline Google reviews
 * section is rendering nothing: the single Google API key is referrer
 * restricted and cannot be used for the server-side Places Details call. Until
 * the key is split (PR #352), these links are the only route a visitor has to
 * the reviews.
 *
 * The Place ID is the same one the reviews API route already uses.
 */

export const GOOGLE_PLACE_ID = "ChIJ07Q9XEUhe0gRkdnnQwGVZWQ";

export const REVIEW_PROFILES = {
  trustpilot: {
    key: "trustpilot",
    name: "Trustpilot",
    // Read all reviews.
    href: "https://uk.trustpilot.com/review/hunkybutlerservice.co.uk",
    // Leave a review.
    writeHref: "https://uk.trustpilot.com/evaluate/hunkybutlerservice.co.uk",
    label: "Read Hunky Butler Service reviews on Trustpilot",
    rating: "4.9",
    count: "112",
  },
  google: {
    key: "google",
    name: "Google",
    href: `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`,
    writeHref: `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`,
    label: "Read Hunky Butler Service reviews on Google",
    rating: "5.0",
    count: "37",
  },
};

export const REVIEW_PROFILE_LIST = [
  REVIEW_PROFILES.trustpilot,
  REVIEW_PROFILES.google,
];

/**
 * Profile URLs for schema.org `sameAs`.
 *
 * Review profiles are exactly the kind of thing sameAs is for: they help
 * search engines connect this site to the same business entity elsewhere.
 */
export const REVIEW_SAME_AS = REVIEW_PROFILE_LIST.map((p) => p.href);

/**
 * The one rating marked up in schema.org, and the one shown on the site.
 *
 * The figures used to be typed out again as string literals inside the schema
 * in two files, so the markup could drift away from what the footer links say,
 * and the hero displayed a bare "5.00" that matched neither. Google requires an
 * aggregateRating to reflect a rating that is actually visible on the page, so a
 * marked-up number nobody can see, or one that contradicts what is on screen,
 * risks a manual action for spammy structured data.
 *
 * Trustpilot is used because it is the larger sample (112 against 37) and it is
 * the profile the footer links to first. Everything that renders or marks up a
 * rating now reads from here, so there is exactly one number to change.
 */
export const AGGREGATE_RATING = {
  source: REVIEW_PROFILES.trustpilot.name,
  ratingValue: REVIEW_PROFILES.trustpilot.rating,
  reviewCount: REVIEW_PROFILES.trustpilot.count,
  bestRating: "5",
  worstRating: "1",
};

/** The same figures shaped for a schema.org AggregateRating node. */
export const AGGREGATE_RATING_SCHEMA = {
  "@type": "AggregateRating",
  ratingValue: AGGREGATE_RATING.ratingValue,
  reviewCount: AGGREGATE_RATING.reviewCount,
  bestRating: AGGREGATE_RATING.bestRating,
  worstRating: AGGREGATE_RATING.worstRating,
};
