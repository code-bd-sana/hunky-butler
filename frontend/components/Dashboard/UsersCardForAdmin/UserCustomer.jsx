import React from "react";

export default function UserCustomer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#6A24A0] text-white p-6 pt-8 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Total Customers</h2>

        <p className="text-5xl font-bold">12,234</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#6A24A0] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Active Bookings</h2>

        <p className="text-5xl font-bold">123</p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#A06224] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">New Signups This Month</h2>

        <p className="text-5xl font-bold">12</p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>
    </div>
  );
}
