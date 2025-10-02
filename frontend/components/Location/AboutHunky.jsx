import React from "react";
import Image from "next/image";

import image from "@/public/logo/logo.png";
import bg from "@/public/images/services/bg3.png";
import MainTitle from "../shared/typography/MainTitle";

const AboutHunky = () => {
  return (
    <div className="relative bg-[#F6F4F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Title at the top */}

        {/* Content area */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          {/* Left Logo */}
          <section className="flex-1 flex justify-center">
            <Image
              alt="Hunky Butler Logo"
              src={image}
              className="w-[280px] md:w-[360px] lg:w-[420px] h-auto drop-shadow-xl"
              priority
            />
          </section>

          {/* Right Text */}
          <section className="flex-1">
            <div className="space-y-5 text-[#333] text-[17px] leading-[1.7]">
              <div>
                <MainTitle text="About Hunky Butler Service" />
              </div>

              <p>
                At Hunky Butler Service, we pride ourselves on offering a unique
                blend of charm, professionalism, and fun.
              </p>
              <p>
                Whether it’s a hen party, birthday, corporate event, or any
                special occasion, our buff butlers, life drawing classes,
                cocktail masterclasses, and stripper services are designed to
                bring laughter, excitement, and sophistication to every
                celebration.
              </p>
              <p>
                Our team of experienced and personable butlers is committed to
                ensuring your event runs smoothly and your guests are
                entertained.
              </p>
              <p>
                With a cheeky twist and a tailored approach, we strive to create
                experiences that leave lasting memories.
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className="absolute top-0 left-0 overflow-hidden">
        {" "}
        <Image alt="img" src={bg} className="min-w-screen" />{" "}
      </div>
    </div>
  );
};

export default AboutHunky;
