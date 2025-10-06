"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import icon from "@/public/icons/arowright.png";
import { useGetServicesQuery } from "@/features/services/servicesApi";

export default function ServicePopup() {
  const { data: services = [], isLoading, error } = useGetServicesQuery();
  console.log("services", services);
  const [activeId, setActiveId] = useState(services[0]?._id);
  // Set the first service as active when data loads
  useEffect(() => {
    if (services.length > 0 && !activeId) {
      setActiveId(services[0]._id);
    }
  }, [services, activeId]);
  const active = services.find((i) => i._id === activeId) || services[0] || {};

  if (isLoading) {
    return   <div className="">
      <section className="mx-3 sm:mx-4 lg:mx-8 2xl:mx-12 z-300 rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-4 sm:p-6 lg:p-10 text-white bg-black/60 backdrop-blur-lg ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] animate-pulse">
        {/* Title Skeleton */}
        <div className="h-8 sm:h-10 lg:h-12 w-40 bg-white/30 rounded mb-4 sm:mb-6"></div>

        <div className="flex flex-col gap-5 lg:gap-6 lg:flex-row lg:items-stretch">
          {/* Left list skeleton */}
          <div className="w-full lg:w-5/12 xl:w-1/2">
            <ul className="flex flex-col gap-3 sm:gap-4 max-h-[52vh] sm:max-h-[56vh] lg:max-h-[420px] pr-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i}>
                  <div className="rounded-[14px] sm:rounded-[16px] lg:rounded-[18px] px-4 sm:px-5 lg:px-6 h-12 sm:h-14 lg:h-[72px] w-full bg-white/20"></div>
                  {i < 5 && <div className="mt-3 sm:mt-4 h-px w-full bg-white/20" />}
                </li>
              ))}
            </ul>
          </div>

          {/* Right preview skeleton */}
          <div className="flex-1">
            <div className="h-full rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] bg-white/10 text-slate-900 shadow-[0_14px_50px_rgba(0,0,0,0.25)] p-4 sm:p-6 lg:p-8 flex">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 w-full lg:grid-cols-[320px_1fr]">
                {/* Image skeleton */}
                <div className="relative w-full h-56 sm:h-72 lg:h-[400px] overflow-hidden rounded-[12px] sm:rounded-[14px] lg:rounded-[16px] bg-white/20"></div>

                {/* Text + Button skeleton */}
                <div className="flex flex-col justify-between p-2 sm:p-3 lg:p-4 w-full">
                  <div className="space-y-3">
                    <div className="h-4 sm:h-5 lg:h-6 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 sm:h-5 lg:h-6 bg-white/20 rounded w-2/3"></div>
                    <div className="h-4 sm:h-5 lg:h-6 bg-white/20 rounded w-5/6"></div>
                  </div>

                  <div className="mt-6">
                    <div className="inline-block rounded-full bg-[#FF006A]/40 h-9 sm:h-10 w-32"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-4 sm:h-6 lg:h-0" />
          </div>
        </div>
      </section>
    </div>
  }

  return (
    <div className="">
      <section className="mx-3 sm:mx-4 lg:mx-8 2xl:mx-12 z-300 rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-4 sm:p-6 lg:p-10 text-white bg-black/60 backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-lg ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-[36px] leading-none font-extrabold tracking-tight">
          Services
        </h2>

        <div className="flex flex-col gap-5 lg:gap-6 lg:flex-row lg:items-stretch">
          {/* Left list */}
          <div className="w-full lg:w-5/12 xl:w-1/2">
            <ul className="flex flex-col gap-3 sm:gap-4 max-h-[52vh] sm:max-h-[56vh] lg:max-h-[420px] pr-1">
              {services.map((service, idx) => {
                const isActive = service._id === activeId;

                return (
                  <li key={service._id} className="flex flex-col">
                    <button
                      onClick={() => setActiveId(service._id)}
                      className={[
                        "group flex items-center justify-between",
                        "rounded-[14px] sm:rounded-[16px] lg:rounded-[18px] px-4 sm:px-5 lg:px-6 h-12 sm:h-14 lg:h-[72px] w-full",
                        "transition-all duration-200 text-left xl:text-[32px]",
                        isActive
                          ? "bg-white text-[#FF006A] shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
                          : "text-white/90 hover:bg-white/10",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={[
                          "font-semibold tracking-wide line-clamp-1",
                          isActive ? "text-[#FF006A]" : "text-white",
                        ].join(" ")}
                      >
                        {service?.name}
                      </span>

                      {/* Arrow grows responsively */}
                      {isActive ? (
                        <Image
                          src={icon}
                          alt="go"
                          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mt-0.5 flex-shrink-0"
                        />
                      ) : (
                        <span
                          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                          aria-hidden
                        />
                      )}
                    </button>

                    {idx < services.length - 1 && !isActive && (
                      <div className="mt-3 sm:mt-4 h-px w-full bg-white" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right preview */}
          <div className="flex-1">
            <div className="h-full rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] bg-white text-slate-900 shadow-[0_14px_50px_rgba(0,0,0,0.25)] p-4 sm:p-6 lg:p-8 flex">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 w-full lg:grid-cols-[320px_1fr]">
                {/* Image */}
                <div className="relative w-full h-56 sm:h-72 lg:h-[400px] overflow-hidden rounded-[12px] sm:rounded-[14px] lg:rounded-[16px]">
                  <Image
                    src={active?.banner}
                    alt={active?.description}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                    priority
                  />
                </div>

                {/* Text + CTA */}
                <div className="flex flex-col p-2 sm:p-3 lg:p-4">
                  <p className="text-[#141414] w-full text-base sm:text-lg md:text-xl xl:text-3xl whitespace-pre-line">
                    {active.short_des}
                  </p>

                  <div className="mt-auto pt-4">
                    <a
                      href={`/party-entertainment-services/${active?.slug}`}
                      className="inline-flex items-center justify-center self-start rounded-full px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-sm sm:text-[15px] font-semibold bg-[#FF006A] text-white shadow-[0_6px_16px_rgba(236,72,153,0.45)] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#FF006A]/40"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Small-screen bottom spacing so CTA isn't cramped */}
            <div className="h-4 sm:h-6 lg:h-0" />
          </div>
        </div>
      </section>
    </div>
  );
}
