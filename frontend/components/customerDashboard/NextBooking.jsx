import React from "react";

const NextBooking = () => {
  return (
    <div
      className="
        bg-white rounded-[12px] p-4
        flex flex-col gap-3
        sm:gap-4
        lg:h-[138px] lg:flex-row lg:items-center lg:justify-between
      "
    >
      {/* Left Side */}
      <div className="min-w-0">
        <p
          className="
            font-medium text-[#333333]
            text-[16px] sm:text-[18px] lg:text-[20px]
            mb-1 sm:mb-2
          "
        >
          Next Booking
        </p>
        <h2
          className="
            font-semibold text-[#141414]
            text-[22px] sm:text-[26px] md:text-[28px] lg:text-[32px]
            leading-tight truncate
          "
          title="Buff Butler"
        >
          Buff Butler
        </h2>
      </div>

      {/* Right Side */}
      <div
        className="
          flex items-center flex-wrap gap-x-2 gap-y-1
          font-medium text-[#292929]
          text-[14px] sm:text-[15px] lg:text-[16px]
          lg:whitespace-nowrap
        "
      >
        <span>14 Sep 2025 • 7:30 PM</span>
        {/* Divider visible only on lg when horizontal */}
        <span className="hidden lg:inline-block mx-2 h-4 w-px bg-[#EFE7EA]" />
        <span>Kyiv, Ukraine</span>
      </div>
    </div>
  );
};

export default NextBooking;
