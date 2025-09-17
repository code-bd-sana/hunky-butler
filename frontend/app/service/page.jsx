import React from "react";
import bannerImg from "@/public/images/services/ourservice.jpeg";
import ALLServices from "@/components/AllServices";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import HomeMarque from "@/components/homepage/HomeMarque";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import Footer from "@/components/homepage/Footer";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";

export default function page() {
  return (
    <>
      <ServAndAboutBanner
        image={bannerImg}
        service={"Service"}
        title={"Party Entertainment Services Across the UK"}
        description={
          "Looking to make your celebration unforgettable? Hunky Butler Service provides professional and cheeky party entertainment services across the UK. From Buff Butlers and Cocktail Masterclasses to Life Drawing Classes and Male Strippers, we help turn birthdays, hen parties, and special events into unforgettable experiences. With transparent pricing, verified staff, and thousands of 5-star reviews, booking your entertainment has never been easier."
        }
      ></ServAndAboutBanner>
      <ALLServices></ALLServices>
      <HowItWorkSection></HowItWorkSection>
      <HomeMarque />
      <ReviewSection />
      <Footer></Footer>
    </>
  );
}
