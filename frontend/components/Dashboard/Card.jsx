import React from "react";

const Card = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-20">
      {/* Total Bookings */}
      <div className="text-white rounded-3xl w-full h-[220px] shadow-md flex flex-col justify-center px-10 bg-[#68A024] space-y-6">
        <h3 className="text-xl font-medium">Total Bookings (This Month)</h3>
        <p className="text-5xl">142</p>
        <p className="text-lg">Updated 1 min ago</p>
      </div>

      {/* Active Performers */}
      <div className=" text-white rounded-3xl w-full h-[220px] shadow-md flex flex-col justify-center px-10 bg-[#2439A0] space-y-6">
        <h3 className="text-xl font-medium">Active Performers</h3>
        <p className="text-5xl">60</p>
        <p className="text-lg">Updated 1 min ago</p>
      </div>

      {/* Pending Payouts */}
      <div className="bg-[#A02426] text-white rounded-3xl w-full h-[220px] shadow-md flex flex-col justify-center px-10 space-y-6">
        <h3 className="text-xl font-medium">Pending Payouts</h3>
        <p className="text-5xl">£290.00</p>
        <p className="text-lg">Updated 1 min ago</p>
      </div>

      {/* Revenue */}
      <div className="bg-[#24A079] text-white rounded-3xl w-full h-[220px] shadow-md flex flex-col justify-center px-10 space-y-6">
        <h3 className="text-xl font-medium">Revenue (This Month)</h3>
        <p className="text-5xl">£290.00</p>
        <p className="text-lg">Updated 1 min ago</p>
      </div>
    </div>
  );
};

export default Card;
