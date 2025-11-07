'use client'
import ButlerPaymentCard from '@/components/butlerDashboard/ButlerPaymentCard'
import ButlerUpcomingBooking from '@/components/butlerDashboard/ButlerUpcomingBooking'
import CustomerTransactions from '@/components/customerDashboard/CustomerTransactions'
import CustomerPaymentCard from '@/components/Dashboard/CustomerCard/CustomerPaymentCard'
import DashNav from '@/components/Dashboard/DashNav/DashNav'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function Paymentpage() {
  const {data} = useSession();
  const role = data?.user?.role;

  return (
    <div>
            <DashNav />
   {
    role === "butler" ? <ButlerPaymentCard/> : role === "customer"  ?      <CustomerPaymentCard></CustomerPaymentCard>
: <p></p>   }
        
        {
          role === "butler" ? <ButlerUpcomingBooking/> : <CustomerTransactions/>
        }
    </div>
  )
}
