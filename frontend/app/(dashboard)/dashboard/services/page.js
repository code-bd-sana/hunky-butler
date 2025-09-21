'use client'
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import ServiceTable from "@/components/Dashboard/ServicesTable/ServiceTable";
import React, { useState } from "react";

export default function page() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div>
       <DashNav
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
      <ServiceTable></ServiceTable>
    </div>
  );
}
