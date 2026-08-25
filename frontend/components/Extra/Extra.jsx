import Image from "next/image";
import lifeDrawing1 from "../../public/service/servicedetails1.jpeg";
import lifeDrawing2 from "../../public/service/servicedetails2.jpeg";
import React from "react";
import SecondaryTitle from "../shared/typography/SecondaryTitle";

const Extra = () => {
  return (
    <main className="max-w-7xl mx-auto my-16 grid md:grid-cols-2 gap-28 p-4 md:p-0">
      {/* Section 1 */}
      <div>
        {/* <h2 className="text-xl md:text-4xl mb-4">
          Fully Mobile Life Drawing Classes Our Mobile Life Drawing Classes Work
          Anywhere
        </h2> */}
        <SecondaryTitle
          text1={
            " Fully Mobile Life Drawing Classes Our Mobile Life Drawing Classes Work Anywhere"
          }
        />
        <p className="text-gray-600 mb-4">
          From stylish city apartments and isolated suites to cozy cottages and
          hired venues, we bring all the materials, easels, and drawing
          supplies. Add some life to your event!
        </p>
        <p className="text-gray-600 mb-6 text-lg">
          Whether you’re planning an intimate girls’ night or a big bash, our
          life drawing sessions guarantee fun, laughter, and a creative
          experience to remember.
        </p>
        <button className="border-2 border-[#FF006A] text-[#FF006A] px-4 py-2 rounded-full hover:bg-[#FF006A] transition hover:">
          Book Now
        </button>
      </div>

      <div className="flex justify-center">
        <Image
          src={lifeDrawing1}
          alt="Life Drawing Session"
          width={582}
          height={475}
          className="rounded-3xl object-cover"
        />
      </div>

      {/* Section 2 */}
      <div className="flex justify-center order-3 md:order-none">
        <Image
          src={lifeDrawing2}
          alt="Life Drawing Party"
          width={582}
          height={475}
          className="rounded-3xl object-cover"
        />
      </div>

      <div>
        <h2 className="text-xl md:text-4xl mb-4">
          What Makes Our Life Drawing Parties Stand Out?
        </h2>
        <p className="text-gray-600 mb-6">
          It’s more than just sketching, we add fun twists to keep everyone
          laughing!
        </p>
        <ul className="space-y-2 text-gray-700">
          <li>🎨 Serving Drinks & Snacks</li>
          <li>😂 Cheeky Party Games</li>
          <li>🖌️ Friendly & Fun Life Drawing Models</li>
          <li>🎶 Music & Laughter</li>
          <li>📸 Memorable Fun & Group Photos</li>
        </ul>
      </div>
    </main>
  );
};

export default Extra;
