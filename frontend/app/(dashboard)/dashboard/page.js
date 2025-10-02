"use client";

import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import ButlerBooking from "@/components/Dashboard/Booking/ButlerBooking";
import CustomerBooking from "@/components/Dashboard/Booking/CustomerBooking";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { useSession } from "next-auth/react";


const DashboardHome = () => {

  const {data} = useSession();

  const usrRole = data?.user?.role;
  return (
    <>
      <DashNav />
      <AdminCard />
{
  usrRole  === "admin" ?       <Booking /> : usrRole === 'butler' ? <ButlerBooking/> : <CustomerBooking/>
}
    </>
  );
};

export default DashboardHome;
