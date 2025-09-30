import React from "react";

export default function UserButtler({data}) {

  const {data:summury, isLoading, error} = data;
console.log(summury, "usr customer data");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#6A24A0] text-white p-6 pt-8 rounded-xl shadow-md space-y-4">
        <h2 className="text-base md:text-lg lg:text-xl font-medium">
          Total Butlers
        </h2>

        <p className="text-3xl md:text-4xl lg:text-5xl font-bold">{summury.performer}</p>
        <span className="text-sm md:text-base lg:text-lg opacity-90">
          Updated 1 min ago
        </span>
      </div>

      <div className="bg-[#6A24A0] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-base md:text-lg lg:text-xl font-medium">
          Verified
        </h2>

        <p className="text-3xl md:text-4xl lg:text-5xl font-bold">{summury.totalVerifiedButler
}</p>
        <span className="text-sm md:text-base lg:text-lg  opacity-90">
          Updated 1 min ago
        </span>
      </div>

      <div className="bg-[#A06224] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-base md:text-lg lg:text-xl font-medium">
          Pending Approval
        </h2>

        <p className="text-3xl md:text-4xl lg:text-5xl font-bold">0</p>
        <span className="text-sm md:text-base lg:text-lg  opacity-90">
          Updated 1 min ago
        </span>
      </div>
    </div>
  );
}
