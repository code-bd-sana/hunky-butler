import React from "react";
import Image from "next/image";

import henImg from "@/public/ImageGalary/henparty.jpeg";
import birthdayImg from "@/public/ImageGalary/pic1.jpeg";
import corporateImg from "@/public/ImageGalary/pic4.jpeg";

const BuffButlersEvents = ({ city }) => {
  return (
    <div className="max-w-7xl mx-auto py-24 space-y-12">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl text-center lg:text-4xl font-bold text-[#0A012A] mb-20">
        Top Buff Butler Services for {city} Events
      </h2>

      {/* Hen Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 mb-18 gap-8 items-center">
        <div>
          <Image
            src={henImg}
            width={500}
            height={320}
            alt={`Hen Parties in ${city}`}
            className="rounded-xl shadow-md"
          />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-3">Hen Parties</h3>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            Our <strong>Buff Butlers in {city}</strong> offer the ideal
            icebreaker for your <em>hen night</em> or <em>weekend away</em>.
            From cocktails to games, they handle it all with charm, leaving your
            guests smiling from start to finish.
          </p>
        </div>
      </div>

      {/* Birthday Celebrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
        <div className="md:order-2">
          <Image
            src={birthdayImg}
            width={500}
            height={320}
            alt={`Birthday Celebrations in ${city}`}
            className="rounded-xl shadow-md"
          />
        </div>
        <div className="md:order-1">
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            Birthday Celebrations
          </h3>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            Looking to level up your birthday bash? Surprise your guests with a
            fun and flirty butler who brings charisma, laughter, and five-star
            service. Whether it’s a 21st, 30th, or fabulous 50th, our butlers
            are the perfect addition — offering drink service, posing for
            photos, and making sure the birthday guest feels like a true VIP.
          </p>
        </div>
      </div>

      {/* Corporate Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 mb-18  gap-8 items-center">
        <div>
          <Image
            src={corporateImg}
            width={500}
            height={320}
            alt={`Corporate Events in ${city}`}
            className="rounded-xl shadow-md"
          />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            Corporate Events
          </h3>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            Corporate doesn’t have to mean boring. Inject some energy into your
            office party, product launch, or staff celebration with our polished
            professionals. <strong>Our Buff Butlers</strong> strike the perfect
            balance between playful and professional — greeting guests with a
            smile, helping serve refreshments, and engaging your team in fun
            (yet tasteful) party games.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuffButlersEvents;
