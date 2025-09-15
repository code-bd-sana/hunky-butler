import BookNowSection from '@/components/ServiceHeroSection/BookNowSection'
import HowItWorkSection from '@/components/ServiceHeroSection/HowItWorkSection'
import ReviewSection from '@/components/ServiceHeroSection/ReviewSection'
import WhyBookSection from '@/components/ServiceHeroSection/WhyBookSection'
import Navbar from '@/components/shared/Navbar'
import ServiceBanner from '@/components/shared/ServiceBanner'
import bannerImg from '@/public/images/services/banner2.png'
import image from '@/public/images/services/whybook5.png'
// import bannerImg from '@/public/images/services/banner2.png'
// import bannerImg from '@/public/images/services/banner3.png'
import React from 'react'

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
<HowItWorkSection/>
<WhyBookSection/>
<ReviewSection/>

    </div>
  )
}
