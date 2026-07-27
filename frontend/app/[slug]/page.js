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

  return (
    <div>
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
