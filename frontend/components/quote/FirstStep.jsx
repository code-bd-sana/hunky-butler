'use client'
import Image from "next/image";
import React from "react";
import image from "@/public/quote/bg.png";
import icon1 from "@/public/quote/icon1.png";
import icon2 from "@/public/quote/icon2.png";
import icon3 from "@/public/quote/icon3.png";
import icon4 from "@/public/quote/icon4.png";
import Link from "next/link";
import { useGetServicesQuery } from "@/features/services/servicesApi";

// Map service names to icons since icons aren't in API
const serviceIcons = {
  "Buff Butlers": icon1,
  "Life Drawing": icon2,
  "Cocktail Masterclasses": icon3,
  "Strippers": icon4,
};

// Fallback icon if service name doesn't match
const defaultIcon = icon1;

export default function FirstStep() {
  const { data, isLoading, error } = useGetServicesQuery();

  if (isLoading) {
    return (
      <div
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
        }}
        className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
      >
        <div className="relative z-10 flex flex-col items-center justify-end pt-40 pb-10 text-center h-full">
          <h4 className="text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-12">
            What service would you like to book?
          </h4>

          {/* Loading Skeleton */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-24 gap-6 w-full max-w-6xl px-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-2xl bg-[#46434362] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg h-64 animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-32 mt-6"></div>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
        }}
        className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
      >
        <div className="relative z-10 flex flex-col items-center justify-center pt-40 pb-10 text-center h-full">
          <p className="text-2xl text-white">Failed to load services. Please try again.</p>
        </div>
      </div>
    );
  }

  console.log(data, "service data");

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
    >
      <div className="relative z-10 flex flex-col items-center justify-end pt-40 pb-10 text-center h-full">
        <h4 className="text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-12">
          What service would you like to book?
        </h4>

        {/* Responsive grid for equal cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-24 gap-6 w-full max-w-6xl px-6">
          {data?.map((service, idx) => (
            <Link 
              href={`quote/${service.slug}`}
              key={service._id || idx}
              className="flex flex-col items-center justify-center rounded-2xl bg-[#46434362] cursor-pointer backdrop-blur-md backdrop-saturate-15 hover:border-2 hover:bg-[#47001E66] hover:border-[#FF3388] border border-white/20 shadow-lg transition-transform h-64"
            >
              <Image
                alt={service.name}
                src={serviceIcons[service.name] || defaultIcon}
                className="mx-auto"
                width={64}
                height={64}
              />
              <h4 className="text-2xl font-medium text-white mt-6">
                {service.name}
              </h4>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}