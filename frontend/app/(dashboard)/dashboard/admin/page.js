'use client'
import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { useState } from "react";


export default function AdminDashboard() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>

     <DashNav
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

      <AdminCard />
      <Booking />
    </>
  );
}
