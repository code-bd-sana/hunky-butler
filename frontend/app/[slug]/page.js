import locations from "@/app/locations/locations.json";
import ImageGallery from "@/components/about/ImageGallery";
import Footer from "@/components/homepage/Footer";
import BuffButlersEvents from "@/components/Location/BuffButtlersEvents";
import ButlerLocation from "@/components/Location/ButlerLocation";
import LocationDynamicBanner from "@/components/Location/LocationDynamicBanner";
import WhatsIncluede from "@/components/Location/WhatsIncluede";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import GlobalNotFound from "../global-not-found";
import ReduxProvider from "../provider/ReduxProvider";
import Navbar from "@/components/shared/Navbar";

export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const location = locations.find((loc) => loc.slug === slug);

  if (!location) {
    return {
      title: "Page Not Found | Hunky Butler Service",
    };
  }

  const title = "Buff Butlers in " + location.city + " | Hunky Butler Service";
  const description = location.tagline + ". Book buff butlers, cocktail masterclasses, life drawing classes and male strippers for hen parties in " + location.city + ". Transparent pricing, verified staff and 5-star reviews.";
  const url = SITE_URL + "/" + location.slug;

  return {
    title: title,
    description: description,
    alternates: { canonical: url },
    // Location pages currently share templated content across cities.
    // Keep them noindexed until each page has unique, city-specific copy
    // to avoid Google flagging them as thin/duplicate content.
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: "Hunky Butler Service",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
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
      <WhatsIncluede city={location.city} />
      <ReviewSection></ReviewSection>
      <BuffButlersEvents city={location.city} />

      <ButlerLocation />
      <ImageGallery></ImageGallery>
      <Footer></Footer>
    </div>
  );
}
