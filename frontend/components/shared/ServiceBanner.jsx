import Image from "next/image";
import React from "react";
import arrow from "@/public/icons/greaterthan.png";

const ServiceBanner = ({ heading, subTitle, image }) => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className="relative h-[80vh] w-full overflow-hidden bg-cover bg-center"
    >
      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
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
          <p className="tracking-[-1px]">Service Details</p>
        </div>

        <h1 className="mb-2 max-w-7xl text-4xl tracking-[-1px] font-medium text-white md:text-5xl lg:text-[68px]">
          {heading}
        </h1>

        <div className="mb-8 mt-4 max-w-7xl tracking-[-1px] text-lg text-white md:text-xl">
          {subTitle}
        </div>

        <button className="rounded-full border-2 border-white px-[24px] py-[16px] text-lg font-semibold bg-white text-[#292929]">
          Get Instant Quote
        </button>
      </div>
    </div>
  );
};

export default ServiceBanner;
