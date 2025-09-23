import ButlerCard from "@/components/butlerDashboard/ButlerCard";
import ButlerUpcomingBooking from "@/components/butlerDashboard/ButlerUpcomingBooking";
import NextService from "@/components/butlerDashboard/NextService";
import React from "react";

const page = () => {
  return (
    <div>
      <ButlerCard></ButlerCard>
      <NextService></NextService>
      <div className="mt-10">
        <ButlerUpcomingBooking></ButlerUpcomingBooking>
      </div>
    </div>
  );
};

export default page;
