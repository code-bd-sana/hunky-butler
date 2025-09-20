import React from "react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

const AdminCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#68A024] text-white p-6 pt-8 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Bookings (This Month)</h2>

        <p className="text-5xl font-bold">142</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#2439A0] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Active Performers</h2>

        <p className="text-5xl font-bold">60</p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#A02426] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Pending Payouts</h2>

        <p className="text-5xl font-bold">£290.00</p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#24A079] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Revenue (This Month)</h2>

        <p className="text-5xl font-bold">£290.00</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>
    </div>
  );
};

export default AdminCard;
