"use client";
import Image from "next/image";
import fun1 from "../../public/KeepTheFun/fun1.jpeg";
import fun2 from "../../public/KeepTheFun/fun2.jpeg";
import fun3 from "../../public/KeepTheFun/fun3.jpeg";
import SecondaryTitle from "../shared/typography/SecondaryTitle";

const KeepTheFun = () => {
  const items = [
    {
      title: "Add Cheeky Buff Butlers",
      description:
        "Combine your cocktail class with our buff butlers for the ultimate hen party package. Butlers can serve drinks, host cheeky games, and make sure your group has the best time possible.",
      img: fun1,
    },
    {
      title: "Life Drawing & Cocktails",
      description:
        "For a creative twist, pair your cocktail class with a life drawing session! It’s a hilarious combination of art, drinks, and creativity that always gets the group laughing.",
      img: fun2,
    },
    {
      title: "Games & Challenges",
      description:
        "Our mixologists love adding interactive tasting games, team competitions, and party challenges to your class, making it a truly unforgettable experience.",
      img: fun3,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 text-center">
      {/* <h2 className="text-3xl md:text-4xl mb-10">Keep The Fun Flowing</h2> */}
      <SecondaryTitle text1={"Keep The Fun Flowing"} />

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl transition p-4 border-l border-gray-100">
            <Image
              src={item.img}
              alt={item.title}
              width={349}
              height={200}
              className="rounded-xl mb-4 object-cover w-full h-[200px]"
            />
            <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default KeepTheFun;
