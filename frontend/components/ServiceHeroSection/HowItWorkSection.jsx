import React from 'react'
import icon1 from '@/public/icons/services/hiwcount.png'
import icon2 from '@/public/icons/services/hiwcount2.png'
import icon3 from '@/public/icons/services/hiwcount3.png'
import icon4 from '@/public/icons/services/hiw.png'
import icon5 from '@/public/icons/services/hiw2.png'
import icon6 from '@/public/icons/services/hiw3.png'
import Image from 'next/image'
import Link from 'next/link'
import MainTitle from '../shared/typography/MainTitle'




export default function HowItWorkSection() {


const data = [
    {
        icon1:icon1,
        icon2: icon4,
        title:'Enter postcode, date, and duration, Get instant pricing.'
    },
    {
        icon1:icon2,
        icon2: icon5,
        title:'Choose your preferred butler & confirm.'
    },
    {
        icon1:icon3,
        icon2: icon6,
        title:'Enjoy a fun, stress-free night with your Buff Butler.'
    }
]

  return (
   <div className='bg-[#F6F4F5] px-6 lg:px-0'>


     <div className=' py-16 max-w-7xl mx-auto '>
       <div>
         <MainTitle text={"How It Works – Booking a Buff Butler is Simple"}/>
        <p className='text-center mt-4 text-[#292929]'>Plan in 3 simple steps</p>

       </div>

{/* card section */}
       <section className='md:flex space-y-3 mx-auto justify-center gap-6  mt-16'>

   {data.map((item, idx) => (
<div
  key={idx}
  className="bg-[#FFFFFF] rounded-2xl h-96 flex-1 flex flex-col p-4 "
>
  {/* icons */}
  <div className="flex items-center gap-4 justify-between ">
    <Image alt="icon" src={item.icon1} />
    <Image alt="icon" src={item.icon2} />
  </div>

  <p className="text-[#141414] font-medium pb-4 text-2xl mt-auto">
    {item.title} 
  </p>
</div>

))}


       </section>
     <Link href={'/'}>
     
       <button className='mt-16 btn-secondary text-center mx-auto flex justify-center'>Try a 30-second quote now</button></Link>

    </div>
   </div>
  )
}
