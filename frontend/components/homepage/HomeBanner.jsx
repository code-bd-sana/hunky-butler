// "use client";

import { FaStar } from "react-icons/fa";

export default function HomeBanner() {
  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/BannerVid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-start md:justify-end px-6 md:px-12 lg:px-24 pb-32 pt-[160px] md:pt-0 text-white">
        <div className="flex w-full flex-col items-center md:items-start lg:flex-row lg:justify-between lg:items-center gap-10 mx-auto">
          {/* Left Side: Heading + Buttons */}
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Buff Butlers & Hen Party
              Entertainment Across the UK
            </h1>

            <p className="mt-4 text-lg md:text-xl text-[#F6F4F5]">
              Looking for the ultimate hen party entertainment? You’ve come to the right place. Hunky Butler Service is the UK’s most popular buff butler and hen party entertainment company. But the fun doesn’t stop there — we also offer topless waiters, life drawing classes, cocktail masterclasses, and much more.
            </p>
            <p className="mt-4 text-lg md:text-xl text-[#F6F4F5]">
              Our cheeky butlers aren’t just for show — they’re professional, friendly, and know how to keep your party flowing with games, drinks, and laughter. Whether you’re celebrating in Liverpool, Manchester, London, Birmingham, Leeds, or beyond, our team is ready to make your night unforgettable.
            </p>

            <div className="mt-6 md:mt-12 flex flex-wrap justify-center md:justify-start gap-4">
              <button className="rounded-full bg-[#FF006A] px-6 py-3 text-lg font-medium shadow-md transition">
                Get An Instant Quote
              </button>
              <button className="rounded-full bg-white px-6 py-3 text-lg font-medium text-black shadow-md transition">
                Explore Services
              </button>
            </div>

            {/* Rating (mobile & mid) */}
            <div className="mt-6 flex flex-col items-center md:items-start text-center md:text-left lg:hidden">
              <div className="flex items-center gap-2">
                <span className="text-[48px] font-semibold">4.9</span>
                <div className="flex text-yellow-400">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar size={18} key={i} />
                    ))}
                </div>
              </div>
              <p className="mt-1 text-[18px] text-[#E8E8E8]">
                Over 3,000 Reviews · Nationwide Coverage
              </p>
            </div>
          </div>

          {/* Rating (desktop right side) */}
          <div className="hidden lg:flex flex-col items-end text-right">
            <div className="flex items-center gap-2">
              <span className="text-[48px] font-semibold">4.9</span>
              <div className="flex gap-1 text-yellow-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar size={18} key={i} />
                  ))}
              </div>
            </div>
            <p className="mt-1 text-[18px] text-[#E8E8E8]">
              Over 3,000 Reviews · Nationwide Coverage
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
