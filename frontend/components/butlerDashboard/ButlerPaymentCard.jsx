'use client'
import { useGetButlerPaymentHistoryQuery } from "@/features/booking";
import { useSession } from "next-auth/react";
import React from "react";

const ButlerPaymentCard = () => {

  const {data} = useSession();
  const id = data?.user?.id;
  const {data:earning, isLoading, error} = useGetButlerPaymentHistoryQuery({id});


  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#2439A0] text-white p-6 pt-8 rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl capitalize font-medium">
          Earnings This week
        </h2>

        <p className="text-5xl font-bold">{earning?.earnings?.weekly?.amount}</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#A06224] text-white p-6  pt-8  rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl capitalize font-medium">Earnings this month</h2>

        <p className="text-5xl font-bold">{earning?.earnings?.monthly?.amount}</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>
      <div className="bg-[#24A079] text-white p-6  pt-8  rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl capitalize font-medium">Earnings all-time</h2>

        <p className="text-5xl font-bold">{earning?.earnings?.total?.amount}</p>
        <span className="text-lg opacity-90">Updated 1 min ago </span>
      </div>
    </div>
  );
};

export default ButlerPaymentCard;
