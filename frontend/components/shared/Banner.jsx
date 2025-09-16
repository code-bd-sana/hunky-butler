import Image from "next/image";
import React from "react";
import arrow from "@/public/icons/greaterthan.png";

export default function OurServiceBanner({
  service,
  title,
  description,
  image,
}) {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className="relative h-[500px] w-full overflow-hidden bg-cover bg-center"
    >
      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10 text-center">
        {/* Breadcrumbs */}
        <div className="mb-4 flex text-xl gap-[12px] justify-center items-center font-medium text-white">
          <p className="tracking-[-1px]">Home</p>
          <Image
            className="-mb-1"
            alt="arrow"
            src={arrow}
            width={10}
            height={10}
          />
          <p className="tracking-[-1px]">{service}</p>
        </div>

        <h1 className="mb-2 max-w-7xl text-4xl tracking-[-1px] font-medium text-white md:text-5xl lg:text-[68px]">
          {title}
        </h1>

        <p className="mb-8 mt-4 max-w-7xl text-lg text-white md:text-xl">
          {description}
        </p>
      </div>
    </div>
  );
}
