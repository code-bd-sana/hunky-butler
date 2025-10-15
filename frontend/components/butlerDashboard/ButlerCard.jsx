'use client'
import { useGetButlerPersonalOverviewQuery } from "@/features/booking";
import { useSession } from "next-auth/react";
import React from "react";

const ButlerCard = () => {

      const {data:user, status} = useSession();

      if(status === 'loading'){
        return <p>Loading...</p>
      }
   
    
      const id = user?.user?.id;
        const {data, loading, error} = useGetButlerPersonalOverviewQuery(id);

 


  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#A02430] text-white p-6 pt-8 rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl capitalize font-medium">Total booking completed</h2>

        <p className="text-5xl font-bold">{data?.totalBookingCompleted}</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#2439A0] text-white p-6  pt-8  rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl capitalize font-medium">Earnings this month</h2>

        <p className="text-5xl font-bold">{data?.totalEarningThisMonth}</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>
      <div className="bg-[#24A079] text-white p-6  pt-8  rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl capitalize font-medium">Wallet Balance</h2>

        <p className="text-5xl font-bold">{data?.totalEarningThisMonth}</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>
    </div>
  );
};

export default ButlerCard;
