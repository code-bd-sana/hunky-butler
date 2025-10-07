import Image from "next/image";
import lifeDrawing1 from "../../public/service/servicedetails1.jpeg";
import lifeDrawing2 from "../../public/service/servicedetails2.jpeg";
import cocktail1 from "../../public/Entertainment/img.jpeg";
import cocktail2 from "../../public/KeepTheFun/cocktail2.jpeg";
import React from "react";
import SecondaryTitle from "../shared/typography/SecondaryTitle";

const Cocktail = () => {
  return (
    <main className="max-w-7xl mx-auto my-16 grid md:grid-cols-2 gap-28 p-4 md:p-0">
      {/* Section 1 */}
      <div>
        {/* <h2 className="text-xl md:text-4xl mb-4">
          Fully Mobile Life Drawing Classes Our Mobile Life Drawing Classes Work
          Anywhere
        </h2> */}
        <SecondaryTitle text1={"Why Cocktail Making Classes Are So Popular?"} />
        <p className="text-gray-600 mb-4">
          Cocktail making is the perfect blend of hands-on fun and social
          entertainment. Everyone gets involved, whether it’s shaking martinis,
          muddling mojitos, or laughing through the challenges. It’s a brilliant
          icebreaker and works for groups of all sizes, from intimate birthdays
          to large hen parties.
        </p>
      </div>

      <div className="flex justify-center">
        <Image
          src={cocktail1}
          alt="Life Drawing Session"
          width={582}
          height={475}
          className="rounded-3xl object-cover"
        />
      </div>

      {/* Section 2 */}
      <div className="flex justify-center order-3 md:order-none">
        <Image
          src={cocktail2}
          alt="Life Drawing Party"
          width={582}
          height={475}
          className="rounded-3xl object-cover"
        />
      </div>

      <div>
        {/* <h2 className="text-xl md:text-4xl mb-4">
          What Makes Our Life Drawing Parties Stand Out?
        </h2> */}
        <SecondaryTitle text1={"Mobile Cocktail Classes"} />
        <p className="text-gray-600 mb-6">
          We bring the bar to you! Our mobile cocktail making classes are
          available in apartments, houses, offices, or hired venues. Everything
          is included — from shakers and ingredients to glassware — so you don’t
          need to worry about a thing. Just pick the place, and we’ll set up
          your own cocktail bar experience. Perfect for staycations, rented
          apartments, and private homes.
        </p>
      </div>
    </main>
  );
};

export default Cocktail;
