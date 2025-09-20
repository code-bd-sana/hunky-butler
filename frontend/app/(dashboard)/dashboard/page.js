"use client";
import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import React, { useState } from "react";

import Sidebar from "@/components/Dashboard/Sidebar/Sidebar";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
const DashboardHome = () => {
  return (
    <>
      <AdminCard />
      <Booking />
    </>
  );
};

export default DashboardHome;
