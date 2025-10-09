import Image from "next/image";
import React from "react";
import icon from "@/public/icons/arowright.png";

const WorkWithUsSection = () => {
  return (
    <div className="max-w-[1250px] capitalize mx-auto px-6 py-20 space-y-20">
      {/* Section 1 - What It’s Like To Work With Us */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Text */}
        <div className="order-2 lg:order-1 space-y-4">
          <h2 className="text-3xl md:text-[48px] font-medium text-[#111]">
            What It’s Like to Work With Us
          </h2>
          <p className="text-[#555] capitalize leading-relaxed">
            Working as a Hunky Butler means more than just looking the part. Our
            team brings energy, fun, and professionalism to every event — from
            cheeky hen parties in Liverpool to cocktail classes in London.
          </p>
          <ul className="space-y-4 capitalize text-[#444]">
            <li className="flex items-start gap-2">
              <Image
                src={icon}
                alt="arrow icon"
                className="w-5 h-5 mt-1 flex-shrink-0"
              />
              You’ll host games, serve drinks, and keep the party going.
            </li>
            <li className="flex items-start gap-2">
              <Image
                src={icon}
                alt="arrow icon"
                className="w-5 h-5 mt-1 flex-shrink-0"
              />
              You’ll work flexible shifts around your lifestyle.
            </li>
            <li className="flex items-start gap-2">
              <Image
                src={icon}
                alt="arrow icon"
                className="w-5 h-5 mt-1 flex-shrink-0"
              />
              You’ll be part of a trusted brand with 12,000+ verified bookings.
            </li>
          </ul>

          <p className="capitalize mt-6 text-[#444]">
            Whether you’re experienced or brand new to the role, we provide
            guidance and opportunities across the UK.
          </p>
        </div>

        {/* Right Image */}
        <div className="order-1 lg:order-2 relative w-full h-[300px] md:h-[380px] rounded-lg overflow-hidden shadow-md">
          <Image
            src="/Join/join3.jpg"
            alt="Working as a Hunky Butler at events"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Section 2 - Why Work With Hunky Butler Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Image */}
        <div className="relative w-full h-[300px] md:h-[380px] rounded-lg overflow-hidden shadow-md">
          <Image
            src="/Join/join2.jpg"
            alt="Team of butlers posing with clients"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Text */}
        <div className="space-y-4 h-full">
          <h2 className="text-3xl md:text-[48px] font-medium text-[#111]">
            Why Work With Hunky Butler Service?
          </h2>
          <ul className="space-y-4 capitalize text-[#444]">
            {[
              "Flexible hours that fit your schedule",
              "Fun, sociable work at parties and events",
              "Competitive pay with tips potential",
              "Nationwide gigs across Liverpool, Manchester, London, Birmingham, Leeds, and more",
              "Join a team with features on ITV News and partnerships with Ann Summers",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <Image
                  src={icon}
                  alt="arrow icon"
                  className="w-5 h-5 mt-1 flex-shrink-0"
                />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 3 - Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Text */}
        <div className="order-2 lg:order-1 h-full space-y-4">
          <h2 className="text-3xl md:text-[48px] font-medium text-[#111]">
            Requirements
          </h2>
          <ul className="space-y-4 capitalize text-[#444]">
            {[
              "Confident, reliable, and professional attitude",
              "Good fitness and appearance (no need to be a bodybuilder, just comfortable topless)",
              "Outgoing personality with great people skills",
              "Over 18 years old",
              "Must be based in the UK (with travel options for some roles)",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <Image
                  src={icon}
                  alt="arrow icon"
                  className="w-5 h-5 mt-1 flex-shrink-0"
                />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Image */}
        <div className="order-1 lg:order-2 relative w-full h-[300px] md:h-[380px] rounded-lg overflow-hidden shadow-md">
          <Image
            src="/Join/join1.jpg"
            alt="Hunky Butler requirements team"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Section 4 - How To Apply */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Image */}
        <div className="relative w-full h-[300px] md:h-[380px] rounded-lg overflow-hidden shadow-md">
          <Image
            src="/Join/join4.jpg"
            alt="Butler recruitment and application"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Text */}
        <div className="space-y-4 h-full">
          <h2 className="text-3xl md:text-[48px] font-medium text-[#111]">
            How To Apply?
          </h2>
          <p className="text-[#555] leading-relaxed">
            Fill out the form below and tell us why you’d make a great addition
            to the team. Please include:
          </p>
          <ul className="space-y-4 text-[#444]">
            {[
              "Your name and contact details",
              "The role you’re applying for",
              "A short message about your experience or why you’re applying",
              "Photos (required for buff butlers, strippers, or models)",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <Image
                  src={icon}
                  alt="arrow icon"
                  className="w-5 h-5 mt-1 flex-shrink-0"
                />
                {text}
              </li>
            ))}
          </ul>
          <p className="capitalize mt-6 text-[#444]">
            Our team will review your application and get back to you as soon as
            possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUsSection;
