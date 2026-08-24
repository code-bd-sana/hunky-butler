import BookNowSection from '@/components/ServiceHeroSection/BookNowSection'
import HowItWorkSection from '@/components/ServiceHeroSection/HowItWorkSection'
import ReviewSection from '@/components/ServiceHeroSection/ReviewSection'
import WhyBookSection from '@/components/ServiceHeroSection/WhyBookSection'
import Navbar from '@/components/shared/Navbar'
import ServiceBanner from '@/components/shared/ServiceBanner'
import bannerImg from '@/public/images/services/banner.png'
import image from '@/public/images/booknow2.png'
// import bannerImg from '@/public/images/services/banner2.png'
// import bannerImg from '@/public/images/services/banner3.png'
import React from 'react'
import Frequently from '@/components/homepage/Frequently'
import ImageGallery from '@/components/about/ImageGallery'
import Footer from '@/components/homepage/Footer'
import { getGoogleReviews } from "@/lib/googleReviews";

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Buff Butlers for Hire UK | Hen Party & Event Hosts – Hunky Butler Service",
  description:
    "Hire professional, cheeky buff butlers for hen parties, birthdays and events across the UK. Drinks service, party games and unforgettable photo moments. Get instant pricing.",
  alternates: { canonical: SITE_URL + "/buff-butlers" },
  openGraph: {
    title: "Buff Butlers for Hire UK | Hunky Butler Service",
    description:
      "Hire professional, cheeky buff butlers for hen parties, birthdays and events across the UK. Get instant pricing.",
    url: SITE_URL + "/buff-butlers",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buff Butlers for Hire UK | Hunky Butler Service",
    description:
      "Hire professional, cheeky buff butlers for hen parties, birthdays and events across the UK. Get instant pricing.",
    images: [SITE_URL + "/logo.png"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Buff Butler Hire",
  "name": "Buff Butlers for Hire",
  "url": SITE_URL + "/buff-butlers",
  "description":
    "Professional, cheeky buff butlers for hen parties, birthdays and events across the UK, including drinks service, party games and photo moments.",
  "provider": {
    "@type": "EntertainmentBusiness",
    "name": "Hunky Butler Service",
    "url": SITE_URL,
  },
  "areaServed": "GB",
};

export default async function page() {
  // Fetched here so reviews are in the server HTML rather than appearing
  // after hydration. Null on failure, which makes ReviewSection fall back.
  const reviewData = await getGoogleReviews();



  const bulletPoints = [
    'Professional, friendly butler in signature apron & cuffs',
    'Drinks service & guest hosting',
    'Cheeky party games and fun activities',
    'Perfect photo opportunities to capture the night'
  ]
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <ServiceBanner
        heading={"Buff Butlers for Hire – UK’s Top Hen Party & Event Hosts"}
        subTitle={"Fun, cheeky and professional butlers to keep your guests entertained, wherever you’re celebrating."}
        image={bannerImg}

      />
      <BookNowSection

        text={"Our buff butlers are more than just eye-candy – they’re charming, cheeky, and the perfect hosts for hen parties, birthdays, or girls’ nights. They’ll serve drinks, host party games, and keep your guests laughing all night."}

        image={image}
        bulletPoints={bulletPoints}
      />
      <HowItWorkSection
      text={"Enter postcode, date, and duration, Get instant pricing."}
      text1={"Choose your preferred butler & confirm."}
      text3={"Enjoy a fun, stress-free night with your Buff Butler."}

      />
      <WhyBookSection />
      <ReviewSection initialData={reviewData} />
      <ImageGallery/>
      <Footer/>

    </div>
  )
}
