import BookNowSection from '@/components/ServiceHeroSection/BookNowSection'
import HowItWorkSection from '@/components/ServiceHeroSection/HowItWorkSection'
import ReviewSection from '@/components/ServiceHeroSection/ReviewSection'
import WhyBookSection from '@/components/ServiceHeroSection/WhyBookSection'
import Navbar from '@/components/shared/Navbar'
import ServiceBanner from '@/components/shared/ServiceBanner'
import bannerImg from '@/public/images/services/banner2.png'
import image from '@/public/images/services/coctail.png'
// import bannerImg from '@/public/images/services/banner2.png'
// import bannerImg from '@/public/images/services/banner3.png'
import React from 'react'
import { getGoogleReviews } from "@/lib/googleReviews";

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Cocktail Masterclasses for Hen Parties & Events | Hunky Butler Service",
  description:
    "Book a hands-on cocktail masterclass led by a professional mixologist. Perfect for hen parties, birthdays and team nights out across the UK. Get instant pricing.",
  alternates: { canonical: SITE_URL + "/cocktail" },
  openGraph: {
    title: "Cocktail Masterclasses for Hen Parties | Hunky Butler Service",
    description:
      "Book a hands-on cocktail masterclass led by a professional mixologist across the UK.",
    url: SITE_URL + "/cocktail",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocktail Masterclasses for Hen Parties | Hunky Butler Service",
    description:
      "Book a hands-on cocktail masterclass led by a professional mixologist across the UK.",
    images: [SITE_URL + "/logo.png"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Cocktail Masterclass",
  "name": "Cocktail Masterclasses for Hen Parties & Events",
  "url": SITE_URL + "/cocktail",
  "description":
    "Hands-on cocktail masterclasses led by a professional mixologist, ideal for hen parties, birthdays and team nights out across the UK.",
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
    'Professional bartender & host',
    'All ingredients, tools, and glassware provided',
    'Hands-on cocktail making for each guest',
    'Fun games, tastings & challenges'
  ]
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

<ServiceBanner
heading={"Cocktail Masterclasses for Parties & Events"}
subTitle={"Shake, stir, and sip with your own professional mixologist."}
image={bannerImg}

/>
<BookNowSection

text={"Bring the bar to your party with a Cocktail Masterclass led by an expert mixologist. Perfect for hen dos, birthdays, or team nights, you’ll learn how to create and taste—delicious cocktails while enjoying fun challenges with your group."}

image={image}
bulletPoints={bulletPoints}
/>
<HowItWorkSection

text1={"Enter postcode, date, and duration, Get instant pricing."}
text2={"Choose your preferred butler & confirm."}
text3={"Learn, laugh, and drink with your mixologist."}
/>
<WhyBookSection/>
<ReviewSection initialData={reviewData} />

    </div>
  )
}
