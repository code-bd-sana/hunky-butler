import locations from "./locations/locations.json";
import { base_url } from "@/utils/utils";

const BASE_URL = "https://www.hunkybutlerservice.co.uk";

const staticRoutes = [
  "",
  "about",
  "contact",
  "party-entertainment-services",
  "buff-butlers",
  "cocktail",
  "strippers",
  "life-drawing",
  "quote",
  "blog",
  "joinTheTeam",
  "privacy-policy",
  "refund-policy",
  "terms-and-conditon",
  ];

/**
 * Published blog posts. Previously no post appeared in the sitemap at all, and
 * because the listing page linked to them with router.push rather than an
 * anchor, they had no internal links either. Every article was therefore
 * unreachable by a crawler. Only `active` posts are submitted, so the
 * lorem-ipsum drafts still held in the API stay out.
 */
async function getBlogEntries() {
  try {
    const res = await fetch(`${base_url}/blogs`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const payload = await res.json();
    const posts = Array.isArray(payload)
      ? payload
      : payload?.data || payload?.blogs || [];

    return posts
      .filter((post) => post?.status === "active" && post?.slug)
      .map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.date || post.createdAt),
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    // A sitemap missing its blog section is far better than a build failure.
    return [];
  }
}

export default async function sitemap() {
  const staticEntries = staticRoutes.map((route) => ({
    url: route ? BASE_URL + "/" + route : BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  // Only location pages with genuinely unique content are submitted to Google.
  // The rest still share templated copy across cities, so they stay noindexed
  // (see [slug]/page.js) and out of the sitemap until their content is rewritten.
  // To add a city here: give it unique copy and set "uniqueContent": true in
  // locations.json - it will then appear automatically.
  const locationEntries = locations
    .filter((loc) => loc.uniqueContent)
    .map((loc) => ({
      url: BASE_URL + "/" + loc.slug,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  // Note: "review" was removed from staticRoutes above. There is no static
  // /review page in the app (only the dynamic /review/[email] route used for
  // emailed review links), so submitting /review to Google would point at a
  // dead URL.

  const blogEntries = await getBlogEntries();

  return staticEntries.concat(locationEntries, blogEntries);
}
