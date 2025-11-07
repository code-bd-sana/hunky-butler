'use client'
import CustomerCard from "@/components/Dashboard/CustomerCard/CustomerCard";
import CustomerUpcomingBooking from "@/components/customerDashboard/CustomerUpcomingBooking";
import NextBooking from "@/components/customerDashboard/NextBooking";

export default function CustomerDashboard() {
  return (
    <>
      <CustomerCard />
      <NextBooking></NextBooking>
      <div className="mt-5">
        <CustomerUpcomingBooking></CustomerUpcomingBooking>
      </div>
    </>
  );
}
