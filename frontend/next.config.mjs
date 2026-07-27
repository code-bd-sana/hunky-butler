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
  // 301 redirects from legacy WordPress URLs (found via Google Search Console's
  // "Page indexing" > Not found (404) report) to their nearest equivalent on the
  // new Next.js site. Old WordPress theme-demo/builder URLs (e.g. /layouts/*,
  // /woolentor-template/*) are deliberately NOT redirected here - they were never
  // real content, just leftover theme demo pages, so sending Google a 301 for
  // them would be misleading. Everything below had real content on the old site.
  async redirects() {
    return [
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
      // Duplicate location pages.
      // Liverpool previously existed on two systems: the API-driven
      // /locations/[slug] pages and the clean-URL /buff-butlers-[city] pages.
      // Both were indexable and competing for the same search terms. The
      // clean-URL version is the canonical one (unique metadata, LocalBusiness
      // + BreadcrumbList + FAQPage schema, city-specific content), so the
      // /locations/ version is redirected onto it to consolidate ranking
      // signals. Other cities are deliberately left alone for now: their
      // /locations/ pages still hold the only substantial content they have.
      {
        source: "/locations/liverpool",
        destination: "/buff-butlers-liverpool",
        permanent: true,
      },
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
        source: "/index.php/trademark",
        destination: "/terms-and-conditon",
        permanent: true,
      },
      // Old downloadable asset, no longer exists -> homepage
      {
        source: "/wp-content/uploads/2015/06/Hunky-Butler-Service-Games.pdf",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
