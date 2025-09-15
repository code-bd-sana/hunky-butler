import BookNowSection from '@/components/ServiceHeroSection/BookNowSection'
import HowItWorkSection from '@/components/ServiceHeroSection/HowItWorkSection'
import ReviewSection from '@/components/ServiceHeroSection/ReviewSection'
import WhyBookSection from '@/components/ServiceHeroSection/WhyBookSection'
import React from 'react'

export default function page() {
  return (
    <div>
      

      <BookNowSection/>
      <HowItWorkSection/>
      <WhyBookSection/>
      <ReviewSection/>
    </div>
  )
}
