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

export default function page() {


  const bulletPoints = [
    'Professional bartender & host',
    'All ingredients, tools, and glassware provided',
    'Hands-on cocktail making for each guest',
    'Fun games, tastings & challenges'
  ]
  return (
    <div>

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
<ReviewSection/>

    </div>
  )
}
