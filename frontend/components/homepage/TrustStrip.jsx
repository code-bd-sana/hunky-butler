// components/TrustStrip.js
import React from "react";
import Image from "next/image";

const TrustStrip = () => {
  return (
    <div className="w-full bg-white py-12 px-4 font-medium text-[#3D3D3D]">
      <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        
        {/* Star Rating */}
        <div className="flex flex-col items-center lg:items-start justify-center lg:border-r lg:border-gray-200">
          <div className="flex items-center">
            <Image
              src="/trustStrip/star.png"
              alt="Star icon"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="ml-2 text-3xl font-bold sm:text-4xl">4.9</span>
          </div>
          <p className="mt-1 text-sm sm:text-base">Our Trust strip</p>
        </div>

        {/* Verified Staff */}
        <div className="flex flex-col items-center lg:items-start justify-center lg:border-r lg:border-gray-200">
          <Image
            src="/trustStrip/avatar.png"
            alt="Verified staff"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <p className="mt-1 text-sm sm:text-base">Fully verified staff</p>
        </div>

        {/* Bookings */}
        <div className="flex flex-col items-center lg:items-start justify-center lg:border-r lg:border-gray-200">
          <div className="flex items-center relative h-8">
            <Image
              src="/trustStrip/customer3.jpg"
              alt="User 1"
              width={32}
              height={32}
              className="z-10 w-8 h-8 border-2 border-white rounded-full"
            />
            <Image
              src="/trustStrip/customer2.jpg"
              alt="User 2"
              width={32}
              height={32}
              className="z-20 w-8 h-8 -ml-3 border-2 border-white rounded-full"
            />
            <Image
              src="/trustStrip/customer1.jpg"
              alt="User 3"
              width={32}
              height={32}
              className="z-30 w-8 h-8 -ml-3 border-2 border-white rounded-full"
            />
          </div>
          <p className="mt-1 text-sm sm:text-base">12k+ Bookings</p>
        </div>

        {/* Secure Payments */}
        <div className="flex flex-col items-center lg:items-start justify-center">
          <Image
            src="/trustStrip/payment.png"
            alt="Secure payments"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <p className="mt-1 text-sm sm:text-base">Secure payments</p>
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
