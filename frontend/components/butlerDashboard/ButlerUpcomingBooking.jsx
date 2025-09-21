"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuEye } from "react-icons/lu";

const PRIMARY = "#FF006A";

const rows = [
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    service: "Cocktail Masterclass",
    performer: "James H.",
    location: "Shoreditch, London",
    status: "Completed",
    total: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    service: "Cocktail Masterclass",
    performer: "Darlene Robertson",
    location: "Berlin, Germany",
    status: "Upcoming",
    total: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    service: "Stripper",
    performer: "Bessie Cooper",
    location: "Los Angeles, CA",
    status: "Completed",
    total: "£290.00",
  },
];

const statusStyles = {
  Completed: "bg-[#E0F3E6] text-[#0D8A34]",   // green
  Upcoming: "bg-[#F6E7FF] text-[#B20CE6]",    // purple
  Confirmed: "bg-[#E7F0FF] text-[#1D4ED8]",   // blue 
  Cancelled: "bg-[#FEE2E2] text-[#DC2626]",   // red  
};

export default function ButlerUpcomingBooking() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white">
      {/* Header: title + 30 Days chip (no tabs per figma) */}
      <div className="flex items-center justify-between px-5 md:px-6 py-4">
        <h2 className="text-[18px] leading-6 font-medium text-[#141414]">
          Upcoming Bookings
        </h2>

        <div className="relative">
          <button
            onClick={() => setOpen((s) => !s)}
            className="flex items-center gap-1 px-5 py-2 h-[32px] md:h-[36px] rounded-full text-[13px] leading-5 font-medium bg-[#F6F4F5] text-[#292929]"
            style={{ borderColor: "#E5E7EB" }}
          >
            30 Days
            <MdKeyboardArrowDown
              className={`text-xl transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div
              className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-lg z-10"
              style={{ borderColor: "#E5E7EB" }}
            >
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
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* thin divider like figma */}
          <thead className="border-b border-gray-200">
            <tr className="text-[16px] leading-5 text-[#292929]">
              <th className="px-5 md:px-6 py-3 font-medium text-left">Ref</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Date/Time</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Service</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Client</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Location</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Status</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Earnings</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-[#FAFAFB]">
                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                  {r.ref}
                </td>

                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                  {r.date}
                </td>

                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                  {r.service}
                </td>

                {/* Client (avatar + name) */}
                <td className="px-5 md:px-6 py-6">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Dashboard/customer.png"
                      alt={r.performer}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                    <span className="text-[16px] text-[#292929]">
                      {r.performer}
                    </span>
                  </div>
                </td>

                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                  {r.location}
                </td>

                <td className="px-5 md:px-6 py-6">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium ${
                      statusStyles[r.status] || "bg-[#F3F4F6] text-[#4B5563]"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* Earnings (uses your existing 'total' value) */}
                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                  {r.total}
                </td>

                <td className="px-5 md:px-6 py-6">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="View"
                      className="grid place-items-center w-9 h-9 rounded-full hover:bg-gray-50"
                    >
                      <LuEye className="text-[24px]" />
                    </button>
                    <button
                      aria-label="Message"
                      className="grid place-items-center w-9 h-9 hover:bg-gray-50"
                    >
                      <Image
                        src="/icons/textIcon.png"
                        alt={"messege"}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
