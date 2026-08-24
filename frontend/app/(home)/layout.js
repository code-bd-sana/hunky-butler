
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import { SessionProvider } from "next-auth/react";
import ReduxProvider from "../provider/ReduxProvider";
import { SOCIAL_SAME_AS } from "@/lib/socialLinks";

// export const metadata = {
//   title: "Hunky Butlers",
//   description: "Buff Butlers, Life Drawing, Cocktail Masterclasses & More, We Bring the Fun to You.",
// };

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  // The apex and www hosts both return 200 with identical content, and this
  // layout had no canonical, so the most important URL on the site had nothing
  // telling Google which host to credit. metadataBase also resolves the
  // relative openGraph url below to an absolute one.
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  title: 'Buff Butlers & Hen Party Entertainment | UK’s Hunky Butler Service',
  description:
    'Book buff butlers, topless waiters, life drawing classes, cocktail masterclasses & male strippers for hen parties across the UK. Transparent pricing, verified staff & 5-star reviews.',
  openGraph: {
    title: 'Buff Butlers & Hen Party Entertainment UK',
    description:
      'Hunky Butler Service provides buff butlers, topless waiters, cocktail masterclasses, life drawing and strippers nationwide. Book today.',
    url: '/',
    siteName: 'Hunky Butler Service',
    type: 'website',
        images: [{ url: 'https://www.hunkybutlerservice.co.uk/logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buff Butlers & Hen Party Entertainment | UK',
    description:
      'Fun, cheeky and professional hen party entertainment — buff butlers, cocktail classes, life drawing and strippers.',
        images: ['https://www.hunkybutlerservice.co.uk/logo.png'],
  },

  keywords: [
    'buff butlers & hen party entertainment',
    'hire buff butlers',
    'topless waiters',
    'naked butlers',
    'hen party packages',
    'life drawing classes',
    'cocktail masterclasses',
    'male strippers UK',
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "Hunky Butler Service",
  "url": "https://www.hunkybutlerservice.co.uk",
  "logo": "https://www.hunkybutlerservice.co.uk/logo.png",
  "image": "https://www.hunkybutlerservice.co.uk/logo.png",
  "telephone": "+447745865352",
  "email": "info@hunkybutlerservice.co.uk",
  "description":
    "Hunky Butler Service is the UK's buff butler and hen party entertainment company, offering buff butlers, cocktail masterclasses, life drawing classes and male strippers nationwide.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "36a Renshaw Street",
    "addressLocality": "Liverpool",
    "postalCode": "L1 4EF",
    "addressCountry": "GB"
  },
  "areaServed": "GB",
  // Links the site to its verified social profiles so search engines can
  // connect them to this business entity.
  "sameAs": SOCIAL_SAME_AS,
  "priceRange": "££",
  // Sourced from the public Trustpilot profile. Every page's meta description
  // already claimed "5-star reviews" while no rating markup existed anywhere,
  // so no star rating could ever appear in search results.
  // Keep these figures in step with Trustpilot, or wire them to its API.
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "112",
    "bestRating": "5",
    "worstRating": "1"
  }
};

/**
 * Route-group layout for the public marketing pages.
 *
 * This previously rendered its own <html> and <body>. Route groups nest inside
 * the root layout, so doing that produced two of each on every page, which is
 * an invalid document. The shell now lives only in app/layout.js; this keeps
 * the providers and chrome specific to this group.
 */
export default function HomeLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <ReduxProvider>
        <Navbar />
        {children}
      </ReduxProvider>
    </>
  );
}
