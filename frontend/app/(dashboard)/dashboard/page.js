"use client";

import ButlerCard from "@/components/butlerDashboard/ButlerCard";
import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import ButlerBooking from "@/components/Dashboard/Booking/ButlerBooking";
import CustomerBooking from "@/components/Dashboard/Booking/CustomerBooking";
import CustomerCard from "@/components/Dashboard/CustomerCard/CustomerCard";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { useSession } from "next-auth/react";


const DashboardHome = () => {

  const {data} = useSession();

  const usrRole = data?.user?.role;
  return (
    <div>
      <DashNav />

      {
  usrRole  === "admin" ?       <AdminCard /> : usrRole === 'butler' ? <ButlerCard /> : <CustomerCard/>
}
     
{
  usrRole  === "admin" ?       <Booking /> : usrRole === 'butler' ? <ButlerBooking/> : <CustomerBooking/>
}
    </div>
  );
};

export default DashboardHome;
