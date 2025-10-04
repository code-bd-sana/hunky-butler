"use client";
import Image from "next/image";
import React, { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";

const buttons = ["All", "Done", "Pending", "Processing"];

const payouts = [
  {
    name: "James H.",
    id: "#BK202509",
    joinDate: "14 Sep 2025",
    spent: "£290.00",
    status: "Done",
  },
  {
    name: "Darlene Robertson",
    id: "#BK202510",
    joinDate: "15 Sep 2025",
    spent: "£180.00",
    status: "Pending",
  },
  {
    name: "Bessie Cooper",
    id: "#BK202511",
    joinDate: "16 Sep 2025",
    spent: "£500.00",
    status: "Done",
  },
  {
    name: "James H.",
    id: "#BK202512",
    joinDate: "17 Sep 2025",
    spent: "£320.00",
    status: "Processing",
  },
  {
    name: "James H.",
    id: "#BK202512",
    joinDate: "17 Sep 2025",
    spent: "£320.00",
    status: "Cancelled",
  },
  {
    name: "James H.",
    id: "#BK202512",
    joinDate: "17 Sep 2025",
    spent: "£320.00",
    status: "Processing",
  },
  {
    name: "James H.",
    id: "#BK202512",
    joinDate: "17 Sep 2025",
    spent: "£320.00",
    status: "Processing",
  },
  {
    name: "James H.",
    id: "#BK202512",
    joinDate: "17 Sep 2025",
    spent: "£320.00",
    status: "Processing",
  },
];

const statusColors = {
  Completed: "bg-[#E0F3E6] text-[#00992B]",
  Ongoing: "bg-blue-100 text-blue-600",
  Cancelled: "bg-gray-100 text-gray-600",
  Pending: "bg-[#f9e2fc] text-[#C90CE6]",
};

const Payouts = () => {
  const [activeButton, setActiveButton] = useState("All");
  const [open, setOpen] = useState(false);

  const filteredPayouts =
    activeButton === "All"
      ? payouts
      : payouts.filter((p) => p.status === activeButton);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header — copied style from Booking */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-0">
          Payouts
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-full bg-[#F6F4F5] p-1 h-[40px] sm:h-[44px] lg:h-[48px] overflow-x-auto whitespace-nowrap lg:overflow-visible lg:whitespace-normal [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {buttons.map((btn) => {
              const isActive = activeButton === btn;
              return (
                <button
                  key={btn}
                  onClick={() => setActiveButton(btn)}
                  className={`shrink-0 rounded-full font-medium transition px-2 py-1.5 text-[12px] sm:px-4 sm:py-2 sm:text-[12px] lg:px-5 lg:py-2 lg:text-[13px] ${
                    isActive ? "text-white" : "text-gray-600 bg-white"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: "#FF006A",
                          boxShadow: "0 1px 2px rgba(0,0,0,.06)",
                        }
                      : { border: "1px solid #E5E7EB" }
                  }
                >
                  {btn}
                </button>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex justify-center items-center gap-1.5 sm:ml-auto relative">
            <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-1 rounded-full font-medium bg-[#F6F4F5] text-[#292929] px-4 py-1.5 h-[40px] text-[12px] sm:px-5 sm:py-2 sm:h-[48px] sm:text-[13px]"
            >
              30 Days
              <MdKeyboardArrowDown
                className={`transition-transform ${
                  open ? "rotate-180" : ""
                } text-base sm:text-xl`}
              />
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-40 rounded-lg bg-white shadow-lg z-10">
                <ul className="py-2 text-sm text-[#374151]">
                  {["7 Days", "15 Days", "30 Days", "90 Days"].map((v) => (
                    <li key={v}>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-pink-50"
                        onClick={() => setOpen(false)}
                      >
                        {v}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="flex items-center gap-1 rounded-full font-medium bg-[#F6F4F5] px-4 py-1.5 h-[40px] text-[12px] sm:px-5 sm:py-2 sm:h-[48px] sm:text-[13px]"
              style={{ color: "#FF006A" }}
            >
              See All
              <LuArrowUpRight className="text-base sm:text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Table — keep payouts table */}
      <div className="overflow-x-auto max-h-[370px] max-w-[76vw] overflow-scroll scrollbar-hide overflow-y-auto">
        <table className="w-full text-left overflow-scroll border-collapse">
          <thead className="border-b">
            <tr className="text-[#333333] text-base">
              <th className="p-3">Performer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Ref</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody className="text-[16px] text-[#333333] mt-2">
            {filteredPayouts.map((p, i) => (
              <tr key={i} className="h-[56px] bg-white hover:bg-zinc-50/60">
                <td className="px-4 sm:px-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src="/Dashboard/customer.png"
                      alt={p.name}
                      width={32}
                      height={32}
                      className="rounded-[8px] object-cover"
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                </td>
                <td className="px-2 align-middle text-zinc-600 whitespace-nowrap">
                  {p.spent}
                </td>
                <td className="px-2 align-middle whitespace-nowrap">{p.id}</td>
                <td className="px-2 align-middle whitespace-nowrap">
                  {p.joinDate}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      statusColors[p.status]
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payouts;
