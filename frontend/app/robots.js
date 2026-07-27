const BASE_URL = "https://www.hunkybutlerservice.co.uk";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: BASE_URL + "/sitemap.xml",
  };
}
