import React from "react";
import MainTitle from "../shared/typography/MainTitle";
import SubTitle from "../shared/typography/SubTitle";

import icon from "@/public/icons/arowright.png";
import aboutImg from "@/public/images/home/aboutImage16.png";
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

export default function OurMission() {
  return (
    <div className="bg-[#FFF0F6]  py-8 md:py-24   relative">

      <div className="max-w-7xl mx-auto lg:flex px-8 items-center gap-4 mt-16">
        <section className="flex-1 z-50 relative">
            
          <MainTitle text={"Our Mission: Making Events Effortless"} />
          <SubTitle
            text={
              "Our mission is simple: take the stress out of planning, so you can focus on enjoying the party. We connect you with trusted professionals who bring energy, fun, and reliability to every booking. With transparent pricing, secure payments, and flexible cancellation, it’s never been easier to book your perfect event."
            }
          />
          <div className=" mt-10 ">
            <SubTitle
              text={
                "Whether it’s a cocktail masterclass in Birmingham, a life drawing hen do in London, or a group looking to hire buff butlers in Manchester, our team delivers nationwide coverage with the same high standards every time. We make it simple to:"
              }
            />
          </div>

          <div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />
              <div className="text-[#333333]">
                <SubTitle
                  text={
                    "Discover exciting services like Buff Butlers, Cocktail Masterclasses, and Life Drawing."
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />{" "}
              <div className="text-[#333333]">
                <SubTitle
                  text={
                    "Get instant quotes with no hidden fees—factoring in time, staff, location, and travel."
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />{" "}
              <div className="text-[#333333]">
                <SubTitle text={"Book and pay securely within minutes."} />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} />{" "}
              <div className="text-[#333333]">
                <SubTitle
                  text={
                    "Connect with verified professionals who are reviewed, rated, and ready to bring the fun."
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <section className="flex-1 mx-auto z-50 relative">
          <Image alt="Cheeky buff butler entertainer with party guests" src={aboutImg} className="mx-auto"/>

          {/* star */}

          <div className="flex lg:absolute bottom-12  left-1/4 lg:left-1/3 gap-4 items-center bg-white p-4 max-w-sm rounded-2xl mx-auto mt-4 lg:mt-0  justify-center">
            <FaStar className="text-[#FFAF1B] text-5xl" />
            <MainTitle text={"4.9"} />
            <SubTitle text={"Satisfied Client Review"} />
          </div>
        </section>
      </div>

      {/* icn section */}
      <section className="md:flex z-50 relative px-4  justify-between max-w-7xl mx-auto mt-16">
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

      {/* <div className="absolute top-0 left-0 ">
        {" "}
        <Image alt="img" src={bg1} />{" "}
      </div>
      <div className="absolute bottom-0 leading-0">
        {" "}
        <Image alt="img" src={bg2} />{" "}
      </div> */}
      <div className="absolute w-36 md:w-auto bottom-0 leading-0">
        {" "}
        <Image alt="img" src={bg3} />{" "}
      </div>
      <div className="absolute bottom-0 z-10  w-36 md:w-auto right-0 leading-0">
        {" "}
        <Image alt="img" src={bg4} />{" "}
      </div>
    </div>
  );
}
