"use client";
import AboutSection from "@/components/homepage/AboutSection";
import Entertainment from "@/components/homepage/Entertainment";
import Footer from "@/components/homepage/Footer";
import Frequently from "@/components/homepage/Frequently";
import HomeBanner from "@/components/homepage/HomeBanner";
import HomeMarque from "@/components/homepage/HomeMarque";
import MostPopulerParty from "@/components/homepage/MostPopulerParty";
import Planning from "@/components/homepage/Planning";
import HowItWorkSection2 from "@/components/ServiceHeroSection/HowItWorkSection2";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import Navbar from "@/components/shared/Navbar";
import { SessionProvider } from "next-auth/react";

export default function page() {
  return (
    <div className='min-h-screen overfh bg-white'>
      <Navbar />
      <HomeBanner />
      {/* <TrustStrip /> */}
      <MostPopulerParty />
      <HomeMarque />
      <AboutSection />
      <HowItWorkSection2 />
      <WhyBookSection />
      <ReviewSection />
      <Entertainment />
      <Frequently />
      <Planning
        title='Hen Party Planning Inspirations & Tips'
        description='Not sure where to start? Our blog is full of ideas to make your hen party unique. From cocktail recipes to creative party games, we share expert tips to help you plan the perfect night.'
      />
      <SessionProvider>
        <Footer />
      </SessionProvider>
    </div>
  );
}
