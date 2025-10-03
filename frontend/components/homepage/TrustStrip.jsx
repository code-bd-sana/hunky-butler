// components/TrustStrip.js
import React from "react";
import Image from "next/image";

const TrustStrip = () => {
  return (
    <div className="w-full bg-white py-12 px-4 font-medium text-[#3D3D3D]">
      <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        
        {/* Star Rating */}
        <div className="flex bg-[#EFEFEF] px-12 py-8 rounded-lg mx-auto text-center  flex-col items-center lg:items-start justify-center ">
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
          <p className="mt-1 text-sm sm:text-base pt-4">Excellent Reviews</p>
        </div>

        {/* Verified Staff */}
        <div className="flex flex-col items-center lg:items-start justify-center bg-[#EFEFEF] px-12 py-8 rounded-lg mx-auto text-center">
          <Image
            src="/trustStrip/avatar.png"
            alt="Verified staff"
            width={32}
            height={32}
            className="w-8 h-8 max-auto flex mx-auto justify-center"
          />
          <p className="mt-1 text-sm sm:text-base pt-4">Fully verified staff</p>
        </div>

        {/* Bookings */}
        <div className="flex flex-col items-center lg:items-start justify-center bg-[#EFEFEF] px-12 py-8 rounded-lg mx-auto text-center0">
          <div className="flex items-center relative justify-center mx-auto h-8">
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
          <p className="mt-1 text-sm sm:text-base pt-4">12k+ Bookings</p>
        </div>

        {/* Secure Payments */}
        <div className="flex flex-col  items-center lg:items-start justify-center bg-[#EFEFEF] px-12 py-8 rounded-lg mx-auto text-center">
          <Image
            src="/trustStrip/payment.png"
            alt="Secure payments"
            width={32}
            height={32}
            className="w-8 h-8 mx-auto justify-center"
          />
          <p className="mt-1 text-sm sm:text-base pt-4">Secure payments</p>
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
