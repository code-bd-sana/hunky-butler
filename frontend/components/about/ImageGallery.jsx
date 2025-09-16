import React from "react";

const ImageGallery = () => {
  return (
    <div className="w-full">
      <div className=" bg-white flex flex-col items-center justify-center p-1 md:p-4 space-y-1 md:space-y-3 mb-96 md:mb-[500px] my-10 md:my-20">
        {/* Top Row */}
        <div className="flex flex-wrap w-full gap-1 md:gap-3">
          <div className="flex-[2] sm:flex-[2] md:flex-[2] lg:flex-[3]">
            <img
              src="/ImageGalary/pic1.jpeg"
              alt="pic1"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
          <div className="flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[3.5] ">
            <img
              src="/ImageGalary/pic2.jpeg"
              alt="pic2"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
          <div className="flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[3.5] "> 
            <img
              src="/ImageGalary/pic3.jpeg"
              alt="pic3"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
          <div className="flex-[2] sm:flex-[2] md:flex-[2] lg:flex-[3] ">
            <img
              src="/ImageGalary/pic4.jpeg"
              alt="pic4"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-wrap w-full  gap-1 md:gap-3">
          <div className="flex-[2.5] sm:flex-[3] md:flex-[2.5] lg:flex-[4.8] ">
            <img
              src="/ImageGalary/pic5.jpeg"
              alt="pic5"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
          <div className="flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[4.8] ">
            <img
              src="/ImageGalary/pic6.jpeg"
              alt="pic6"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
          <div className="flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[4.6] ">
            <img
              src="/ImageGalary/pic7.jpeg"
              alt="pic7"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
          <div className="flex-[1.5] sm:flex-[2] md:flex-[1.5] lg:flex-[3.6] ">
            <img
              src="/ImageGalary/pic8.jpeg"
              alt="pic8"
              className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
