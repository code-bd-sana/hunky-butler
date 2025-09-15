import React from "react";
import Image from "next/image";

const Planning = () => {
  const posts = [
    {
      id: 1,
      date: "February 11, 2014",
      title: "Cocktail Making: Tools You Need At Home",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Planning/planningPic1.jpeg", // put your image inside public folder
    },
    {
      id: 2,
      date: "October 24, 2018",
      title: "7 Hen Party Ideas Tools That Always Work",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Planning/planningPic2.jpeg",
    },
    {
      id: 3,
      date: "May 31, 2015",
      title: "Why Dynamic Pricing Keeps Costs Fair",
      desc: "From Buff Butlers to Masterclasses—transparent pricing, verified staff, anywhere in your postcode.",
      img: "/Planning/planningPic3.jpeg",
    },
  ];
  return (
    // <div>
    //   <div className="text-center mb-20 space-y-6">
    //     <h1 className="text-6xl font-medium">
    //       Planning{" "}
    //       <span className="text-[#FF006A] italic">inspiration & tips</span>
    //     </h1>
    //     <p>
    //       From Buff Butlers to Cocktail Masterclasses—transparent pricing,
    //       verified staff, anywhere in your postcode.
    //     </p>
    //   </div>
    //   {cardsData.map((card, index) => (
    //     <div
    //       key={index}
    //       className="max-w-sm rounded-lg overflow-hidden shadow-lg m-4 bg-white"
    //     >
    //       <img className="w-full" src={image} alt={title} />
    //       <div className="p-4">
    //         <p className="text-pink-600 text-sm flex items-center">
    //           <FaCalendarAlt className="mr-2" /> {date}
    //         </p>
    //         <h3 className="text-xl font-bold mb-2">{title}</h3>
    //         <p className="text-gray-700 text-base">{description}</p>
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <section className="max-w-6xl mx-auto px-4 py-12 pb-[500px]">
      <div className="text-center mb-20 space-y-6">
        <h1 className="text-6xl font-medium">
          Planning{" "}
          <span className="text-[#FF006A] italic">inspiration & tips</span>
        </h1>
        <p>
          From Buff Butlers to Cocktail Masterclasses—transparent pricing,
          verified staff, anywhere in your postcode.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg overflow-hidden">
            <Image
              src={post.img}
              alt={post.title}
              width={600}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="mt-4">
              <p className="text-pink-600 text-sm font-medium">{post.date}</p>
              <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{post.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Planning;
