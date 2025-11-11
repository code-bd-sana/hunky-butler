"use client";
import React, { Suspense } from "react";
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
import img from "@/public/location/scotland.png";
import { useParams, useSearchParams } from "next/navigation";
import { useGetLocationBySlugQuery } from "@/features/location";

function LocationDetailsContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("serviceSlug");
  const serviceName = serviceSlug.replace(/-/g, " ")

  console.log("Service Slug:", serviceSlug);

  const { data, isLoading } = useGetLocationBySlugQuery(slug);
  console.log(data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Banner
        banner={data?.banner}
        image={data?.image}
        service={"Location"}
        title={`${serviceName} in ${data?.city}`}
        description={`Planning a party that stands out? Our ${serviceName} in Dublin bring charm, laughter, and sophistication to any occasion. Perfect for hen parties, birthdays, or private gatherings, ${serviceName} know how to keep the energy high and every guest entertained. They’ll welcome guests, serve drinks, lead fun games, and ensure everyone feels relaxed and included. Each member of our ${serviceName}  team is professional, friendly, and focused on creating a memorable experience from start to finish. Their confident presence and sense of humor make every celebration unforgettable. Whether you want a night filled with elegance or just light-hearted fun, our ${serviceName}  guarantee a perfect balance of both. Book our ${serviceName}  in Dublin today and enjoy an event full of smiles, laughter, and lasting memories that your friends will be talking about long after the party ends.`}
      />
      <PerfectForAll city={data?.city} slug={serviceSlug} serviceName={serviceName}/>
      <FaqLocation location={data?.city} />
      <ReviewSection />
      <div className="pt-40 md:pt-0 mt-[300px]">
        <Footer />
      </div>
    </div>
  );
}

export default function LocationDetails() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[80vh]">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      }
    >
      <LocationDetailsContent />
    </Suspense>
  );
}
