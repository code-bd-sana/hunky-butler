import Banner from "@/components/shared/Banner";
import React from "react";
import bannerImg from "@/public/images/services/ourservice.jpeg";
import ALLServices from "@/components/AllServices";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import HomeMarque from "@/components/homepage/HomeMarque";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import Footer from "@/components/homepage/Footer";

export default function page() {
  return (
    <>
      <Banner
        image={bannerImg}
        service={"Service"}
        title={"Our Services"}
        description={
          "Discover unforgettable party experiences with Buff Butlers, Life Drawing, Cocktail Masterclasses, and more. Each service is designed to entertain, engage, and leave your guests talking long after the event ends."
        }
      ></Banner>
      <ALLServices></ALLServices>
      <HowItWorkSection></HowItWorkSection>
      <HomeMarque />
      <ReviewSection />
      <Footer></Footer>
    </>
  );
}
