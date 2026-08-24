import BookNowSection from '@/components/ServiceHeroSection/BookNowSection'
import HowItWorkSection from '@/components/ServiceHeroSection/HowItWorkSection'
import ReviewSection from '@/components/ServiceHeroSection/ReviewSection'
import WhyBookSection from '@/components/ServiceHeroSection/WhyBookSection'
import Navbar from '@/components/shared/Navbar'
import ServiceBanner from '@/components/shared/ServiceBanner'
import bannerImg from '@/public/images/services/banner3.png'
import image from '@/public/images/services/lifeDrawing.png'
// import bannerImg from '@/public/images/services/banner2.png'
// import bannerImg from '@/public/images/services/banner3.png'
import React from 'react'
import { getGoogleReviews } from "@/lib/googleReviews";

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Life Drawing Classes for Hen Parties | Hunky Butler Service",
  description:
    "Add a creative twist to your hen do with a life drawing class led by a professional model. Fun, guided sessions across the UK — keepsake drawings included.",
  alternates: { canonical: SITE_URL + "/life-drawing" },
  openGraph: {
    title: "Life Drawing Classes for Hen Parties | Hunky Butler Service",
    description:
      "Add a creative twist to your hen do with a life drawing class led by a professional model across the UK.",
    url: SITE_URL + "/life-drawing",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Drawing Classes for Hen Parties | Hunky Butler Service",
    description:
      "Add a creative twist to your hen do with a life drawing class led by a professional model across the UK.",
    images: [SITE_URL + "/logo.png"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Life Drawing Class",
  "name": "Life Drawing Classes for Hen Parties",
  "url": SITE_URL + "/life-drawing",
  "description":
    "Guided life drawing classes led by a professional model, perfect for hen parties, birthdays and creative celebrations across the UK.",
  "provider": {
    "@type": "EntertainmentBusiness",
    "name": "Hunky Butler Service",
    "url": SITE_URL,
  },
  "areaServed": "GB",
};

// Breadcrumb so search results show Home > Life Drawing instead of a bare URL.
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "Life Drawing", "item": SITE_URL + "/life-drawing" },
  ],
};

export default async function page() {
  // Fetched here so reviews are in the server HTML rather than appearing
  // after hydration. Null on failure, which makes ReviewSection fall back.
  const reviewData = await getGoogleReviews();



  const bulletPoints = [
    'Professional model & host',
    'All art supplies provided (paper, pencils, etc.)',
    'Fun games & challenges during the session',
    'Keepsake drawings for your group to take home'
  ]
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

<ServiceBanner
heading={"Life Drawing Classes with a Fun Twist"}
subTitle={"Unleash your creativity with a professional model and guided session."}
image={bannerImg}

/>
<BookNowSection

text={"Life Drawing is the perfect mix of cheeky entertainment and artistic fun. Guided by a friendly instructor with a live model, your group will laugh, sketch, and bond over an experience unlike any other. Ideal for hen parties, birthdays, and creative celebrations."}

image={image}
bulletPoints={bulletPoints}
/>
<HowItWorkSection

text1={"Enter postcode, date, and duration, Get instant pricing."}
text2={"Choose your preferred butler & confirm."}
text3={"Enjoy a guided life drawing session at your venue."}
/>
<WhyBookSection/>
<ReviewSection initialData={reviewData} />

    </div>
  )
}
