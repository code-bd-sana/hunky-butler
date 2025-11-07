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

  console.log("Service Slug:", serviceSlug);

  const { data, isLoading } = useGetLocationBySlugQuery(slug);

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
        banner={data?.image}
        image={img}
        service={"Location"}
        title={`${serviceSlug} in ${data?.city}`}
      />
      <PerfectForAll city={data?.city} />
      <FaqLocation location={data?.city} />
      <ReviewSection />
      <Footer />
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
