import HomeBanner from "@/components/homepage/HomeBanner";
import TrustStrip from "@/components/homepage/TrustStrip";
import Navbar from "@/components/shared/Navbar";


export default function page() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar></Navbar>
      <HomeBanner></HomeBanner>
      <TrustStrip></TrustStrip>
    </div>
  );
}
