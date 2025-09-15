import React from 'react'
import image from '@/public/images/services/whybook.png'
import Image from 'next/image'
import SubTitle from '../shared/typography/SubTitle'
import icon1 from '@/public/icons/services/whybook.png'
import icon2 from '@/public/icons/services/whybook2.png'
import icon3 from '@/public/icons/services/whybook3.png'
import icon4 from '@/public/icons/services/whybook4.png'
import bg from '@/public/images/services/bg3.png'
import Link from 'next/link'

export default function WhyBookSection() {
  return (
    <div className='bg-[#F6F4F5] relative'>
        

<div className='flex flex-col-reverse md:flex-row pb-16  gap-14 max-w-7xl mx-auto px-4 md:px-6 lg:px-0 pt-24 '>

    <section className='flex-1'>
<Image alt='img' src={image}/>


    </section>


    <section className='flex-1'>


    <h4 className='text-[#141414] text-5xl leading-snug max-w-4xl mx-auto font-medium '>

         Why Book With Hunky Butler Service?
        </h4>


<SubTitle text={'From Buff Butlers to Cocktail Masterclasses—transparent pricing, verified staff, anywhere in your postcode.At hunky butler SERV, we believe unforgettable events should be effortless to plan.'}/>



{/* line */}
<div className='mt-12 space-y-6'>

<div className='flex items-center gap-4'>
  <Image alt='icon' src={icon1}/>
  <p className='text-2xl tracking-[-0.01em] text-[#292929]'>Instant, transparent pricing. (no hidden fees)</p>
</div>
<div className='flex items-center gap-4'>
  <Image alt='icon' src={icon2}/>
  <p className='text-2xl tracking-[-0.01em] text-[#292929]'>Verified & insured staff.</p>
</div>
<div className='flex items-center gap-4'>
  <Image alt='icon' src={icon3}/>
  <p className='text-2xl tracking-[-0.01em] text-[#292929]'>Flexible cancellation policy.</p>
</div>
<div className='flex items-center gap-4'>
  <Image alt='icon' src={icon4}/>
  <p className='text-2xl tracking-[-0.01em] text-[#292929]'>24/7 support for your event day5465</p>
</div>

</div>

<Link href={'/'}>
<button className='btn-secondary mt-24'>Try a 30-second quote now</button>
</Link>

    </section>
</div>

    <div className='absolute top-0 left-0'>   <Image alt='img' src={bg}/> </div>
    </div>
  )
}
