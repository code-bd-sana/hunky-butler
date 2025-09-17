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
    'Professional, friendly butler in signature attire',
    'Greeting and serving drinks to guests',
    'Hosting party games and activities',
    'Perfect photo opportunities to capture the night'
  ]
  return (
    <div>

      <ServiceBanner
        heading={"Hire Buff Butlers for an unforgettable party experience"}
        subTitle={"Fun, cheeky, and professional hosts to keep your guests entertained."}
        image={bannerImg}

      />
      <BookNowSection

        text={"“Buff Butlers are the ultimate party hosts adding charm, laughter, and cheeky fun to your event. Whether it’s a hen do, birthday, or girls’ night, our butlers will greet guests, serve drinks, and host games all with a playful twist.”"}

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
