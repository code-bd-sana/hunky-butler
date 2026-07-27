import BookNowSection from '@/components/ServiceHeroSection/BookNowSection'
import HowItWorkSection from '@/components/ServiceHeroSection/HowItWorkSection'
import ReviewSection from '@/components/ServiceHeroSection/ReviewSection'
import WhyBookSection from '@/components/ServiceHeroSection/WhyBookSection'
import Navbar from '@/components/shared/Navbar'
import ServiceBanner from '@/components/shared/ServiceBanner'
import bannerImg from '@/public/images/services/banner.png'
import image from '@/public/images/services/stripes.png'
// import bannerImg from '@/public/images/services/banner2.png'
// import bannerImg from '@/public/images/services/banner3.png'
import React from 'react'

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Hire Male Strippers UK | Hen Party Entertainment – Hunky Butler Service",
  description:
    "Book professional, experienced male strippers for hen parties, birthdays and private events across the UK. Customisable performances, fully insured entertainers.",
  alternates: { canonical: SITE_URL + "/strippers" },
  openGraph: {
    title: "Hire Male Strippers UK | Hunky Butler Service",
    description:
      "Book professional, experienced male strippers for hen parties, birthdays and private events across the UK.",
    url: SITE_URL + "/strippers",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Male Strippers UK | Hunky Butler Service",
    description:
      "Book professional, experienced male strippers for hen parties, birthdays and private events across the UK.",
    images: [SITE_URL + "/logo.png"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Male Stripper Hire",
  "name": "Male Strippers for Hire",
  "url": SITE_URL + "/strippers",
  "description":
    "Professional, experienced male strippers for hen parties, birthdays and private events across the UK, with customisable performances and fully insured entertainers.",
  "provider": {
    "@type": "EntertainmentBusiness",
    "name": "Hunky Butler Service",
    "url": SITE_URL,
  },
  "areaServed": "GB",
};

export default function page() {


  const bulletPoints = [
    'Professional male/female performers',
    'Customizable performance styles',
    'Flexible location setups',
    'Fun, safe, and engaging entertainment'
  ]
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

<ServiceBanner
heading={"Hire Professional Strippers for Your Event"}
subTitle={"Unforgettable entertainment from trusted, experienced performers"}
image={bannerImg}

/>
<BookNowSection

text={"Turn up the heat at your party with a professional stripper performance tailored to your group. Whether it’s a hen do, birthday, or private event, our performers guarantee unforgettable entertainment with professionalism and style."}

image={image}
bulletPoints={bulletPoints}
/>
<HowItWorkSection

text1={"Enter postcode, date, and duration, Get instant pricing."}
text2={"Choose your preferred performer."}
text3={"Enjoy a cheeky, unforgettable show."}
/>
<WhyBookSection/>
<ReviewSection/>

    </div>
  )
}
