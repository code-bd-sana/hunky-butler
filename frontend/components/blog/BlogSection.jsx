import React from "react";
import Image from "next/image";

const BlogSection = () => {
  const posts = [
    {
      id: 1,
      date: "February 11, 2014",
      title: "Cocktail Making: Tools You Need At Home",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection1.jpeg", // put your image inside public folder
    },
    {
      id: 2,
      date: "October 24, 2018",
      title: "7 Hen Party Ideas Tools That Always Work",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection2.jpeg",
    },
    {
      id: 3,
      date: "May 31, 2015",
      title: "Why Dynamic Pricing Keeps Costs Fair",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection3.jpeg",
    },
    {
      id: 4,
      date: "February 11, 2014",
      title: "Cocktail Making: Tools You Need At Home",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection4.jpeg", // put your image inside public folder
    },
    {
      id: 5,
      date: "October 24, 2018",
      title: "7 Hen Party Ideas Tools That Always Work",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection5.jpeg",
    },
    {
      id: 6,
      date: "May 31, 2015",
      title: "Why Dynamic Pricing Keeps Costs Fair",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection6.jpeg",
    },
    {
      id: 7,
      date: "February 11, 2014",
      title: "Cocktail Making: Tools You Need At Home",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection7.jpeg", // put your image inside public folder
    },
    {
      id: 8,
      date: "October 24, 2018",
      title: "7 Hen Party Ideas Tools That Always Work",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection8.jpeg",
    },
    {
      id: 9,
      date: "May 31, 2015",
      title: "Why Dynamic Pricing Keeps Costs Fair",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Blog/BlogSection/BlogSection9.jpeg",
    },
  ];
  return (
    <section className="max-w-[1240px] mx-auto px-4 py-4 md:py-12 pb-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl overflow-hidden">
            <Image
              src={post.img}
              alt={post.title}
              width={396}
              height={372}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="mt-4">
              <p className="text-pink-600 text-sm font-medium">{post.date}</p>
              <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
              <p className="text-[#808080] text-base mt-2">{post.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
