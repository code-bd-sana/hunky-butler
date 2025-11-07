import Footer from "@/components/homepage/Footer";
import Frequently from "@/components/homepage/Frequently";
import HomeMarque from "@/components/homepage/HomeMarque";
import AboutHunky from "@/components/Location/AboutHunky";
import ButlerLocation from "@/components/Location/ButlerLocation";
import FaqLocation from "@/components/Location/FaqLocation";
import LocationBanner from "@/components/Location/LocationBanner";
import Operate from "@/components/Location/Operate";
import PerfectForAll from "@/components/Location/PerfectForAll";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import Banner from "@/components/shared/Banner";
import MainTitle from "@/components/shared/typography/MainTitle";
import SubTitle from "@/components/shared/typography/SubTitle";
import React from "react";
import img from "@/public/location/scotland.png";

const Locations = () => {
  return (
    <div>
      {/* <LocationBanner></LocationBanner> */}
      <Banner
        image={img}
        service={"Location"}
        title={"Hunky Butler Service in Scotland"}
      />
      {/* <AboutHunky></AboutHunky> */}
      <PerfectForAll />
      <Frequently />
      <FaqLocation />
      <ReviewSection />
      <Footer></Footer>
    </div>
  );
};

export default Locations;
