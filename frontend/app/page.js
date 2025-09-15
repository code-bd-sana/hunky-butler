import Navbar from "@/components/shared/Navbar";
import ServiceBanner from "@/components/shared/ServiceBanner";

export default function page() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar></Navbar>
      <ServiceBanner></ServiceBanner>
    </div>
  );
}

