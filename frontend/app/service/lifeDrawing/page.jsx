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

export default function page() {


  const bulletPoints = [
    'Professional model & host',
    'All art supplies provided (paper, pencils, etc.)',
    'Fun games & challenges during the session',
    'Keepsake drawings for your group to take home'
  ]
  return (
    <div>

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
<HowItWorkSection/>
<WhyBookSection/>
<ReviewSection/>

    </div>
  )
}
