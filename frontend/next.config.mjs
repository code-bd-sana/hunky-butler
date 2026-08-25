import { readFileSync } from "node:fs";

// The location pages that actually exist are defined by app/locations/locations.json,
// which also drives generateStaticParams for app/[slug]. Reading it here means the
// /locations/* redirects below can never point at a slug that has no page.
const locations = JSON.parse(
  readFileSync(new URL("./app/locations/locations.json", import.meta.url), "utf8")
);

// A second, weaker copy of every location page used to live at /locations/[slug]:
// "use client", no generateMetadata, no server-rendered content, and absent from
// the sitemap, while the canonical /[slug] route has all of those. Two URLs served
// the same city, which is a duplicate-content problem that would only grow as more
// cities are switched on. The weak route is deleted and its URLs 301 here.
//
// Two source shapes are covered, because the locations API returns bare city slugs
// ("dudley") while locations.json stores prefixed ones ("buff-butlers-dudley"):
//   /locations/buff-butlers-dudley -> /buff-butlers-dudley
//   /locations/dudley              -> /buff-butlers-dudley
const locationRedirects = locations.flatMap((loc) => {
  const entries = [
    { source: `/locations/${loc.slug}`, destination: `/${loc.slug}`, permanent: true },
  ];
  const bare = loc.slug.replace(/^buff-butlers-/, "");
  if (bare !== loc.slug) {
    entries.push({ source: `/locations/${bare}`, destination: `/${loc.slug}`, permanent: true });
  }
  return entries;
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  // The hero video was served with `cache-control: public, max-age=0`, so a
  // 7.2 MB file was re-downloaded on every single visit, on mobile as well as
  // desktop. These assets are static and change only when someone replaces the
  // file, so they can be cached hard. stale-while-revalidate is used instead of
  // `immutable` because the filenames are not content-hashed: a replaced video
  // still propagates, it just serves the old copy once while refreshing.
  async headers() {
    return [
      {
        // Private to a logged-in user. Never index, and do not crawl deeper.
        source: "/dashboard/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Account routes are mid-journey utilities, not landing pages. They
        // were neither submitted to the sitemap nor explicitly excluded.
        // These layouts are client components and so cannot export route
        // metadata, which is why this is done with a header.
        source: "/:path(login|register|verification|otp)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  // 301 redirects from legacy WordPress URLs (found via Google Search Console's
  // "Page indexing" > Not found (404) report) to their nearest equivalent on the
  // new Next.js site. Old WordPress theme-demo/builder URLs (e.g. /layouts/*,
  // /woolentor-template/*) are deliberately NOT redirected here - they were never
  // real content, just leftover theme demo pages, so sending Google a 301 for
  // them would be misleading. Everything below had real content on the old site.
  async redirects() {
    return [
      ...locationRedirects,
      // Apex to www. Both hosts currently return 200 with byte-identical
      // content, which splits signals across two hostnames. Doing it here
      // rather than in the reverse proxy keeps it in version control, and it
      // applies wherever the app runs. If the proxy later handles it, this
      // becomes a harmless no-op because the request never reaches Next.
      {
        source: "/:path*",
        has: [{ type: "host", value: "hunkybutlerservice.co.uk" }],
        destination: "https://www.hunkybutlerservice.co.uk/:path*",
        permanent: true,
      },
      // Blog pagination (both old permalink styles) -> new blog listing page
      {
        source: "/index.php/blog",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/index.php/blog/page/:num",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/page/:num",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog-posts/:num",
        destination: "/blog",
        permanent: true,
      },
      // Blog categories / author archives -> new blog listing page
      {
        source: "/category/hen-party-ideas",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/hen-party-activities",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/hen-party-activities/page/:num",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/what-do-topless-waiters-and-butlers-in-the-buff-wear",
        destination: "/blog",
        permanent: true,
      },
      {
        source:
          "/category/what-do-topless-waiters-and-butlers-in-the-buff-wear/page/:num",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/birthdays/recent-news",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/author/najimuddinarman",
        destination: "/blog",
        permanent: true,
      },
      // Service categories -> matching new service page
      {
        source: "/category/buff-butlers",
        destination: "/buff-butlers",
        permanent: true,
      },
      {
        source: "/index.php/buff-butler-services",
        destination: "/buff-butlers",
        permanent: true,
      },
      {
        source: "/category/life-drawing",
        destination: "/life-drawing",
        permanent: true,
      },
      {
        source: "/category/life-drawing-class",
        destination: "/life-drawing",
        permanent: true,
      },
      {
        source: "/index.php/life-drawing-classes",
        destination: "/life-drawing",
        permanent: true,
      },
      {
        source: "/index.php/life-drawing-class",
        destination: "/life-drawing",
        permanent: true,
      },
      {
        source: "/life-drawing-classes/life-drawing-class",
        destination: "/life-drawing",
        permanent: true,
      },
      {
        source: "/category/cocktails",
        destination: "/cocktail",
        permanent: true,
      },
      {
        source: "/category/cocktail-masterclass",
        destination: "/cocktail",
        permanent: true,
      },
      // Duplicate location pages. Liverpool used to be the only city redirected
      // here, on the reasoning that other cities had their only substantial
      // content on the /locations/ page. That turned out not to be true:
      // comparing the locations API against locations.json, 26 of the 28 cities
      // have a byte-identical tagline and description in both, and the only two
      // that differ are Liverpool and Manchester, whose static copy was
      // deliberately rewritten. No city loses content by being redirected, so
      // the single hand-written Liverpool rule is replaced by locationRedirects
      // above, which covers every city from the same file that defines the real
      // pages.
      // Standalone pages -> nearest new-site equivalent
      {
        source: "/index.php/work-for-us",
        destination: "/joinTheTeam",
        permanent: true,
      },
      {
        source: "/index.php/about-butler-services",
        destination: "/about",
        permanent: true,
      },
      {
        // Points at the corrected spelling directly. Sending it to the old
        // path would create a redirect chain now that /terms-and-conditon
        // itself redirects.
        source: "/index.php/trademark",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      // Old downloadable asset, no longer exists -> homepage
      {
        source: "/wp-content/uploads/2015/06/Hunky-Butler-Service-Games.pdf",
        destination: "/",
        permanent: true,
      },

      // Spelling corrections. The misspelled paths are live and may be linked
      // externally, so they are redirected rather than removed.
      {
        // "conditon" is missing an i. The correct spelling is now canonical.
        source: "/terms-and-conditon",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        // "middlesborough" should be "middlesbrough". Cheap to fix now while
        // the page is still noindexed and has no accumulated equity.
        source: "/buff-butlers-middlesborough",
        destination: "/buff-butlers-middlesbrough",
        permanent: true,
      },

      // /signup was never a real route and served the not-found page.
      // Registration lives at /register.
      {
        source: "/signup",
        destination: "/register",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
