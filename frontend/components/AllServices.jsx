import React from "react";
import Image from "next/image";

import icon from "@/public/icons/arowright.png";
import butlerImg from "@/public/images/services/buttlers.jpeg";
import butlerImg2 from "@/public/ImageGalary/pic1.jpeg";
import butlerImg3 from "@/public/ImageGalary/pic5.jpeg";
import butlerImg4 from "@/public/ImageGalary/pic3.jpeg";
import background from "@/public/images/services/bg4.png";

import MainTitle from "./shared/typography/MainTitle";
import Link from "next/link";

export default function ALLServices() {
  const bulletPoints = [
    "Hosting party games and activities",
    "Serving drinks, canapés, or cocktails",
    "Welcoming and mingling with guests",
    "Photo opportunities to capture the memories",
  ];
  const bulletPoints2 = [
    "Professional model for the session",
    "All basic drawing materials provided (paper, pencils, etc.)",
    "Guided class with creative prompts and games",
    "Group photo opportunity at the end",
  ];
  const bulletPoints3 = [
    "Professional bartender/mixologist instructor",
    "All ingredients and equipment provided",
    "Hands-on cocktail making (2–3 drinks per guest)",
    "Fun games and competitions with prizes",
  ];

  return (
    <section className="pb-12 md:pb-24">
      <div
        style={{
          backgroundImage: `url(${background.src})`,
        }}
      >
        <div className="max-w-7xl mx-auto pt-30 px-4 md:px-6">
          <div className="flex flex-col-reverse md:flex-row-reverse md:items-center gap-10 md:gap-16">
            {/* === Text Content === */}
            <div className="flex-1">
              <MainTitle text="Buff Butlers" />
              <p className="text-[#3D3D3D] py-4 leading-[1.4] tracking-[-0.01em] text-lg">
                Charming, professional hosts who bring energy, fun, and elegance
                to your party. Ideal for hen nights, birthdays, and private
                gatherings, Buff Butlers keep the vibe lively while making
                guests feel special.
              </p>

              <p className="font-semibold text-xl mt-8 md:mt-16 capitalize">
                What included in this service
              </p>

              <ul className="mt-6 space-y-4">
                {bulletPoints.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <Image
                      src={icon}
                      alt="icon"
                      className="w-5 h-5 mt-1 flex-shrink-0"
                    />
                    <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="/service/buffButlers">
                  <button className="bg-[#ff1673] hover:bg-[#e41468] text-white font-semibold rounded-full px-6 py-3 text-base shadow-[0_6px_20px_rgba(255,22,115,0.2)] transition-all">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>

            {/* === Image Section === */}
            <div className="flex-1">
              <div className="relative w-full aspect-[581/632] sm:aspect-[581/450] md:aspect-[581/632] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
                <Image
                  src={butlerImg}
                  alt="Buff Butlers"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-30 px-4 md:px-6">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-16">
          {/* === Text Content === */}
          <div className="flex-1">
            <MainTitle text="Life Drawing" />
            <p className="text-[#3D3D3D] py-4 leading-[1.4] tracking-[-0.01em] text-lg">
              A tasteful, creative experience led by a professional model and
              instructor. Perfect for hen parties or group socials, Life Drawing
              blends fun and art in a relaxed environment.
            </p>

            <p className="font-semibold text-xl mt-8 md:mt-16 capitalize">
              What included in this service
            </p>

            <ul className="mt-6 space-y-4">
              {bulletPoints2.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <Image
                    src={icon}
                    alt="icon"
                    className="w-5 h-5 mt-1 flex-shrink-0"
                  />
                  <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link href="/service/lifeDrawing">
                <button className="bg-[#ff1673] hover:bg-[#e41468] text-white font-semibold rounded-full px-6 py-3 text-base shadow-[0_6px_20px_rgba(255,22,115,0.2)] transition-all">
                  Book Now
                </button>
              </Link>
            </div>
          </div>

          {/* === Image Section === */}
          <div className="flex-1">
            <div className="relative w-full aspect-[581/632] sm:aspect-[581/450] md:aspect-[581/632] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
              <Image
                src={butlerImg2}
                alt="Buff Butlers"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-30 px-4 md:px-6">
        <div className="flex flex-col-reverse md:flex-row-reverse md:items-center gap-10 md:gap-16">
          {/* === Text Content === */}
          <div className="flex-1">
            <MainTitle text="Cocktail Masterclasses" />
            <p className="text-[#3D3D3D] py-4 leading-[1.4] tracking-[-0.01em] text-lg">
              Shake, stir, and sip with an interactive cocktail experience
              hosted by an expert mixologist. Guests learn to craft signature
              drinks while enjoying plenty of laughter and fun.
            </p>

            <p className="font-semibold text-xl mt-8 md:mt-16 capitalize">
              What included in this service
            </p>

            <ul className="mt-6 space-y-4">
              {bulletPoints3.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <Image
                    src={icon}
                    alt="icon"
                    className="w-5 h-5 mt-1 flex-shrink-0"
                  />
                  <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link href="/service/cocktail">
                <button className="bg-[#ff1673] hover:bg-[#e41468] text-white font-semibold rounded-full px-6 py-3 text-base shadow-[0_6px_20px_rgba(255,22,115,0.2)] transition-all">
                  Book Now
                </button>
              </Link>
            </div>
          </div>

          {/* === Image Section === */}
          <div className="flex-1">
            <div className="relative w-full aspect-[581/632] sm:aspect-[581/450] md:aspect-[581/632] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
              <Image
                src={butlerImg3}
                alt="Buff Butlers"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-30 px-4 md:px-6">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-16">
          {/* === Text Content === */}
          <div className="flex-1">
            <MainTitle text="Cocktail Masterclasses" />
            <p className="text-[#3D3D3D] py-4 leading-[1.4] tracking-[-0.01em] text-lg">
              Shake, stir, and sip with an interactive cocktail experience
              hosted by an expert mixologist. Guests learn to craft signature
              drinks while enjoying plenty of laughter and fun.
            </p>

            <p className="font-semibold text-xl mt-8 md:mt-16 capitalize">
              What included in this service
            </p>

            <ul className="mt-6 space-y-4">
              {bulletPoints3.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <Image
                    src={icon}
                    alt="icon"
                    className="w-5 h-5 mt-1 flex-shrink-0"
                  />
                  <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link href="/service/strippers">
                <button className="bg-[#ff1673] hover:bg-[#e41468] text-white font-semibold rounded-full px-6 py-3 text-base shadow-[0_6px_20px_rgba(255,22,115,0.2)] transition-all">
                  Book Now
                </button>
              </Link>
            </div>
          </div>

          {/* === Image Section === */}
          <div className="flex-1">
            <div className="relative w-full aspect-[581/632] sm:aspect-[581/450] md:aspect-[581/632] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
              <Image
                src={butlerImg4}
                alt="Buff Butlers"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
