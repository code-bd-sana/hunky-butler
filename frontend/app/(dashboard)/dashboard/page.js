"use client";

import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import React, { useState } from "react";

const DashboardHome = () => {
  return (
    <>
      <DashNav />
      <AdminCard />
      <Booking />
    </>
  );
};

export default DashboardHome;
