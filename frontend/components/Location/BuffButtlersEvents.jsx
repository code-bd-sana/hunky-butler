import React from "react";
import Image from "next/image";

import henImg from "@/public/ImageGalary/henparty.jpeg";
import birthdayImg from "@/public/ImageGalary/pic1.jpeg";
import corporateImg from "@/public/ImageGalary/pic4.jpeg";

const IMAGES = [henImg, birthdayImg, corporateImg];

// Butler copy, used when a page does not supply its own occasions. This keeps
// the 35 legacy city pages exactly as they were.
const FALLBACK = [
  {
    title: "Hen Parties",
    body:
      "The ideal icebreaker for a hen night or weekend away. From cocktails to games, our butlers handle it all with charm, leaving your guests smiling from start to finish.",
  },
  {
    title: "Birthday Celebrations",
    body:
      "Surprise your guests with a fun and flirty butler who brings charisma, laughter and five-star service. Whether it is a 21st, a 30th or a fabulous 50th, they serve drinks, pose for photos and make sure the birthday guest feels like a VIP.",
  },
  {
    title: "Corporate Events",
    body:
      "Corporate does not have to mean boring. Our butlers strike the balance between playful and professional, greeting guests, helping serve refreshments and running tasteful party games at office parties and staff celebrations.",
  },
];

/**
 * Occasion breakdown for a location page.
 *
 * The copy comes from the page data rather than being hardcoded, because life
 * drawing at a hen party is a different pitch to butlers at a corporate event.
 * Repeating one block of butler copy across every service page is precisely the
 * near-duplicate content that stops these pages ranking.
 */
const BuffButlersEvents = ({ city, serviceName = "Buff Butlers", occasions }) => {
  const items = (occasions && occasions.length ? occasions : FALLBACK).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      <h2 className="text-2xl md:text-3xl text-center lg:text-4xl font-bold text-[#0A012A] mb-20">
        {serviceName} for {city} Parties and Celebrations
      </h2>

      {items.map((item, index) => {
        const reversed = index % 2 === 1;
        return (
          <div
            key={item.title}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div className={reversed ? "md:order-2" : ""}>
              <Image
                src={IMAGES[index] || IMAGES[0]}
                width={500}
                height={320}
                alt={item.title + " in " + city}
                className="rounded-xl shadow-md"
              />
            </div>
            <div className={reversed ? "md:order-1" : ""}>
              <h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {item.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BuffButlersEvents;
