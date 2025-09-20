import React from "react";

const FinancialsCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#6A24A0] text-white p-6 pt-8 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Gross Revenue (Sep 2025)</h2>

        <p className="text-5xl font-bold">£94,250</p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#6A24A0] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Platform Fees (Sep 2025)</h2>

        <p className="text-5xl font-bold">£28,250</p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#A06224] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-medium">Performer Payouts (Sep 2025)</h2>

        <p className="text-5xl font-bold">£64,250</p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>
    </div>
  );
};

export default FinancialsCard;
