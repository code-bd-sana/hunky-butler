'use client'
import { useGetCustomerSummuryQuery } from "@/features/summury";
import { useSession } from "next-auth/react";
import React from "react";

const CustomerCard = () => {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const { data: overview, isLoading } = useGetCustomerSummuryQuery(email, {
    skip: !email, // <--- important
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-[#2439A0] text-white p-6 pt-8 rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Bookings</h2>
        <p className="text-5xl font-bold">
          {overview?.totalBooking ?? 0}
        </p>
        <span className="text-lg opacity-90">
          {isLoading ? "Loading..." : "Updated just now"}
        </span>
      </div>

      <div className="bg-[#24A079] text-white p-6 pt-8 rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Outgoings</h2>
        <p className="text-5xl font-bold">
          £{overview?.totalOutgoing ?? 0}
        </p>
        <span className="text-lg opacity-90">
          {isLoading ? "Loading..." : "Updated just now"}
        </span>
      </div>
    </div>
  );
};

export default CustomerCard;
