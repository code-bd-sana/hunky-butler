'use client'
import { useGetCustomerPaymentHistoryQuery } from "@/features/booking";
import { useGetCustomerSummuryQuery } from "@/features/summury";
import { useSession } from "next-auth/react";
import React from "react";

const CustomerPaymentCard = () => {

  const data = useSession();
  const email = data?.data?.user?.email;
   const { data: session } = useSession();
   
  
    const { data: overview } = useGetCustomerSummuryQuery(email, {
      skip: !email, // <--- important
    });
  


  const {data:payment, isLoading, error } = useGetCustomerPaymentHistoryQuery({email});
  console.log(payment, "ekhane onnorok m payment")
  return ( 
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-[#6A24A0] text-white p-6 pt-8 rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Transaction</h2>

        <p className="text-5xl font-bold">{payment?.count || '..'} </p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#A06224] text-white p-6  pt-8  rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Outgoings</h2>

        <p className="text-5xl font-bold">{overview?.totalOutgoing || '...'}</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>
    </div>
  );
};

export default CustomerPaymentCard;
