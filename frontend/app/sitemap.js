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
  "review",
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

  // Location pages are left out of the sitemap for now: they currently share
  // templated content across cities (only the city name changes), so they're
  // noindexed in [slug]/page.js too. Once each location has unique content,
  // add the entries back in here so Google can discover and index them.
  //
  // const locationEntries = locations.map((loc) => ({
  //   url: BASE_URL + "/" + loc.slug,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly",
  //   priority: 0.8,
  // }));
  //
  // return staticEntries.concat(locationEntries);

  return staticEntries;
}
