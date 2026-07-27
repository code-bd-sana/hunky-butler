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

const locationEntries = locations.map((loc) => ({
  url: BASE_URL + "/" + loc.slug,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.8,
}));

return staticEntries.concat(locationEntries);
}
