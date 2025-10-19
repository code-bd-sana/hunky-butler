"use client";
import ImageGallery from "@/components/about/ImageGallery";
import BuffLocation from "@/components/BuffLocation/BuffLocation";
import Cocktail from "@/components/cocktail/Cocktail";
import Extra from "@/components/Extra/Extra";
import Footer from "@/components/homepage/Footer";
import Frequently from "@/components/homepage/Frequently";
import KeepTheFun from "@/components/KeepTheFun/KeepTheFun";
import Nationwide from "@/components/Nationwide/Nationwide";
import BookNowSection from "@/components/ServiceHeroSection/BookNowSection";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import ServiceBanner from "@/components/shared/ServiceBanner";
import MainTitle from "@/components/shared/typography/MainTitle";
import SubTitle from "@/components/shared/typography/SubTitle";
import { useGetServiceJoyBanglaQuery } from "@/features/butler";
import { base_url } from "@/utils/utils";
import { useParams } from "next/navigation";
import React from "react";

export default function ServiceDetailspage() {
  const { slug } = useParams();

  const { data } = useGetServiceJoyBanglaQuery(slug);

  // if(loadiing){
  //   return <p>Loading...</p>
  // }
  // if(error){
  //   console.log(error, "ami tomar error")
  // }

  return (
    <div>
      <ServiceBanner
        heading={"Buff Butlers for Hire – UK’s Top Hen Party & Event Hosts"}
        subTitle={
          "Fun, cheeky and professional butlers to keep your guests entertained, wherever you’re celebrating."
        }
        image={data?.banner}
        slug={data?.slug}
      />

      <div className="text-center mb-12 pt-16">
        <MainTitle text={"Hire Buff Butlers for Parties, Hen Dos & Events"} />
        <div className=" max-w-7xl mx-auto mt-4">
          <SubTitle
            text={
              "Our buff butlers are more than just eye-candy — they’re charming, cheeky, and professional hosts who know how to make your night one to remember. Whether you’re planning a hen party in Liverpool, a birthday in Manchester, or a glamorous night out in London, our butlers will greet guests with a smile, serve drinks, host fun party games, and pose for photos. Hiring buff butlers is the perfect way to keep the party alive from start to finish."
            }
          />
        </div>
      </div>
      <BookNowSection
        name={data?.name}
        included={data?.included}
        banner={data?.banner}
        // bulletPoints={bulletPoints}
      />
      <HowItWorkSection
        name={data?.name}
        text={"Enter postcode, date, and duration, Get instant pricing."}
        text1={"Choose your preferred butler & confirm."}
        text3={"Enjoy a fun, stress-free night with your Buff Butler."}
      />
      {/* <WhyBookSection />
      <KeepTheFun />
      <Cocktail />
      <BuffLocation/> */}
      {/* <ReviewSection />
      <Frequently /> */}
      <WhyBookSection />

      {/* <KeepTheFun /> */}
      <Cocktail />
      {/* <BuffLocation name={data?.name} /> */}
      <ReviewSection />
      <Frequently />
      <Nationwide name={data?.name} serviceSlug={slug} />
      <ImageGallery />
      <Footer />
    </div>
  );
}
