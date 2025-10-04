import CustomerTransactions from '@/components/customerDashboard/CustomerTransactions'
import CustomerPaymentCard from '@/components/Dashboard/CustomerCard/CustomerPaymentCard'
import DashNav from '@/components/Dashboard/DashNav/DashNav'
import React from 'react'

export default function page() {
  return (
    <div>
            <DashNav />
        <CustomerPaymentCard></CustomerPaymentCard>
        <CustomerTransactions></CustomerTransactions>
    </div>
  )
}
