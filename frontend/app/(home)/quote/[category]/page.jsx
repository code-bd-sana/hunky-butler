'use client'
import SecondStep from '@/components/quote/SecondStep'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

export default function page() {
  return (
    <div>

     <SessionProvider>
         <SecondStep/>
     </SessionProvider>
    </div>
  )
}
