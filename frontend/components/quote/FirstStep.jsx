import Image from "next/image";
import React from "react";
import image from "@/public/quote/bg.png";
import icon1 from "@/public/quote/icon1.png";
import icon2 from "@/public/quote/icon2.png";
import icon3 from "@/public/quote/icon3.png";
import icon4 from "@/public/quote/icon4.png";
import Link from "next/link";

export default function FirstStep() {
  const services = [
    { icon: icon1, title: "Buff Butlers", link:"BuffButlers" },
    { icon: icon2, title: "Life Drawing", link:"LifeDrawing" },
    { icon: icon3, title: "Cocktail Masterclasses", link:"CocktailMasterclasses" },
    { icon: icon4, title: "Strippers", link:"Strippers" },
  ];

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
    >
      <div className="relative z-10 flex flex-col items-center justify-end pt-40 pb-10 text-center h-full">
        <h4 className="text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-12">
          What service would you like to book?
        </h4>

        {/* Responsive grid for equal cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-24 gap-6 w-full max-w-6xl px-6">
          {services.map((service, idx) => (
            <Link href={`quote/${service.link}`}
              key={idx}
              className="flex flex-col items-center justify-center rounded-2xl bg-[#46434362] cursor-pointer backdrop-blur-md backdrop-saturate-15 hover:border-2 hover:bg-[#47001E66] hover:border-[#FF3388] border border-white/20 shadow-lg transition-transform  h-64"
            >
              <Image
                alt={service.title}
                src={service.icon}
                className="mx-auto"
              />
              <h4 className="text-2xl font-medium text-white mt-6">
                {service.title}
              </h4>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
