import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import FinancialsCard from "@/components/Dashboard/FinancialsCard/FinancialsCard";
import Payouts from "@/components/Dashboard/Payouts/Payouts";
import React from "react";

const page = () => {
  return (
    <>
      <FinancialsCard/>
      <Payouts/>
    </>
  );
};

export default page;
