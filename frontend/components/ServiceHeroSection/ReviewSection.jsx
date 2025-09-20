import React from "react";
import SecondaryTitle from "../shared/typography/SecondaryTitle";
import SubTitle from "../shared/typography/SubTitle";
import { ReviewCard } from "./Review";
import { Marquee } from "../magicui/marquee";
import img from "@/public/icons/memoji.png";
import bg1 from "@/public/images/services/bg.png";
import bg2 from "@/public/images/services/bg2.png";
import Image from "next/image";

export default function ReviewSection() {
  const reviews = [
    {
      name: "Jack",
      username: "@jack",
      body: "The butler was on time and so fun, our hen party was perfect! Professional, respectful, and worth every penny.",
      img: img.src,
    },
    {
      name: "Jill",
      username: "@jill",
      body: "The butler was on time and so fun, our hen party was perfect! Professional, respectful, and worth every penny.",
      img: img.src,
    },
    {
      name: "John",
      username: "@john",
      body: "The butler was on time and so fun, our hen party was perfect! Professional, respectful, and worth every penny.",
      img: img.src,
    },
    {
      name: "Jane",
      username: "@jane",
      body: "The butler was on time and so fun, our hen party was perfect! Professional, respectful, and worth every penny.",
      img: img.src,
    },
    {
      name: "Jenny",
      username: "@jenny",
      body: "The butler was on time and so fun, our hen party was perfect! Professional, respectful, and worth every penny.",
      img: img.src,
    },
    {
      name: "James",
      username: "@james",
      body: "The butler was on time and so fun, our hen party was perfect! Professional, respectful, and worth every penny.",
      img: img.src,
    },
  ];

  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <div className="bg-[#ECDFE4] relative px-6 overflow-hidden lg:px-0">
      <div className="py-16  max-w-7xl mx-auto container md:px-8 lg:px-0">
        <div className="text-center">
          <SecondaryTitle
            text1={"Trusted by Thousands of Party Planners Across the UK"}
          />
        </div>
        <div className="text-center px-36">
          <SubTitle
            text={
              "From hen parties in Liverpool to birthdays in Leeds, our customers love the energy, professionalism, and laughter our team brings. With Hundreds of glowing reviews, here’s what real clients say:"
            }
          />
        </div>

        <div className="relative z-30 flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#ECDFE4]"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#ECDFE4]"></div>
        </div>
      </div>

      <div className="absolute top-0 left-0 overflow-hidden">
        {" "}
        <Image alt="img" src={bg1} className="min-w-screen" />{" "}
      </div>
      <div className="absolute bottom-0 leading-0">
        {" "}
        <Image alt="img" src={bg2} />{" "}
      </div>
    </div>
  );
}
