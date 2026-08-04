import React from 'react'

export default function SecondaryTitle({text1, text2, as = 'h4'}) {
  const Heading = as;
  return (
      <div>
    <Heading className='text-[#141414] text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug  max-w-5xl mx-auto font-medium '>
          {text1} <span className='text-[#FF006A] italic'>{text2}</span>
        </Heading>
 </div>
  )
}
