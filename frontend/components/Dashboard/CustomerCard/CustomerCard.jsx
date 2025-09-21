import React from "react";

const CustomerCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-[#2439A0] text-white p-6 pt-8 rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Bookings</h2>

        <p className="text-5xl font-bold">60</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#24A079] text-white p-6  pt-8  rounded-[24px] shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Outgoings</h2>

        <p className="text-5xl font-bold">£290.00</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>
    </div>
  );
};

export default CustomerCard;
