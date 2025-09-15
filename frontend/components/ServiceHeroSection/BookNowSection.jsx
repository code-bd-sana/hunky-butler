import React from "react";

import icon from "@/public/icons/arowright.png";
import Image from "next/image";
import MainTitle from "../shared/typography/MainTitle";
import bg from "@/public/images/services/bg3.png";

export default function BookNowSection({ text, image, bulletPoints }) {
  return (
    <div className="relative">
      <div className="max-w-7xl z-50 mx-auto container md:px-8 lg:px-0 py-16">
        <p
          className="text-3xl z-50 italic  leading-normal text-center capitalize text-[#292929);
]"
        >
          {text}
        </p>
        <div className="md:flex items-center  px-4 md:px-0 gap-[56px] mt-24">
          <section className="flex-1">
            <h4 className="text-[#141414] text-5xl leading-snug  max-w-4xl mx-auto font-medium ">
              What’s Included?
            </h4>

            <div className="mt-8 space-y-3">
              <div className="mt-8 space-y-3  items-center gap-4 ">
                {bulletPoints.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Image alt="icon" src={icon} />{" "}
                    <p
                      className="text-[#333333);
]"
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* button */}

            <button className="btn-primary mt-16"> Book Now </button>
          </section>

          <section className="flex-1 mt-4 md:mt-0">
            <Image alt="image" src={image} />
          </section>
        </div>
        <div className="absolute top-0 -z-10 left-0">
          {" "}
          <Image alt="img" src={bg} />{" "}
        </div>
      </div>
    </div>
  );
}
