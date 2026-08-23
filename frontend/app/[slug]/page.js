import { notFound } from "next/navigation";
import locations from "@/app/locations/locations.json";
import ImageGallery from "@/components/about/ImageGallery";
import Footer from "@/components/homepage/Footer";
import BuffButlersEvents from "@/components/Location/BuffButtlersEvents";
import LocationDynamicBanner from "@/components/Location/LocationDynamicBanner";
import LocationFaqs from "@/components/Location/LocationFaqs";
import LocationHighlights from "@/components/Location/LocationHighlights";
import Map from "@/components/Location/Map";
import NearbyLocations from "@/components/Location/NearbyLocations";
import LocationLocalContent from "@/components/Location/LocationLocalContent";
import WhatsIncluede from "@/components/Location/WhatsIncluede";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import ReduxProvider from "../provider/ReduxProvider";
import Navbar from "@/components/shared/Navbar";
import { SOCIAL_SAME_AS } from "@/lib/socialLinks";

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

// Each service has an existing hub page. Breadcrumbs point at the right one
// so a life drawing page does not claim to sit under Buff Butlers.
const SERVICE_HUBS = {
  "buff-butlers": { path: "/buff-butlers", label: "Buff Butlers" },
  "life-drawing": { path: "/life-drawing", label: "Life Drawing" },
  "male-strippers": { path: "/strippers", label: "Male Strippers" },
  "cocktail-classes": { path: "/cocktail", label: "Cocktail Classes" },
};

export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const location = locations.find((loc) => loc.slug === slug);

  if (!location) {
    return { title: "Page Not Found | Hunky Butler Service" };
  }

  const title =
    location.metaTitle ||
    `${location.name} | Hen Party Entertainment – Hunky Butler Service`;
  const description = location.metaDescription || location.description;
  const url = `${SITE_URL}/${location.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Hunky Butler Service",
      type: "website",
      images: [{ url: `${SITE_URL}/logo.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/logo.png`],
    },
    // Location pages are noindexed while they share templated content across
    // cities. Once a city has genuinely unique copy it gets `uniqueContent: true`
    // in locations.json and becomes indexable.
    robots: location.uniqueContent
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const location = locations.find((loc) => loc.slug === slug);

  if (!location) {
    // Rendering the 404 component directly still returned HTTP 200, so Google
    // saw every unknown URL as a real, indexable page (a soft 404), cached for
    // a year by `s-maxage`. notFound() renders the same not-found UI but sends
    // a genuine 404 status.
    notFound();
  }

  const serviceName = location.serviceName || "Buff Butlers";
  const hub = SERVICE_HUBS[location.service] || SERVICE_HUBS["buff-butlers"];

  // Internal links are resolved against locations.json here, so a link is only
  // ever rendered for a page that actually exists. A new city therefore gains
  // inbound links from its neighbours the day it is published, and we can
  // never ship a link to a 404 in the meantime.
  const sameCityServices = locations
    .filter((loc) => loc.city === location.city && loc.slug !== location.slug)
    .map((loc) => ({ slug: loc.slug, label: loc.serviceName || "Buff Butlers" }));

  const nearbyPlaces = (location.nearbySlugs || [])
          .map((slug) => locations.find((loc) => loc.slug === slug || loc.slug === `buff-butlers-${slug}`))
    .filter(Boolean)
    .map((loc) => ({ slug: loc.slug, label: loc.city }));

  const pageUrl = `${SITE_URL}/${location.slug}`;

  // Location pages live at app/[slug], outside the (home) route group, so they
  // do NOT inherit the site-wide EntertainmentBusiness schema defined in
  // app/(home)/layout.js. Local landing pages are exactly where this schema
  // matters most, so it is declared here with the city as areaServed.
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    name: "Hunky Butler Service",
    url: pageUrl,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    telephone: "+447745865352",
    email: "info@hunkybutlerservice.co.uk",
    description: location.metaDescription || location.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "36a Renshaw Street",
      addressLocality: "Liverpool",
      postalCode: "L1 4EF",
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "City",
      name: location.city,
    },
    sameAs: SOCIAL_SAME_AS,
    priceRange: "££",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "112",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // Service schema describes what is actually being sold on this page. Without
  // it, life drawing in Liverpool and butlers in Liverpool look like the same
  // local business page to Google rather than two distinct offerings.
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceName,
    name: serviceName + " in " + location.city,
    description: location.metaDescription || location.description,
    url: pageUrl,
    areaServed: { "@type": "City", name: location.city },
    provider: {
      "@type": "EntertainmentBusiness",
      name: "Hunky Butler Service",
      url: SITE_URL,
      telephone: "+447745865352",
    },
  };

  // Breadcrumb trail helps Google render the hierarchy in search results
  // instead of showing a bare URL.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: hub.label,
        item: SITE_URL + hub.path,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: location.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ReduxProvider>
        <Navbar></Navbar>
      </ReduxProvider>
      <LocationDynamicBanner
        image={location.image}
        title={location.name}
        tagline={location.tagline}
        description={location.description}
        hubPath={hub.path}
        hubLabel={hub.label}
      />

      {/* Content section */}
      <WhatsIncluede
        city={location.city}
        items={location.whatsIncluded}
        serviceName={serviceName}
      />

      {/* Two-column highlights, matching the /locations layout. Renders only
          where the page defines them, so legacy cities are unaffected. */}
      <LocationHighlights
        city={location.city}
        serviceName={serviceName}
        heading={location.highlights?.heading}
        intro={location.highlights?.intro}
        points={location.highlights?.points}
      />

      {/* City-specific SEO content: renders only for cities that define it */}
      <LocationLocalContent
        localSection={location.localSection}
        partnerVenues={location.partnerVenues}
        areasServed={location.areasServed}
      />

      <ReviewSection></ReviewSection>
      <BuffButlersEvents
        city={location.city}
        serviceName={serviceName}
        occasions={location.occasions}
      />

      {/* City-specific FAQs + FAQPage schema: renders only where defined */}
      <LocationFaqs
        faqs={location.faqs}
        city={location.city}
        serviceName={serviceName}
      />

      {/* Internal links: other services here, plus neighbouring towns */}
      <NearbyLocations
        city={location.city}
        sameCityServices={sameCityServices}
        nearbyPlaces={nearbyPlaces}
      />
      {/* Map renders only where coordinates exist, so legacy pages are unaffected */}
      {location.latitude && location.longitude ? (
        <Map
          latitude={location.latitude}
          longitude={location.longitude}
          city={location.city}
        />
      ) : null}
      <ImageGallery></ImageGallery>

      <Footer></Footer>
    </div>
  );
}
