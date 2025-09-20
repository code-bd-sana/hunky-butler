"use client";
import Image from "next/image";
import React, { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
const buttons = ["All", "Completed", "Ongoing", "Cancelled"];
const payouts = [
  {
    name: "James H.",
    id: "#BK202509",
    joinDate: "14 Sep 2025",
    services: "3 Times",
    location: "Shoreditch, London",
    spent: "£290.00",
    color: "bg-yellow-400",
    status: "Done",
  },
  {
    name: "Darlene Robertson",
    id: "#BK202509",
    joinDate: "14 Sep 2025",
    services: "2 Times",
    location: "Berlin, Germany",
    spent: "£290.00",
    color: "bg-pink-500",
    status: "Pending",
  },
  {
    name: "Bessie Cooper",
    id: "#BK202509",
    joinDate: "14 Sep 2025",
    services: "6 Times",
    location: "Los Angeles, CA",
    spent: "£290.00",
    color: "bg-purple-500",
    status: "Done",
  },
  {
    name: "James H.",
    id: "#BK202509",
    joinDate: "14 Sep 2025",
    services: "4 Times",
    location: "Shoreditch, London",
    spent: "£290.00",
    color: "bg-indigo-500",
    status: "Processing",
  },
  {
    name: "Darlene Robertson",
    id: "#BK202509",
    joinDate: "14 Sep 2025",
    services: "34 Times",
    location: "Berlin, Germany",
    spent: "£290.00",
    color: "bg-teal-500",
    status: "Pending",
  },
  {
    name: "Darlene Robertson",
    id: "#BK202509",
    joinDate: "14 Sep 2025",
    services: "8 Times",
    location: "Berlin, Germany",
    spent: "£290.00",
    color: "bg-amber-500",
    status: "Pending",
  },
];
const statusColors = {
  Done: "bg-[#E0F3E6] text-[#00992B]",
  Pending: "bg-[#f9e2fc] text-[#C90CE6]",
  Processing: "bg-blue-100 text-blue-600",
  Cancelled: "bg-gray-100 text-gray-600",
};

const Payouts = () => {
  const [open, setOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("All");
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 md:p-6 rounded-xl">
        {/* Title */}
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-0">
          Payouts
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 bg-[#F6F4F5] p-1 rounded-full">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => setActiveButton(btn)}
                className={`flex items-center px-6 py-2 rounded-full border text-sm font-medium transition
            ${
              activeButton === btn
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-white text-gray-600 border-gray-300 hover:bg-pink-100 hover:text-pink-500"
            }`}
              >
                {btn}
              </button>
            ))}
          </div>
          <button className="flex items-center px-6 py-2 rounded-full border bg-white text-[#FF006A] border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition">
            See All
            <LuArrowUpRight className="text-xl" />
          </button>

          <div className="relative inline-block text-left">
            {/* Button */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center px-6 py-2 rounded-full border bg-white text-gray-600 border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition"
            >
              30 Days
              <MdKeyboardArrowDown
                className={`text-2xl ml-1 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-pink-100 hover:text-pink-500">
                      7 Days
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-pink-100 hover:text-pink-500">
                      15 Days
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-pink-100 hover:text-pink-500">
                      30 Days
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-pink-100 hover:text-pink-500">
                      90 Days
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Always-table with controlled column widths */}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="border-b">
            <tr className=" text-[#333333] text-base">
              <th className="p-3">Performer</th>
              <th className="p-3">Total </th>
              <th className="p-3">Ref</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody className="text-[16px] text-[#333333] mt-2">
            {payouts.map((p, i) => (
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

                {/* right-align numbers, never wrap, use tabular figures */}
                {/* <td className="px-4 sm:px-6 align-middle font-medium whitespace-nowrap text-right tabular-nums">
                    {c.spent}
                  </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional hint */}
      {/* <p className="md:hidden mt-2 text-center text-[11px] text-zinc-400">
              Tip: Swipe horizontally to see more columns.
            </p> */}
    </div>
  );
};

export default Payouts;
