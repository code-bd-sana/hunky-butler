
import UserCustomer from '@/components/Dashboard/UsersCardForAdmin/UserCustomer'
import CustomersList from '@/components/Dashboard/UsersTableForAdmin/CustomersList'
import React from 'react'

export default function page() {
  return (
    <div>
        <UserCustomer></UserCustomer>
        <CustomersList></CustomersList>
    </div>
  )
}
