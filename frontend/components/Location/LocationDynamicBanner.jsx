import React from "react";
import defaultBanner from "@/public/ImageGalary/pic6.jpeg";

const LocationDynamicBanner = ({ image, title, tagline, description }) => {
  // Background layers, painted top to bottom:
  //   1. dark gradient for text legibility
  //   2. the city-specific image, if that city defines one
  //   3. the shared default banner
  //
  // CSS stacks multiple background images and simply skips any layer that
  // fails to load, so if a city's image is missing the default shows through
  // instead of leaving an empty banner. That means a city photo can be added
  // later just by dropping the file into /public/images/ - no code change.
  const backgroundImage = [
    "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)",
    image ? `url(${image})` : null,
    `url(${defaultBanner.src})`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      style={{ backgroundImage }}
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
