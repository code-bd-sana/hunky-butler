import React from "react";

export default function UserCustomer({data}) {




const {data:summury, isLoading, error} = data;







  return (
    <div className="grid grid-cols-1  md:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#6A24A0] text-white p-6 pt-8 rounded-xl shadow-md space-y-4">
        <h2 className="text-base md:text-lg lg:text-xl font-medium">Total Customers</h2>

        <p className="text-3xl md:text-4xl lg:text-5xl font-bold">{summury?.totalCustomer
}    {isLoading && "..."} </p>
        <span className="text-lg opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#6A24A0] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-base md:text-lg lg:text-xl font-medium">Active Bookings</h2>

        <p className="text-3xl md:text-4xl lg:text-5xl font-bold">{summury?.totalCustomer
}    {isLoading && "..."}</p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>

      <div className="bg-[#A06224] text-white p-6  pt-8  rounded-xl shadow-md space-y-4">
        <h2 className="text-base md:text-lg lg:text-xl font-medium">New Signups This Month</h2>

        <p className="text-3xl md:text-4xl lg:text-5xl font-bold">

          {summury?.totalCustomerThisMonths

}    {isLoading && "..."}
        </p>
        <span className="text-lg  opacity-90">Updated 1 min ago</span>
      </div>
    </div>
  );
}
