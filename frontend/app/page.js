import AboutSection from "@/components/homepage/AboutSection";
import HomeMarque from "@/components/homepage/HomeMarque";
import MostPopulerParty from "@/components/homepage/MostPopulerParty";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import Navbar from "@/components/shared/Navbar";
import ServiceBanner from "@/components/shared/ServiceBanner";

export default function page() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar></Navbar>
      <ServiceBanner></ServiceBanner>
      <MostPopulerParty/>
      <HomeMarque/>
      <AboutSection/>
      <HowItWorkSection/>
      <WhyBookSection/>
      <ReviewSection/>
    </div>
  );
}

