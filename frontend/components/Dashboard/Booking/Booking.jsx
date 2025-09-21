"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuArrowUpRight } from "react-icons/lu";
import Image from "next/image";

const Booking = () => {
  const [activeButton, setActiveButton] = useState("All");
  const [open, setOpen] = useState(false);

  const buttons = ["All", "Completed", "Ongoing", "Cancelled"];

  const bookings = [
    {
      ref: "#BK202509",
      date: "14 Sep 2025 - 7:30 PM",
      service: "Cocktail Masterclass",
      customer: "James H.",
      performer: "James H.",
      location: "Shoreditch, London",
      status: "Completed",
      total: "£290.00",
      fee: "£290.00",
    },
    {
      ref: "#BK202509",
      date: "14 Sep 2025 - 7:30 PM",
      service: "Cocktail Masterclass",
      customer: "Darlene Rob.",
      performer: "Darlene Rob.",
      location: "Berlin, Germany",
      status: "Upcoming",
      total: "£290.00",
      fee: "£290.00",
    },
    {
      ref: "#BK202509",
      date: "14 Sep 2025 - 7:30 PM",
      service: "Stripper",
      customer: "Bessie Coop.",
      performer: "Bessie Coop.",
      location: "Los Angeles, CA",
      status: "Completed",
      total: "£290.00",
      fee: "£290.00",
    },
  ];

  const statusColors = {
    Completed: "bg-[#E0F3E6] text-[#00992B]",
    Upcoming: "bg-[#f9e2fc] text-[#C90CE6]",
    Ongoing: "bg-blue-100 text-blue-600",
    Cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header — no inner white layer */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-0">
          Bookings
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="
            w-full text-left border-collapse             
          "
        >
          <thead>
            <tr className="text-[#333333] border-b text-base">
              <th className="p-3 font-medium">Ref</th>
              <th className="p-3 font-medium">Date/Time</th>
              <th className="p-3 font-medium">Service</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Performer</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Fee (Platform)</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b, i) => (
              <tr key={i} className="text-[#292929]  hover:bg-gray-50">
                <td className="p-3 py-10">{b.ref}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.service}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Dashboard/customer.png"
                      alt={b.customer}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span>{b.customer}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Dashboard/customer.png"
                      alt={b.customer}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span>{b.performer}</span>
                  </div>
                </td>
                <td className="p-3">{b.location}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      statusColors[b.status]
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3">{b.total}</td>
                <td className="p-3">{b.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;
