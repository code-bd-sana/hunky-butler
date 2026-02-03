"use client";
import icon from "@/public/icons/arowright.png";
import image1 from "@/public/icons/home/about1.png";
import image2 from "@/public/icons/home/about2.png";
import image3 from "@/public/icons/home/about3.png";
import image4 from "@/public/icons/home/about4.png";
import bg3 from "@/public/images/home/aboutbg.png";
import bg4 from "@/public/images/home/aboutbg2.png";
import aboutImg from "@/public/images/home/aboutFinal.png";
import bg1 from "@/public/images/services/bg.png";
import bg2 from "@/public/images/services/bg2.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import MainTitle from "../shared/typography/MainTitle";
import SubTitle from "../shared/typography/SubTitle";

export default function AboutSection() {
  const [averageRating, setAverageRating] = useState("4.9");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoogleRating();
  }, []);

  const fetchGoogleRating = async () => {
    try {
      setLoading(true);

      // Fetch from our server-side API route
      const response = await fetch("/api/google-reviews");

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#FFF0F6] py-8 md:py-24 overflow-hidden relative'>
      <div className='max-w-7xl mx-auto lg:flex px-4 xl:px-0 items-center gap-4 mt-16'>
        <section className='flex-1 z-50'>
          <MainTitle text={"About Us"} />
          <p className='text-lg my-3 text-[#3D3D3D]'>
            At Hunky Butler Service, we believe parties should be stress-free,
            memorable, and filled with laughter. We've been proudly providing
            hen party entertainment across the UK since 2013, and over the years
            we've built a reputation as one of the most trusted names in the
            industry.
          </p>
          <p className='text-lg my-3 text-[#3D3D3D]'>
            Our work has taken us everywhere — from collaborating with household
            brands like Ann Summers to being featured on ITV News. Beyond
            parties, we're proud to give back: we've supported a number of
            charities, including recent events in aid of Cancer Research UK and
            the Harrogate Baby Care Unit.
          </p>
          <p className='font-medium text-xl mt-16 capitalize'>
            Whether you're planning a hen night in Liverpool, a birthday in
            Birmingham, or a life drawing party in London , we make it simple
            to:
          </p>

          <div>
            <div className='flex gap-4 items-center'>
              <Image alt='icon' src={icon} />
              <div className='text-[#333333]'>
                <SubTitle
                  text={
                    " Discover exciting services like Buff Butlers, Cocktail Masterclasses, and Life Drawing."
                  }
                />
              </div>
            </div>
            <div className='flex gap-4 items-center'>
              <Image alt='icon' src={icon} />
              <div className='text-[#333333]'>
                <SubTitle
                  text={
                    " Get instant quotes with no hidden fees—factoring in time, staff, location, and travel."
                  }
                />
              </div>
            </div>
            <div className='flex gap-4 items-center'>
              <Image alt='icon' src={icon} />
              <div className='text-[#333333]'>
                <SubTitle text={" Book and pay securely within minutes."} />
              </div>
            </div>
            <div className='flex gap-4 items-center'>
              <Image alt='icon' src={icon} />
              <div className='text-[#333333]'>
                <SubTitle
                  text={
                    " Connect with verified professionals who are reviewed, rated, and ready to bring the fun."
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section className='flex-1 mx-auto flex flex-col justify-center z-50 relative'>
          <div className='flex justify-center'>
            <Image
              alt='Two buff butlers posing together at a hen party event'
              title='Hunky Butler Service UK'
              src={aboutImg}
            />
          </div>

          {/* Star Rating Section - Same design */}
          {/* <div className='flex lg:absolute bottom-12 left-1/4 lg:left-1/3 gap-4 items-center bg-white p-4 max-w-sm rounded-2xl mx-auto mt-4 lg:mt-0 justify-center shadow-lg'>
            <div className='relative'>
              <FaStar className='text-[#FFAF1B] text-5xl' />
              {loading && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFAF1B]'></div>
                </div>
              )}
            </div>
            <div className='flex flex-col'>
              {loading ? (
                <div className='animate-pulse'>
                  <div className='h-8 w-12 bg-gray-200 rounded mb-2'></div>
                  <div className='h-4 w-32 bg-gray-200 rounded'></div>
                </div>
              ) : (
                <>
                  <MainTitle text={averageRating} />
                  <SubTitle text={"Satisfied Client Review"} />
                </>
              )}
            </div>
          </div> */}
        </section>
      </div>

      {/* Icon Section */}
      <div className=''>
        <section className='md:flex z-50 relative px-4 overflow-hidden justify-between max-w-7xl mx-auto mt-16'>
          <div className='flex flex-col justify-center text-center'>
            <Image alt='icon' src={image1} className='mx-auto' />
            <p className='font-medium text-lg mt-2'>Verified Professionals</p>
          </div>

          <div className='border-r border-[#FF99C3] hidden md:block'></div>

          <div className='flex flex-col mt-16 md:mt-0 justify-center text-center'>
            <Image alt='icon' src={image2} className='mx-auto' />
            <p className='font-medium text-lg mt-2'>Transparent Pricing</p>
          </div>

          <div className='border-r border-[#FF99C3] hidden md:block'></div>
          <div className='flex flex-col z-50 mt-16 md:mt-0 justify-center text-center'>
            <Image alt='icon' src={image3} className='mx-auto' />
            <p className='font-medium text-lg mt-2'>Secure Bookings & Pay</p>
          </div>

          <div className='border-r mt-16 md:mt-0 border-[#FF99C3] hidden md:block'></div>
          <div className='flex flex-col mt-16 md:mt-0 justify-center text-center'>
            <Image alt='icon' src={image4} className='mx-auto z-50' />
            <p className='font-medium text-lg mt-2'>
              Event Support & Reliability
            </p>
          </div>
        </section>
      </div>

      <div className='hidden  md:absolute overflow-hidden top-0 left-0'>
        <Image alt='img' src={bg1} className='min-w-screen overflow-hidden' />
      </div>
      <div className='hidden md:absolute bottom-0 leading-0'>
        <Image alt='img' src={bg2} />
      </div>
      <div className='hidden md:absolute w-36 md:w-auto bottom-0 leading-0'>
        <Image alt='img' src={bg3} className='md:w-[400px] md:h-[800px]' />
      </div>
      <div className='hidden md:absolute bottom-0 z-10 w-36 md:w-auto right-0 leading-0'>
        <Image alt='img' src={bg4} />
      </div>
    </div>
  );
}
