import locations from "./locations/locations.json";

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

export default function sitemap() {
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

  return staticEntries.concat(locationEntries);
}
