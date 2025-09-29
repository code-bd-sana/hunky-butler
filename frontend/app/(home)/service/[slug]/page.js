import ImageGallery from "@/components/about/ImageGallery";
import Footer from "@/components/homepage/Footer";
import BookNowSection from "@/components/ServiceHeroSection/BookNowSection";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import ServiceBanner from "@/components/shared/ServiceBanner";
import { base_url } from "@/utils/utils";
import React from "react";

export default async function ServiceDetails({ params }) {
  console.log("Server params:", params);
  const { slug } = params;

  const res = await fetch(`${base_url}/service/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch service details");
  }
  const service = await res.json();
  console.log(service);

  return (
    <div>
      <ServiceBanner
        heading={"Buff Butlers for Hire – UK’s Top Hen Party & Event Hosts"}
        subTitle={
          "Fun, cheeky and professional butlers to keep your guests entertained, wherever you’re celebrating."
        }
        image={service.banner}
      />
      <BookNowSection
        name={service.name}
        included={service.included}
        banner={service.banner}
        // bulletPoints={bulletPoints}
      />
      <HowItWorkSection
        text={"Enter postcode, date, and duration, Get instant pricing."}
        text1={"Choose your preferred butler & confirm."}
        text3={"Enjoy a fun, stress-free night with your Buff Butler."}
      />
      <WhyBookSection />
      <ReviewSection />
      <ImageGallery />
      <Footer />
    </div>
  );
}
