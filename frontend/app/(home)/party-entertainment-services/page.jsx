"use client";
import React from "react";
import bannerImg from "@/public/images/services/ourservice.jpeg";
import ALLServices from "@/components/AllServices";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import HomeMarque from "@/components/homepage/HomeMarque";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import Footer from "@/components/homepage/Footer";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import ImageGallery from "@/components/about/ImageGallery";
import { store } from "@/store/store";
import { Provider } from "react-redux";

export default function page() {
  return (
    <>
      <ServAndAboutBanner
        image={bannerImg}
        service={"Service"}
        title={"Party Entertainment Services Across the UK"}
        description={
          "Discover our full range of cheeky, classy, and professional entertainment. Instant pricing, trusted entertainers, and unforgettable party experiences in Liverpool, Manchester, London, Birmingham & beyond."
        }
      ></ServAndAboutBanner>
      <Provider store={store}>
        <ALLServices />
      </Provider>
      <WhyBookSection />
      <HowItWorkSection />
      <HomeMarque />
      <ReviewSection />
      <ImageGallery />
      <Footer />
    </>
  );
}
