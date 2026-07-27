import locations from "@/app/locations/locations.json";
import ImageGallery from "@/components/about/ImageGallery";
import Footer from "@/components/homepage/Footer";
import BuffButlersEvents from "@/components/Location/BuffButtlersEvents";
import ButlerLocation from "@/components/Location/ButlerLocation";
import LocationDynamicBanner from "@/components/Location/LocationDynamicBanner";
import LocationFaqs from "@/components/Location/LocationFaqs";
import LocationLocalContent from "@/components/Location/LocationLocalContent";
import WhatsIncluede from "@/components/Location/WhatsIncluede";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import GlobalNotFound from "../global-not-found";
import ReduxProvider from "../provider/ReduxProvider";
import Navbar from "@/components/shared/Navbar";

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

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
    return <GlobalNotFound />;
  }

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
        name: "Buff Butlers",
        item: `${SITE_URL}/buff-butlers`,
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
      />

      {/* Content section */}
      <WhatsIncluede city={location.city} items={location.whatsIncluded} />

      {/* City-specific SEO content: renders only for cities that define it */}
      <LocationLocalContent
        localSection={location.localSection}
        partnerVenues={location.partnerVenues}
        areasServed={location.areasServed}
      />

      <ReviewSection></ReviewSection>
      <BuffButlersEvents city={location.city} />

      {/* City-specific FAQs + FAQPage schema: renders only where defined */}
      <LocationFaqs faqs={location.faqs} city={location.city} />

      <ButlerLocation />
      <ImageGallery></ImageGallery>
      <Footer></Footer>
    </div>
  );
}
