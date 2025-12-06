import Image from "next/image";
import React from "react";
import arrow from "@/public/icons/greaterthan.png";

export default function ServAndAboutBanner({
  service,
  title,
  description,
  image,
}) {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%), url(${image.src})`,
      }}
      className="relative h-[70vh] w-full overflow-hidden bg-cover bg-start flex items-center rounded-b-3xl"
    >
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-10 mt-20 md:mt-0 pt-10 items-center">
        {/* Left Column - Breadcrumb + Title */}
        <div>
          {/* Breadcrumb */}
          <div className="mb-4 flex text-base md:text-xl gap-[8px] items-center font-medium text-white">
            <p className="tracking-[-0.5px]">Home</p>
            <Image
              className="-mb-1"
              alt="arrow"
              src={arrow}
              width={10}
              height={10}
            />
            <p className="tracking-[-0.5px]">{service}</p>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-5xl lg:text-[56px] text-white font-abhaya-libre">
            {title}
          </h1>
        </div>

        {/* Right Column - Description Box */}
        <div>
          <p className="text-xs md:text-lg text-white capitalize leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}