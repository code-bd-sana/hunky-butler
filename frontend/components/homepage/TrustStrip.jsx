"use client";
import React from "react";
import Image from "next/image";

const TrustStrip = () => {
  return (
    <div className="w-full bg-white py-12 px-4 font-medium text-[#3D3D3D]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto text-center">
        {/* Star Rating */}
        <div className="flex flex-col items-center justify-center bg-[#EFEFEF] px-8 py-6 sm:px-10 sm:py-8 rounded-xl w-full max-w-[280px] mx-auto">
          <div className="flex items-center justify-center">
            <Image
              src="/trustStrip/star.png"
              alt="Star icon"
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="ml-2 text-2xl sm:text-3xl md:text-4xl font-bold">
              4.9
            </span>
          </div>
          <p className="mt-3 text-sm sm:text-base text-center">
            Excellent Reviews
          </p>
        </div>

        {/* Verified Staff */}
        <div className="flex flex-col items-center justify-center bg-[#EFEFEF] px-8 py-6 sm:px-10 sm:py-8 rounded-xl w-full max-w-[280px] mx-auto">
          <Image
            src="/trustStrip/avatar.png"
            alt="Verified staff"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 mx-auto"
          />
          <p className="mt-3 text-sm sm:text-base text-center">
            Fully Verified Staff
          </p>
        </div>

        {/* Bookings */}
        <div className="flex flex-col items-center justify-center bg-[#EFEFEF] px-8 py-6 sm:px-10 sm:py-8 rounded-xl w-full max-w-[280px] mx-auto">
          <div className="flex justify-center items-center relative h-8">
            <Image
              src="/trustStrip/customer3.jpg"
              alt="User 1"
              width={32}
              height={32}
              className="z-10 w-8 h-8 sm:w-10 sm:h-10 border-2 border-white rounded-full"
            />
            <Image
              src="/trustStrip/customer2.jpg"
              alt="User 2"
              width={32}
              height={32}
              className="z-20 w-8 h-8 sm:w-10 sm:h-10 -ml-3 border-2 border-white rounded-full"
            />
            <Image
              src="/trustStrip/customer1.jpg"
              alt="User 3"
              width={32}
              height={32}
              className="z-30 w-8 h-8 sm:w-10 sm:h-10 -ml-3 border-2 border-white rounded-full"
            />
          </div>
          <p className="mt-3 text-sm sm:text-base text-center">12k+ Bookings</p>
        </div>

        {/* Secure Payments */}
        <div className="flex flex-col items-center justify-center bg-[#EFEFEF] px-8 py-6 sm:px-10 sm:py-8 rounded-xl w-full max-w-[280px] mx-auto">
          <Image
            src="/trustStrip/payment.png"
            alt="Secure payments"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 mx-auto"
          />
          <p className="mt-3 text-sm sm:text-base text-center">
            Secure Payments
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
