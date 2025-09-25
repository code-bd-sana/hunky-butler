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

export default function page() {


  const bulletPoints = [
    'Professional male/female performers',
    'Customizable performance styles',
    'Flexible location setups',
    'Fun, safe, and engaging entertainment'
  ]
  return (
    <div>

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
