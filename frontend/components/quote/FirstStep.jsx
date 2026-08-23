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

/**
 * The quote hero used a 896 KB PNG as a CSS background-image. A CSS background
 * cannot be preloaded by the browser and is never optimised by next/image, so
 * it gated Largest Contentful Paint. Rendering it through next/image with
 * priority lets Next serve a correctly sized WebP and emit a preload hint.
 */
const QuoteBackdrop = () => (
  <>
    <Image
      src={image}
      alt=""
      aria-hidden="true"
      fill
      priority
      sizes="100vw"
      className="object-cover object-center -z-10"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%)",
      }}
    />
  </>
);

// Step indicator component
const StepIndicator = ({ currentStep } ) => {
  const steps = [
    { number: 1, label: "Select Service" },
    { number: 2, label: "Your Information" },
    { number: 3, label: "Event Information" },
    { number: 4, label: "Confirmation" }
  ];

  return (
<div className="flex flex-row justify-center items-start gap-2 sm:gap-0 sm:space-x-4 mb-6 sm:mb-12">
  {steps.map((step, index) => (
    <React.Fragment key={step.number}>
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${
            step.number === currentStep
              ? "bg-[#FF3388] border-[#FF3388] text-white"
              : step.number < currentStep
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-400 text-gray-400"
          } font-semibold text-xs sm:text-base shrink-0`}
        >
          {step.number < currentStep ? "✓" : step.number}
        </div>
        <span
          className={`text-[10px] leading-tight sm:text-sm mt-1 sm:mt-2 ${
            step.number === currentStep ? "text-[#FF3388]" : "text-gray-400"
          } font-medium text-center px-1 sm:px-2`}
        >
          {step.label}
        </span>
      </div>
      {index < steps.length - 1 && (
        <div
          className={`hidden sm:block w-8 sm:w-16 h-1 ${
            step.number < currentStep ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      )}
    </React.Fragment>
  ))}
</div>
  );
};

export default function FirstStep({ initialServices = null }) {
  // When the server supplied the services (the normal path) the query is
  // skipped entirely, so the cards are in the first paint with no client
  // round-trip. If the server fetch failed, this falls back to the original
  // client-side query rather than showing an empty page.
  const { data, isLoading, error } = useGetServicesQuery(undefined, {
    skip: Boolean(initialServices?.length),
  });

  const services = initialServices?.length ? initialServices : data;
  const showSkeleton = !initialServices?.length && isLoading;
  const showError = !initialServices?.length && error;

  if (showSkeleton) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <QuoteBackdrop />
        <div className="relative z-10 flex flex-col items-center justify-end pt-28 sm:pt-40 pb-10 text-center h-full">
          <StepIndicator currentStep={1} />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-8 sm:mb-12">
            What service would you like to book?
          </h1>

          {/* Loading Skeleton */}
          <section className="grid grid-cols-2 lg:grid-cols-4 pt-6 sm:pt-24 gap-4 sm:gap-6 w-full max-w-6xl px-4 sm:px-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-2xl bg-[#46434362] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg h-40 sm:h-64 animate-pulse"
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

  if (showError) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <QuoteBackdrop />
        <div className="relative z-10 flex flex-col items-center justify-center pt-40 pb-10 text-center h-full">
          <StepIndicator currentStep={1} />
          <p className="text-2xl text-white">Failed to load services. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <QuoteBackdrop />
      <div className="relative z-10 flex flex-col items-center justify-end pt-28 sm:pt-40 pb-10 text-center h-full">
        <StepIndicator currentStep={1} />
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-8 sm:mb-12">
          What service would you like to book?
        </h1>

        {/* Responsive grid for equal cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 pt-6 sm:pt-24 gap-4 sm:gap-6 w-full max-w-6xl px-4 sm:px-6">
          {services?.map((service, idx) => (
            <Link 
              href={`quote/${service.slug}`}
              key={service._id || idx}
              className="flex flex-col items-center justify-center rounded-2xl bg-[#46434362] cursor-pointer backdrop-blur-md backdrop-saturate-15 hover:border-2 hover:bg-[#47001E66] hover:border-[#FF3388] border border-white/20 shadow-lg transition-transform h-40 sm:h-64"
            >
              <Image
                alt={service.name}
                src={serviceIcons[service.name] || defaultIcon}
                className="mx-auto"
                width={64}
                height={64}
              />
              <h4 className="text-base sm:text-2xl font-medium text-white mt-3 sm:mt-6">
                {service.name}
              </h4>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}