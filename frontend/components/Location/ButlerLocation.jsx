import React from "react";
import Link from "next/link";
import icon from "@/public/icons/arowright.png";
import Image from "next/image";
import MainTitle from "../shared/typography/MainTitle";

const locations = [
  { name: "Buff Butlers Derby", href: "/locations/derby" },
  { name: "Buff Butlers Chesterfield", href: "/locations/chesterfield" },
  { name: "Buff Butlers Matlock", href: "/locations/matlock" },
  { name: "Buff Butlers Manchester", href: "/locations/manchester" },
  { name: "Buff Butlers Salford", href: "/locations/salford" },
  { name: "Buff Butlers Blackpool", href: "/locations/blackpool" },
  { name: "Buff Butlers Bolton", href: "/locations/bolton" },
  { name: "Buff Butlers Birmingham", href: "/locations/birmingham" },
  { name: "Buff Butlers Solihull", href: "/locations/solihull" },
  { name: "Buff Butlers Stoke on Trent", href: "/locations/stoke" },
  { name: "Buff Butlers Walsall", href: "/locations/walsall" },
  { name: "Buff Butlers Coventry", href: "/locations/coventry" },
  { name: "Buff Butlers Tamworth", href: "/locations/tamworth" },
  { name: "Buff Butlers Dudley", href: "/locations/dudley" },
  { name: "Buff Butlers Liverpool", href: "/locations/liverpool" },
  { name: "Buff Butlers Chester", href: "/locations/chester" },
  { name: "Buff Butlers Birkenhead", href: "/locations/birkenhead" },
  { name: "Buff Butlers Kirkby", href: "/locations/kirkby" },
  { name: "Buff Butlers Warrington", href: "/locations/warrington" },
  { name: "Buff Butlers St Helens", href: "/locations/st-helens" },
  { name: "Buff Butlers Widnes", href: "/locations/widnes" },
  { name: "Buff Butlers Leeds", href: "/locations/leeds" },
  { name: "Buff Butlers Bradford", href: "/locations/bradford" },
  { name: "Buff Butlers Harrogate", href: "/locations/harrogate" },
  { name: "Buff Butlers York", href: "/locations/york" },
  { name: "Buff Butlers Newcastle", href: "/locations/newcastle" },
  { name: "Buff Butlers Sunderland", href: "/locations/sunderland" },
  { name: "Buff Butlers Middlesborough", href: "/locations/middlesborough" },
  { name: "Buff Butlers Nottingham", href: "/locations/nottingham" },
  { name: "Buff Butlers Leicester", href: "/locations/leicester" },
  { name: "Buff Butlers Bristol", href: "/locations/bristol" },
  { name: "Buff Butlers Northampton", href: "/locations/northampton" },
  { name: "Buff Butlers Milton Keynes", href: "/locations/milton-keynes" },
  { name: "Buff Butlers Bedford", href: "/locations/bedford" },
  { name: "Buff Butlers Luton", href: "/locations/luton" },
];

const ButlerLocation = () => {
  return (
    <div className="bg-[#F6F4F5] py-12 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-3xl md:text-4xl font-extrabold text-[#0A014F] text-center mb-10">
          <MainTitle text="Some of our Buff Butler Locations"></MainTitle>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-5">
          {locations.map((loc, index) => (
            <Link
              key={index}
              href={loc.href}
              className="flex items-center gap-2 text-[#333] hover:text-[#FF006A] transition-colors duration-200"
            >
              <Image
                src={icon}
                alt="go"
                width={24}
                height={24}
                className="flex-shrink-0 mt-0.5"
                priority={false}
              />
              <span className="text-[16px]">{loc.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButlerLocation;
