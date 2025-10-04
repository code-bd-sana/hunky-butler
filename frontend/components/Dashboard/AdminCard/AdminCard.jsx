import { useGetAdminSummuryQuery } from "@/features/summury";
import React from "react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

const AdminCard = () => {

  const {data, isLoading, error} = useGetAdminSummuryQuery();

  // console.log(data, "Admin summury");

  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#68A024] text-white p-6 pt-8 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Bookings (This Month)</h2>

        <p className="text-5xl font-bold">


          {
            data?.booking || '...'
          }
        </p>
        <span className="text-sm md:text-base lg:text-lg opacity-90">
          Updated 1 min ago
        </span>
      </div>

      <div className="bg-[#2439A0] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Active Performers</h2>

        <p className="text-5xl font-bold">{data?.performer }   {isLoading && <span>...</span>} </p>
        <span className="text-sm md:text-base lg:text-lg  opacity-90">
          Updated 1 min ago
        </span>
      </div>

      <div className="bg-[#A02426] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Pending Payouts</h2>

        <p className="text-5xl font-bold">£{data?.pendingPayout } {isLoading && <span>...</span>}</p>
        <span className="text-sm md:text-base lg:text-lg  opacity-90">
          Updated 1 min ago
        </span>
      </div>

      <div className="bg-[#24A079] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Revenue (This Month)</h2>

        <p className="text-5xl font-bold">£{data?.revenue } {isLoading && <span>...</span>}</p>
        <span className="text-sm md:text-base lg:text-lg opacity-90">
          Updated 1 min ago
        </span>
      </div>
    </div>
  );
};

export default AdminCard;
