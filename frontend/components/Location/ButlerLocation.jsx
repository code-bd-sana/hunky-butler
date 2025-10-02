import React from "react";
import Link from "next/link";
import icon from "@/public/icons/arowright.png";
import Image from "next/image";
import MainTitle from "../shared/typography/MainTitle";
import locations from "@/app/locations/locations.json";

const ButlerLocation = () => {
  return (
    <div className="bg-[#F6F4F5] py-12 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-3xl md:text-4xl font-extrabold text-[#0A014F] text-center mb-10">
          <MainTitle text="Some of our Buff Butler Locations" />
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-5">
          {locations.map((loc, index) => (
            <Link
              key={index}


              href={`/${loc.slug}`}
              className="flex items-center gap-2 text-[#333] hover:text-[#FF006A] transition-colors duration-200"
            >
              <Image
                src={icon}
                alt="go"
                width={24}
                height={24}
                className="flex-shrink-0 mt-0.5"
              />
              <span className="text-[16px]">{loc.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButlerLocation;
