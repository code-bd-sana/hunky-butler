import Image from "next/image";
import React from "react";
import arrow from "@/public/icons/greaterthan.png";

const ServiceBanner = () => {
  return (
    <div
      className={`relative h-[100vh] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(0,0,0,0)_13%,rgba(0,0,0,1)_95%),url('/serviceBanner/buff.jpeg')] bg-cover bg-center`}
    >
      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        {/* Breadcrumbs */}
        <div className="mb-4 flex text-xl gap-[12px] justify-center items-center text-white">
          <p>Home</p>{" "}
          <Image
            className="-mb-1.5 h-auto w-auto"
            alt="arrow"
            src={arrow}
            width={11}
            height={27}
          />
          <p>Service Details</p>
        </div>

        <h1 className="mb-2 max-w-7xl text-4xl font-medium text-white md:text-5xl lg:text-[68px]">
          Buff Butlers for Hire – UK’s Top Hen Party & Event Hosts
        </h1>

        <p className="mb-8 mt-4 max-w-7xl text-lg text-white md:text-xl">
          Fun, cheeky and professional butlers to keep your guests entertained,
          wherever you’re celebrating.
        </p>

        <button className="rounded-full border-2 border-white px-[24px] py-[16px] text-lg font-semibold bg-white text-[#292929]">
          Get Instant Quote
        </button>
      </div>
    </div>
  );
};

export default ServiceBanner;
