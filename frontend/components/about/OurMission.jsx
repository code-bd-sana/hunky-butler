'use client'
import icon from "@/public/icons/arowright.png";
import image1 from "@/public/icons/home/about1.png";
import image2 from "@/public/icons/home/about2.png";
import image3 from "@/public/icons/home/about3.png";
import image4 from "@/public/icons/home/about4.png";
import bg3 from "@/public/images/home/aboutbg.png";
import bg4 from "@/public/images/home/aboutbg2.png";
import aboutImg from "@/public/images/home/aboutImage16.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import MainTitle from "../shared/typography/MainTitle";
import SubTitle from "../shared/typography/SubTitle";

export default function OurMission() {
  const [averageRating, setAverageRating] = useState("4.9");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoogleRating();
  }, []);

  const fetchGoogleRating = async () => {
    try {
      setLoading(true);
      
      // Fetch from our server-side API route
      const response = await fetch('/api/google-reviews');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "OK" && data.result) {
        const placeData = data.result;
        
        // Set average rating
        if (placeData.rating) {
          setAverageRating(placeData.rating.toFixed(1));
        }
      }
    } catch (error) {
      console.error("Error fetching Google rating:", error);
      // Keep the default 4.9 if there's an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF0F6] py-8 md:py-24 relative">
      <div className="max-w-7xl mx-auto lg:flex px-8 items-start gap-4 mt-16">
        <section className="flex-1 z-50 relative">
          <MainTitle text={"Our Mission: Making Events Effortless"} />
          <SubTitle
            text={
              "Our mission is simple: take the stress out of planning, so you can focus on enjoying the party. We connect you with trusted professionals who bring energy, fun, and reliability to every booking. With transparent pricing, secure payments, and flexible cancellation, it's never been easier to book your perfect event."
            }
          />
          <div className="mt-8">
            <SubTitle
              text={
                "Whether it's a cocktail masterclass in Birmingham, a life drawing hen do in London, or a group looking to hire buff butlers in Manchester, our team delivers nationwide coverage with the same high standards every time. We make it simple to:"
              }
            />
          </div>

          <div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} className="size-6"/>
              <div className="text-[#333333]">
                <p>
                  Discover exciting services like Buff Butlers, Cocktail
                  Masterclasses, and Life Drawing.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} className="size-6"/>
              <div className="text-[#333333]">
                <SubTitle
                  text={
                    "Get instant quotes with no hidden fees, factoring in time, staff, location, and travel."
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} className="size-6"/>
              <div className="text-[#333333]">
                <SubTitle text={"Book and pay securely within minutes."} />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Image alt="icon" src={icon} className="size-6"/>
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
          <Image
            alt="Cheeky buff butler entertainer with party guests"
            src={aboutImg}
            className="mx-auto"
          />

          {/* Star Rating Section */}
          <div className="flex  lg:absolute bottom-18 lg:left-1/2 transform lg:-translate-x-1/2 gap-4 items-center lg:w-2/3 bg-white p-4 rounded-2xl mx-auto mt-4 lg:mt-0 justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <FaStar className="text-[#FFAF1B] text-5xl" />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFAF1B]"></div>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                {loading ? (
                  <div className="animate-pulse h-12 w-16 bg-gray-200 rounded"></div>
                ) : (
                  <>
                    <MainTitle text={averageRating} />
                    <span className="text-gray-500 text-sm">/5</span>
                  </>
                )}
              </div>
              {loading ? (
                <div className="animate-pulse h-4 w-32 bg-gray-200 rounded mt-2"></div>
              ) : (
                <SubTitle text={"Satisfied Client Review"} />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Icon Section */}
      <section className="md:flex z-50 relative px-4 justify-between max-w-7xl mx-auto mt-16">
        <div className="flex flex-col justify-center text-center">
          <Image alt="icon" src={image1} className="mx-auto" />
          <p className="font-medium text-lg mt-2">Verified Professionals</p>
        </div>

        <div className="border-r border-[#FF99C3] hidden md:block"></div>

        <div className="flex flex-col mt-16 md:mt-0 justify-center text-center">
          <Image alt="icon" src={image2} className="mx-auto" />
          <p className="font-medium text-lg mt-2">Transparent Pricing</p>
        </div>

        <div className="border-r border-[#FF99C3] hidden md:block"></div>
        <div className="flex flex-col z-50 mt-16 md:mt-0 justify-center text-center">
          <Image alt="icon" src={image3} className="mx-auto" />
          <p className="font-medium text-lg mt-2">Secure Bookings & Pay</p>
        </div>

        <div className="border-r mt-16 md:mt-0 border-[#FF99C3] hidden md:block"></div>
        <div className="flex flex-col mt-16 md:mt-0 justify-center text-center">
          <Image alt="icon" src={image4} className="mx-auto z-50" />
          <p className="font-medium text-lg mt-2">Event Support & Reliability</p>
        </div>
      </section>

      <div className="absolute w-36 md:w-auto bottom-0 leading-0">
        <Image alt="img" src={bg3} />
      </div>
      <div className="absolute bottom-0 z-10 w-36 md:w-auto right-0 leading-0">
        <Image alt="img" src={bg4} />
      </div>
    </div>
  );
}