"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ButlerCard from "@/components/butlerDashboard/ButlerCard";
import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import ButlerBooking from "@/components/Dashboard/Booking/ButlerBooking";
import CustomerBooking from "@/components/Dashboard/Booking/CustomerBooking";
import CustomerCard from "@/components/Dashboard/CustomerCard/CustomerCard";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { useGetAllUserQuery } from "@/features/auth";
import { useSession } from "next-auth/react";


const DashboardHome = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: user, isLoading, error } = useGetAllUserQuery();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-gray-500 font-medium animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  // Default to customer role if no session/role is found
  const usrRole = session?.user?.role || "customer";
  
  return (
    <div className="overflow-hidden">
      <DashNav />

      {
        usrRole === "admin" ? <AdminCard /> : usrRole === 'butler' ? <ButlerCard /> : <CustomerCard />
      }
     
      {
        usrRole === "admin" ? <Booking /> : usrRole === 'butler' ? <ButlerBooking /> : <CustomerBooking />
      }
    </div>
  );
};

export default DashboardHome;
