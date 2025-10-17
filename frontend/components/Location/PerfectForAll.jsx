"use client";
import React from "react";

import icon from "@/public/icons/arowright.png";
import Image from "next/image";
import bg from "@/public/images/services/bg3.png";
import perfect from "@/public/location/perfect.jpeg";
import scottish from "@/public/location/Scottish.jpeg";
import MainTitle from "../shared/typography/MainTitle";
import SubTitle from "../shared/typography/SubTitle";
import Link from "next/link";

export default function PerfectForAll({ city }) {
  const included = [
    "Hen Parties: Keep The Laughter Flowing With Flirty Fun And Games.",
    "Birthday Parties: Add Energy And Excitement To Your Special Day.",
    "Corporate Events: Keep It Professional Yet Lively With Charming Hosts.",
    "Private Gatherings: A Personal Touch For Intimate Occasions.",
    "Holiday Celebrations: From Hogmanay To Christmas — We’ve Got Your Party Covered.",
  ];
  return (
    <div className="relative overflow-hidden">
      <div className="text-center mb-12 pt-16">
        <MainTitle text={`Charming Butlers for Every ${city} Celebration`} />
        <div className=" max-w-7xl mx-auto mt-4">
          <SubTitle
            text={
              "Bring a touch of charm, class, and cheeky fun to your next event with our Hunky Butler Service in Scotland. Whether you’re celebrating a hen party in Edinburgh, a birthday in Glasgow, or a private gathering in Aberdeen, our handsome butlers ensure your event is unforgettable."
            }
          />
        </div>
      </div>

      <div className="max-w-7xl z-50 mx-auto container md:px-8 lg:px-0 py-10">
        <p className="text-3xl z-50 italic  leading-normal text-center capitalize text-[#292929]">
          {/* {text} */}
        </p>
        <div className="flex flex-col md:flex-row items-start  px-4 md:px-0 gap-[56px] mt-24">
          <section className="flex-1">
            <h4 className="text-[#141414] text-5xl leading-snug  max-w-4xl mx-auto font-medium ">
              Perfect For All Occasions
            </h4>
            <p className="text-lg my-6">
              Our Scottish Hunky Butlers are trained to adapt to any event type,
              offering both entertainment and hosting services. Here’s where we
              shine:
            </p>

            <div className="mt-8 space-y-3">
              <div className="mt-8 space-y-3  items-center gap-4 ">
                {included?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 space-y-2">
                    <Image alt="icon" src={icon} />{" "}
                    <p className="text-[#333333] font-medium">{item}</p>
                  </div>
                ))}
                {/* <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Image alt="icon" src={icon} />
                    <p className="text-[#333333]">
                      Hen Parties: Keep The Laughter Flowing With Flirty Fun And
                      Games.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Image alt="icon" src={icon} />
                    <p className="text-[#333333]">
                      Birthday Parties: Add Energy And Excitement To Your
                      Special Day.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Image alt="icon" src={icon} />
                    <p className="text-[#333333]">
                      Corporate Events: Keep It Professional Yet Lively With
                      Charming Hosts.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Image alt="icon" src={icon} />
                    <p className="text-[#333333]">
                      Private Gatherings: A Personal Touch For Intimate
                      Occasions.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Image alt="icon" src={icon} />
                    <p className="text-[#333333]">
                      Holiday Celebrations: From Hogmanay To Christmas — We’ve
                      Got Your Party Covered.
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </section>

          <section className="flex-1 mt-4 md:mt-0">
            <Image
              alt="perfect"
              src={perfect}
              width={600}
              height={400}
              className="object-cover rounded-4xl h-[550px]"
            />
          </section>
        </div>
        <div className="flex flex-col md:flex-row items-start  px-4 md:px-0 gap-[56px] mt-24">
          <section className="flex-1 mt-4 md:mt-0">
            <Image
              alt="perfect"
              src={scottish}
              width={600}
              height={400}
              className="object-cover rounded-4xl h-[550px]"
            />
          </section>
          <section className="flex-1">
            <h4 className="text-[#141414] text-5xl leading-snug  max-w-4xl mx-auto font-medium ">
              What Makes Our Scottish Butlers Special
            </h4>
            <p className="text-lg my-6">
              Our Scottish Hunky Butlers are trained to adapt to any event type,
              offering both entertainment and hosting services. Here’s where we
              shine:
            </p>

            <div className="mt-8 space-y-3">
              <div className="mt-8 space-y-3  items-center gap-4 ">
                {included?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 space-y-2">
                    <Image alt="icon" src={icon} />{" "}
                    <p className="text-[#333333] font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className=" my-4 md:my-8">
              <Link href={`/quote`}>
                <button className="cursor-pointer bg-none text-[#FF006A] px-4 md:px-6 py-2 md:py-4 rounded-full font-medium text-base md:text-xl hover:bg-pink-600 hover:text-white transition border-2 border-[#FF006A]">
                  Try a 30-second quote now
                </button>
              </Link>
            </div>
          </section>
        </div>
        <div className="absolute top-0 -z-10 left-0">
          {" "}
          <Image alt="img" className="objecco min-w-screen" src={bg} />{" "}
        </div>
      </div>
    </div>
  );
}
