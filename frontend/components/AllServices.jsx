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
    "Hands-on cocktail making (3 drinks per guest)",
    "Fun games and competitions with prizes",
  ];
  const bulletPoints4 = [
    "Professional, reliable entertainer",
    "Customisable performance style and Outfit (fun, cheeky, or classic)",
    "Music and props for added flair",
    "Photo opportunities with guests (where appropriate)",
  ];

  return (
    <section className="pb-12 md:pb-24">
      <div
        style={{
          backgroundImage: `url(${background.src})`,
        }}
      >
        <div className="max-w-7xl mx-auto pt-10">
          <h1 className="text-center font-medium pt-6 text-[32px]">
            Our Entertainment Services Planning the perfect party can be
            stressful — that’s where we come in. At Hunky Butler Service, we’ve
            curated a range of entertainment options to keep your guests
            laughing, sipping, and celebrating in style. Whether you’re
            organising a hen do in Liverpool, a birthday party in Manchester, or
            a corporate night in London, our team of professional hosts bring
            energy, fun, and reliability to every occasion.
          </h1>
        </div>
        <div className="max-w-7xl mx-auto pt-30 px-4 md:px-6">
          <div className="flex flex-col-reverse md:flex-row-reverse md:items-center gap-10 md:gap-16">
            {/* === Text Content === */}
            <div className="flex-1">
              <MainTitle text="Buff Butlers" />
              <p className="text-[#3D3D3D] py-4 leading-[1.4] tracking-[-0.01em] text-lg">
                Our buff butlers are cheeky, charming, and professional hosts
                who know how to get the party started. Perfect for hen nights,
                birthdays, and private events, they serve drinks, host games,
                mingle with guests, and make sure everyone is having a great
                time. More than just eye-candy, our butlers bring energy and fun
                to every occasion, leaving your guests with memories that last
                long after the night ends.
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
              Add a creative twist to your celebration with our life drawing
              classes. Led by a professional model, this activity combines art,
              laughter, and cheeky fun — making it one of the most popular
              choices for hen parties and group socials. Guests of all abilities
              can join in, with guidance and games provided to keep the mood
              light and enjoyable. It’s the perfect mix of classy and cheeky.
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
              Shake, stir, and sip with our interactive cocktail masterclasses.
              Hosted by an expert mixologist (and often paired with our buff
              butlers), this experience is perfect for parties that want
              hands-on fun. Guests will learn how to craft signature cocktails
              while enjoying games, laughter, and of course, plenty of drinks.
              It’s an experience that blends entertainment with delicious
              cocktails, tailored to your group.
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
              Turn up the excitement with our professional male strippers, who
              deliver tasteful, cheeky, and high-energy performances. Whether
              you’re planning a hen night, birthday party, or milestone
              celebration, our strippers bring the wow factor. Choose from fun,
              cheeky, or more classic styles — whatever matches your vibe. With
              music, costumes, and plenty of audience interaction, it’s the
              ultimate party highlight.
            </p>

            <p className="font-semibold text-xl mt-8 md:mt-16 capitalize">
              What included in this service
            </p>

            <ul className="mt-6 space-y-4">
              {bulletPoints4.map((item, idx) => (
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
