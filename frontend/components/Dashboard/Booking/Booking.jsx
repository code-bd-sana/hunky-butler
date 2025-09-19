"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuArrowUpRight } from "react-icons/lu";
// import user from "../../../public/Dashboard/customer.png"
import Image from "next/image";

const Booking = () => {
  const [open, setOpen] = useState(false);
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
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 md:p-6 rounded-xl shadow-sm">
        {/* Title */}
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-0">
          Bookings
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center px-6 py-2 rounded-full border bg-pink-500 text-white border-pink-500 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition">
            All
          </button>
          <button className="flex items-center px-6 py-2 rounded-full border bg-white text-gray-600 border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition">
            Completed
          </button>
          <button className="flex items-center px-6 py-2 rounded-full border bg-white text-gray-600 border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition">
            Ongoing
          </button>
          <button className="flex items-center px-6 py-2 rounded-full border bg-white text-gray-600 border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition">
            Cancelled
          </button>
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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className=" text-[#333333] text-base">
              <th className="p-3">Ref</th>
              <th className="p-3">Date/Time</th>
              <th className="p-3">Service</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Performer</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Fee (Platform)</th>
            </tr>
          </thead>
          <tbody className="">
            {bookings.map((b, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 ">
                <td className="p-3 py-10">{b.ref}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.service}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Dashboard/customer.png" // public folder er image
                      alt={b.customer}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span>{b.customer}</span>
                  </div>
                </td>

                {/* Performer with image */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Dashboard/customer.png" // public folder er image
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
