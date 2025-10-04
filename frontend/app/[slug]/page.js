import locations from "@/app/locations/locations.json";
import ImageGallery from "@/components/about/ImageGallery";
import Footer from "@/components/homepage/Footer";
import BuffButlersEvents from "@/components/Location/BuffButtlersEvents";
import ButlerLocation from "@/components/Location/ButlerLocation";
import LocationDynamicBanner from "@/components/Location/LocationDynamicBanner";
import WhatsIncluede from "@/components/Location/WhatsIncluede";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default function LocationPage({ params }) {
  const location = locations.find((loc) => loc.slug === params.slug);

  if (!location) {
    return <div className="p-8 text-center">Location not found</div>;
  }

  return (
    <div>
      <Navbar></Navbar>
      <LocationDynamicBanner
        image={location.image}
        title={location.name}
        tagline={location.tagline}
        description={location.description}
      />

      {/* Content section */}
      <WhatsIncluede city={location.city} />
      <BuffButlersEvents city={location.city} />

      <ButlerLocation />
      <ImageGallery></ImageGallery>
      <Footer></Footer>
    </div>
  );
}
