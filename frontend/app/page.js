import HomeBanner from "@/components/homepage/HomeBanner";
import TrustStrip from "@/components/homepage/TrustStrip";
import Navbar from "@/components/shared/Navbar";
import AboutSection from "@/components/homepage/AboutSection";
import HomeMarque from "@/components/homepage/HomeMarque";
import MostPopulerParty from "@/components/homepage/MostPopulerParty";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";


export default function page() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <HomeBanner/>
      <TrustStrip/>
      <MostPopulerParty />
      <HomeMarque />
      <AboutSection />
      <HowItWorkSection />
      <WhyBookSection />
      <ReviewSection />
    </div>
  );
}
