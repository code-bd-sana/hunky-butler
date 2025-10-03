import React from "react";
import MainTitle from "../shared/typography/MainTitle";

const Operate = () => {
  return (
    <div className="bg-[#F6F4F5] py-12 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}

        <div className="mb-10">
          <MainTitle text="Where We Operate" />
        </div>

        {/* Paragraphs */}
        <p className="text-[#333] text-[17px] leading-[1.7] mb-6">
          We are proud to cater to all locations across the UK and select areas
          in Europe. No matter where your event is taking place, our team is
          ready to travel to ensure your celebration is unforgettable. From
          vibrant cities like London, Manchester, and Liverpool to picturesque
          countryside towns, we bring our services to you.
        </p>

        <p className="text-[#333] text-[17px] leading-[1.7]">
          For our European customers, we also offer services in selected
          locations, ensuring we’re there to help make your event truly
          spectacular, wherever you are.
        </p>
      </div>
    </div>
  );
};

export default Operate;
