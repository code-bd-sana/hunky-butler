"use client";
import React, { useEffect, useState } from "react";
import SecondaryTitle from "../shared/typography/SecondaryTitle";
import SubTitle from "../shared/typography/SubTitle";
import { ReviewCard } from "./Review";
import { Marquee } from "../magicui/marquee";
import Image from "next/image";
import bg1 from "@/public/images/services/bg.png";
import bg2 from "@/public/images/services/bg2.png";

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      const placeId = "YOUR_PLACE_ID"; // Replace with your Place ID
      const apiKey = "YOUR_API_KEY";   // Replace with your API Key

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,profile_photo_url&key=${apiKey}`
        );
        const data = await res.json();

        if (data.result?.reviews) {
          const formattedReviews = data.result.reviews.map((r) => ({
            name: r.author_name,
            username: `${r.rating} ⭐ • ${r.relative_time_description}`,
            body: r.text,
            img: r.profile_photo_url || "/icons/memoji.png",
          }));
          setReviews(formattedReviews);
        }
      } catch (err) {
        console.error("Google reviews fetch error:", err);
      }
    };

    fetchGoogleReviews();
  }, []);

  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <div className="bg-[#ECDFE4] relative px-6 overflow-hidden lg:px-0">
      <div className="py-16 max-w-7xl mx-auto container md:px-8 lg:px-0">
        <div className="text-center">
          <SecondaryTitle text1="Trusted by Thousands of Party Planners Across the UK" />
        </div>
        <div className="text-center max-w-2xl mx-auto">
          <SubTitle text="From hen parties in Liverpool to birthdays in Leeds, our customers love the energy, professionalism, and laughter our team brings. With hundreds of glowing reviews, here’s what real clients say:" />
        </div>

        <div className="relative z-30 flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#ECDFE4]"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#ECDFE4]"></div>
        </div>
      </div>

      <div className="absolute top-0 left-0 overflow-hidden">
        <Image alt="bg1" src={bg1} className="min-w-screen" />
      </div>
      <div className="absolute bottom-0 leading-0">
        <Image alt="bg2" src={bg2} />
      </div>
    </div>
  );
}
