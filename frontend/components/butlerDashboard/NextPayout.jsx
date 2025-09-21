import React from "react";

const NextPayout = () => {
  return (
    <div
      className="
        bg-white h-[138px] rounded-[12px] py-4 px-6
        flex flex-col gap-3
        sm:gap-4
        lg:flex-row lg:items-center lg:justify-between
      "
    >
      {/* Left */}
      <div className="min-w-0">
        <p
          className="mb-1 text-[#333333] font-medium
                       text-[13px] sm:text-[14px] lg:text-[20px]"
        >
          Next Payout
        </p>
        <h2
          className="font-semibold text-[#141414]
                       text-[24px] sm:text-[26px] lg:text-[32px]"
        >
          £310
        </h2>
      </div>

      {/* Right */}
      <div
        className="
          flex items-center flex-wrap gap-x-3 gap-y-1
          font-medium text-[#292929]
          text-[13px] sm:text-[14px]
          lg:whitespace-nowrap
        "
      >
        <span>14 Sep 2025 - 7:30 PM</span>
        {/* dividers only when horizontal on lg */}
        <span className="hidden lg:inline-block mx-3 h-4 w-px bg-[#EFE7EA]" />
        <span>Life Drawing</span>
        <span className="hidden lg:inline-block mx-3 h-4 w-px bg-[#EFE7EA]" />
        <span>Manchester, UK</span>
      </div>
    </div>
  );
};

export default NextPayout;
