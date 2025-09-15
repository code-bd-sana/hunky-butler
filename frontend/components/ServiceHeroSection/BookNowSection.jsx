import React from 'react'
import image from '@/public/images/booknow.png'
import icon from '@/public/icons/arowright.png'
import Image from 'next/image'
import MainTitle from '../shared/typography/MainTitle'
import bg from '@/public/images/services/bg3.png'

export default function BookNowSection() {
  return (
<div className='relative'>
        <div className='max-w-7xl  mx-auto container md:px-8 lg:px-0 py-16'>


<p className='text-3xl  italic  leading-normal text-center capitalize text-[#292929);
]'>
    Our buff butlers are more than just eye-candy – they’re charming, cheeky, and the perfect hosts for hen parties, birthdays, or girls’ nights. They’ll serve drinks, host party games, and keep your guests laughing all night.
</p>
<div className='md:flex items-center  px-4 md:px-0 gap-[56px] mt-24'>

    <section className='flex-1'>

<MainTitle text={'What’s Included When You Book a Buff Butler'}/>

<div className='mt-8 space-y-3'>


    <div className='flex items-center gap-4 '>     
        
        
         <Image alt='icon' src={icon}/> <p className='text-[#333333);
]'>Professional, friendly butler in signature apron & cuffs</p> 


 </div>
    <div className='flex items-center gap-4 '>     
        
        
         <Image alt='icon' src={icon}/> <p className='text-[#333333);
]'>Drinks service & guest hosting</p> 


 </div>
    <div className='flex items-center gap-4 '>     
        
        
         <Image alt='icon' src={icon}/> <p className='text-[#333333);
]'>Cheeky party games and fun activities</p> 


 </div>
    <div className='flex items-center gap-4 '>     
        
        
         <Image alt='icon' src={icon}/> <p className='text-[#333333);
]'>Perfect photo opportunities to capture the night</p> 


 </div>


</div>

{/* button */}

<button className='btn-primary mt-16'>  Book Now </button>

    </section>



    <section className='flex-1 mt-4 md:mt-0'>


        <Image alt='image' src={image}/>
    </section>
</div>
   <div className='absolute top-0 left-0'>   <Image alt='img' src={bg}/> </div>
    </div>
</div>
  )
}
