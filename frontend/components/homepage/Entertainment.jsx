 import React from "react";
import Image from "next/image";
const Entertainment = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/Entertainment/EntertainmentBg.png')",
        backgroundSize: "cover", // not backgroundImage: "cover"
        backgroundRepeat: "no-repeat", // optional
      }}
    >
      <div className="flex flex-col md:flex-row items-start max-w-[1240px] mx-auto  my-10 md:my-44 gap-6 md:gap-8">
        <div className="w-full md:w-1/2">
          <Image
            src="/Entertainment/img.jpeg"
            alt=""
            width={574}
            height={374}
            className="object-cover rounded-lg border-8 border-[#FF006A]"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-2xl md:text-5xl leading-tight text-center md:text-start font-semibold">
            Entertainment Services Available
            <span className="italic text-[#FF006A]"> Across the UK</span>
          </h1>
          <p className="text-[#3D3D3D] text-base md:text-lg">
            We provide Buff Butlers, Cocktail Classes, Strippers, and Life
            Drawing across major UK cities including London, Manchester,
            Birmingham, Leeds, Liverpool, Newcastle, Glasgow, Cardiff, and more.
            Wherever your party is, we’ve got professionals ready to make it
            unforgettable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Entertainment;
