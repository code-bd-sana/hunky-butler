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

export default function page() {


  const bulletPoints = [
    'Professional, friendly butler in signature apron & cuffs',
    'Drinks service & guest hosting',
    'Cheeky party games and fun activities',
    'Perfect photo opportunities to capture the night'
  ]
  return (
    <div>

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
      <ReviewSection />

    </div>
  )
}
