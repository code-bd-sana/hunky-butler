import Navbar from "@/components/shared/Navbar";
import ServiceBanner from "@/components/shared/ServiceBanner";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-white">
      <ServiceBanner></ServiceBanner>
      <Navbar></Navbar>
    </div>
  );
}
