import React from "react";
import defaultBanner from "@/public/ImageGalary/pic6.jpeg";

const LocationDynamicBanner = ({ image, title, tagline, description }) => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%), url(${defaultBanner.src})`,
      }}
      className="relative h-[70vh] w-full bg-cover bg-center flex items-center"
    >
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Column - Title + Tagline */}
        <div className="text-white">
          <h1 className="text-3xl md:text-5xl lg:text-[56px] font-bold leading-tight">
            {title}
          </h1>
          {tagline && (
            <p className="mt-4 text-lg md:text-2xl font-medium text-gray-200">
              {tagline}
            </p>
          )}
        </div>

        {/* Right Column - Description */}
        <div className="text-white">
          <p className="text-base md:text-lg leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationDynamicBanner;
