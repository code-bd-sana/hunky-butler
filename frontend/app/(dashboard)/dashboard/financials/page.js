'use client'
import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import FinancialsCard from "@/components/Dashboard/FinancialsCard/FinancialsCard";
import Payouts from "@/components/Dashboard/Payouts/Payouts";
import React, { useState } from "react";

const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
     <DashNav
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
      <FinancialsCard/>
      <Payouts/>
    </>
  );
};

export default page;
