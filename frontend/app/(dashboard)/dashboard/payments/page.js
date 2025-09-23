import CustomerTransactions from '@/components/customerDashboard/CustomerTransactions'
import CustomerPaymentCard from '@/components/Dashboard/CustomerCard/CustomerPaymentCard'
import React from 'react'

export default function page() {
  return (
    <div>
        <CustomerPaymentCard></CustomerPaymentCard>
        <CustomerTransactions></CustomerTransactions>
    </div>
  )
}
