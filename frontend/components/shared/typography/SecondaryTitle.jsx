import React from 'react'

export default function SecondaryTitle({text1, text2}) {
  return (
   <h4 className='text-[#141414] text-5xl leading-snug text-center max-w-4xl mx-auto font-medium '>

          {text1} <span className='text-[#FF006A]'>{text2}</span>
        </h4>
  )
}
