import React from "react";
import MainTitle from "../shared/typography/MainTitle";
import SubTitle from "../shared/typography/SubTitle";

import icon from "@/public/icons/arowright.png";
import aboutImg from "@/public/images/home/about.png";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import image1 from "@/public/icons/home/about1.png";
import image2 from "@/public/icons/home/about2.png";
import image3 from "@/public/icons/home/about3.png";
import image4 from "@/public/icons/home/about4.png";
import bg1 from "@/public/images/services/bg.png";
import bg2 from "@/public/images/services/bg2.png";
import bg3 from "@/public/images/home/aboutbg.png";
import bg4 from "@/public/images/home/aboutbg2.png";

export default function AboutSection() {
  return (
    <div className="bg-[#FFF0F6]  py-8 md:py-24 overflow-hidden  relative">
      <div className="max-w-7xl mx-auto lg:flex px-4  xl:px-0 items-center gap-4 mt-16">
        <section className="flex-1 z-50">
          <MainTitle text={"About Us"} />
          <SubTitle
            text={
              "At Hunky Butler Service, we believe parties should be fun, stress-free, and unforgettable. With thousands of verified bookings, we’ve become one of the UK’s leading providers of hen party entertainment. Whether you’re looking for buff butler hire in Liverpool, a life drawing class in Birmingham, or a cocktail masterclass in London, our trusted team delivers professional entertainment nationwide."
            }
          />
          <p className="font-medium text-xl mt-16">
            Whether you’re planning a hen night, birthday, or a fun corporate
            gathering, we make it simple to:
          </p>

          <div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />{" "}
              <p
                className="text-[#333333) 
]"
              >
                <SubTitle
                  text={
                    " Discover exciting services like Buff Butlers, Cocktail Masterclasses, and Life Drawing."
                  }
                />
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />{" "}
              <p
                className="text-[#333333) 
]"
              >
                <SubTitle
                  text={
                    " Discover exciting services like Buff Butlers, Cocktail Masterclasses, and Life Drawing."
                  }
                />
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />{" "}
              <p
                className="text-[#333333) 
]"
              >
                <SubTitle text={" Book and pay securely within minutes."} />
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />{" "}
              <p
                className="text-[#333333) 
]"
              >
                <SubTitle
                  text={
                    " Connect with verified professionals who are reviewed, rated, and ready to bring the fun."
                  }
                />
              </p>
            </div>
          </div>
        </section>

        <section className="flex-1 mx-auto flex flex-col  justify-center z-50 relative">
          <div className="flex justify-center">
            <Image alt="img" src={aboutImg} />
          </div>

          {/* star */}

          <div className="flex md:absolute bottom-12  left-1/4 lg:left-1/3 gap-4 items-center bg-white p-4 max-w-sm rounded-2xl justify-center">
            <FaStar className="text-[#FFAF1B] text-5xl" />
            <MainTitle text={"4.9"} />
            <SubTitle text={"Satisfied Client Review"} />
          </div>
        </section>
      </div>

      {/* icn section */}
      <div className="">
        <section className="md:flex z-50   justify-between max-w-7xl mx-auto mt-16">
          <div className="flex flex-col  justify-center text-center">
            <Image alt="icon" src={image1} className="mx-auto" />
            <p className="font-medium text-lg"> Verified Professionals</p>
          </div>

          <div className="border-r  border-[#FF99C3]"></div>

          <div className="flex flex-col mt-16 md:mt-0 justify-center text-center">
            <Image alt="icon" src={image2} className="mx-auto" />
            <p className="font-medium text-lg"> Transparent Pricing</p>
          </div>

          <div className="border-r border-[#FF99C3]"></div>
          <div className="flex flex-col z-50 mt-16 md:mt-0 justify-center text-center">
            <Image alt="icon" src={image3} className="mx-auto" />
            <p className="font-medium text-lg">Secure Bookings & pay</p>
          </div>

          <div className="border-r mt-16 md:mt-0 border-[#FF99C3]"></div>
          <div className="flex flex-col justify-center text-center">
            <Image alt="icon" src={image4} className="mx-auto z-50" />
            <p className="font-medium text-lg">Event Support & Reliability</p>
          </div>
        </section>
      </div>

      <div className="absolute overflow-hidden top-0 left-0">
        {" "}
        <Image alt="img" src={bg1}  className="min-w-screen overflow-hidden"/>
      </div>
      <div className="absolute bottom-0 leading-0">
        {" "}
        <Image alt="img" src={bg2} />{" "}
      </div>
      <div className="absolute w-36 md:w-auto bottom-0 leading-0">
        {" "}
        <Image alt="img" src={bg3} className="w-[400px] h-[800px]" />{" "}
      </div>
      <div className="absolute bottom-0 z-10  w-36 md:w-auto right-0 leading-0">
        {" "}
        <Image alt="img" src={bg4} />{" "}
      </div>
    </div>
  );
}
