import React from 'react'
import image from '@/public/images/services/whybook2.png'
import Image from 'next/image'
import SubTitle from '../shared/typography/SubTitle'
import icon1 from '@/public/icons/services/whybook.png'
import icon2 from '@/public/icons/services/whybook2.png'
import icon3 from '@/public/icons/services/whybook3.png'
import icon4 from '@/public/icons/services/whybook4.png'
import bg from '@/public/images/services/bg3.png'
import Link from 'next/link'
import SecondaryTitle from '../shared/typography/SecondaryTitle'

export default function WhyBookSection() {
  return (
    <div className='bg-[#F6F4F5] relative overflow-hidden'>
      <div className='flex flex-col-reverse md:flex-row pb-10 md:pb-16 gap-8 md:gap-14 max-w-7xl mx-auto px-4 md:px-6 lg:px-0 pt-8 md:pt-12'>

        <section className='flex-1'>
          <Image alt='img' src={image} className='w-full h-auto rounded-lg' />
        </section>

        <section className='flex-1'>
          <SecondaryTitle text1={'Why Choose Hunky Butler Service'}/>
          <SubTitle text={'From buff butlers to cocktail masterclasses, we’ve built our reputation on delivering fun, reliable, and professional entertainment. With thousands of bookings and hundreds of reviews, we’re trusted by party planners across the UK. Our entertainers bring a balance of cheeky charm and professionalism, making every event unforgettable.'} />

          {/* Benefits section with icons and text */}
          <div className='mt-8 md:mt-12 space-y-4 md:space-y-6'>
            <div className='flex items-start gap-3 md:gap-4'>
              <div className='min-w-[24px] md:min-w-[32px] mt-1'>
                <Image alt='icon' src={icon1} className='w-6 h-6 md:w-8 md:h-8' />
              </div>
              <p className='text-base md:text-2xl tracking-[-0.01em] text-[#292929]'>Instant, Transparent Pricing. (No Hidden Fees)</p>
            </div>
            <div className='flex items-start gap-3 md:gap-4'>
              <div className='min-w-[24px] md:min-w-[32px] mt-1'>
                <Image alt='icon' src={icon2} className='w-6 h-6 md:w-8 md:h-8' />
              </div>
              <p className='text-base md:text-2xl tracking-[-0.01em] text-[#292929]'>Verified & Insured Staff.</p>
            </div>
            <div className='flex items-start gap-3 md:gap-4'>
              <div className='min-w-[24px] md:min-w-[32px] mt-1'>
                <Image alt='icon' src={icon3} className='w-6 h-6 md:w-8 md:h-8' />
              </div>
              <p className='text-base md:text-2xl tracking-[-0.01em] text-[#292929]'>Flexible Cancellation Policy.</p>
            </div>
            <div className='flex items-start gap-3 md:gap-4'>
              <div className='min-w-[24px] md:min-w-[32px] mt-1'>
                <Image alt='icon' src={icon4} className='w-6 h-6 md:w-8 md:h-8' />
              </div>
              <p className='text-base md:text-2xl tracking-[-0.01em] text-[#292929]'>24/7 Support For Your Event Day</p>
            </div>
          </div>

          <Link href={'/'}>
            <button className='btn-secondary mt-8 md:mt-12 text-sm md:text-base px-6 py-3 md:px-8 md:py-4'>
              Try a 30-second quote now
            </button>
          </Link>
        </section>
      </div>

      <div className='absolute top-0 left-0 overflow-hidden'>
        <Image alt='background' src={bg} className='min-w-screen opacity-30' />
      </div>
    </div>
  )
}