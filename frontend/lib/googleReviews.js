import "server-only";

/**
 * Server-side Google reviews fetch.
 *
 * ReviewSection previously fetched reviews in a useEffect on every page it
 * appears on, which is ten pages including all four service pages and the
 * homepage. Nothing rendered until the browser had loaded JS, called the
 * internal API route, and waited on Google. The result was that the service
 * pages served 242 to 375 words of server HTML against 1,634 to 1,950 rendered,
 * so 81 to 85 percent of their content existed only after hydration.
 *
 * Fetching here instead means the reviews are in the initial HTML. The client
 * component keeps its own fetch as a fallback, so a page that cannot supply
 * server data (the client-rendered location routes) behaves exactly as before.
 *
 * Cached for an hour. Reviews change slowly and this is called by ten routes.
 */

const PLACE_ID = "ChIJ07Q9XEUhe0gRkdnnQwGVZWQ";
const DEFAULT_AVATAR = "/images/default-avatar.png";

/** Shape the raw Places payload into what ReviewSection renders. */
export function transformReviews(placeData) {
  if (!placeData) return null;

  const reviews = (placeData.reviews || [])
    .map((review, index) => ({
      id: review.time || `review-${index}`,
      name: review.author_name || `Customer ${index + 1}`,
      username: `@${(review.author_name || `customer${index + 1}`)
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9_]/g, "")
        .substring(0, 15)}`,
      body: review.text || "Great service!",
      img: review.profile_photo_url || DEFAULT_AVATAR,
      rating: review.rating || 5,
      time: review.relative_time_description || "Recently",
      source: "google",
      originalTime: review.time,
    }))
    // Newest first.
    .sort((a, b) =>
      a.originalTime && b.originalTime ? b.originalTime - a.originalTime : 0
    );

  return {
    reviews,
    averageRating: placeData.rating
      ? parseFloat(Number(placeData.rating).toFixed(1))
      : 0,
    totalReviews: placeData.user_ratings_total || 0,
    placeInfo: {
      name: placeData.name || "Hunky Butler Service",
      address: placeData.formatted_address || "Liverpool, UK",
      totalRatings: placeData.user_ratings_total || 0,
    },
  };
}

/**
 * Returns the transformed review payload, or null on any failure.
 *
 * Null is deliberate: the client component treats it as "no server data" and
 * falls back to its own fetch, so a Google outage degrades to the previous
 * behaviour rather than an empty section.
 */
export async function getGoogleReviews() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}` +
        `&fields=name,formatted_address,rating,user_ratings_total,reviews&key=${key}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== "OK" || !data.result) return null;

    return transformReviews(data.result);
  } catch {
    return null;
  }
}
