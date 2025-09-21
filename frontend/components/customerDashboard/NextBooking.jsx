import React from "react";

const NextBooking = () => {
  return (
    <div className="bg-white rounded-[12px] h-[138px] p-4 flex justify-between items-center">
      {/* Left Side */}
      <div>
        <p className="text-[20px] mb-2 font-medium text-[#333333]">
          Next Booking
        </p>
        <h2 className="text-[32px] text-[#141414] font-semibold">
          Buff Butler
        </h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center font-medium text-[16px] text-[#292929]">
        <span>14 Sep 2025 • 7:30 PM</span>
        <span className="mx-2 h-4 w-px bg-[#EFE7EA]"></span>
        <span>Kyiv, Ukraine</span>
      </div>
    </div>
  );
};

export default NextBooking;
