"use client";
import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import React, { useState } from "react";

import Sidebar from "@/components/Dashboard/Sidebar/Sidebar";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
const DashboardHome = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-10 min-h-screen mt-10 px-2 md:px-6 lg:px-10 bg-[f6f4f5]">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1">
        <DashNav />
        <AdminCard />
        <Booking />
      </div>
    </div>
  );
};

export default DashboardHome;
