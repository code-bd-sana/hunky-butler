import React from 'react'

export default function MainTitle({text, as = 'h4'}) {
  const Heading = as;
  return (
  


        <div>
            <Heading className='text-[#141414] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-snug  max-w-7xl mx-auto  '>

          {text}
        </Heading>
        </div>
    
  )
}
