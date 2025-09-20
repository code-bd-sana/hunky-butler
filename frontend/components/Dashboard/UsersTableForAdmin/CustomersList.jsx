"use client"
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";

const customers = [
  {
    name: "James H.",
    id: "#BK202509",
    joinDate: "14 Sep 2025 • 7:30 PM",
    services: "3 Times",
    location: "Shoreditch, London",
    spent: "£290.00",
    color: "bg-yellow-400",
  },
  {
    name: "Darlene Robertson",
    id: "#BK202509",
    joinDate: "14 Sep 2025 • 7:30 PM",
    services: "2 Times",
    location: "Berlin, Germany",
    spent: "£290.00",
    color: "bg-pink-500",
  },
  {
    name: "Bessie Cooper",
    id: "#BK202509",
    joinDate: "14 Sep 2025 • 7:30 PM",
    services: "6 Times",
    location: "Los Angeles, CA",
    spent: "£290.00",
    color: "bg-purple-500",
  },
  {
    name: "James H.",
    id: "#BK202509",
    joinDate: "14 Sep 2025 • 7:30 PM",
    services: "4 Times",
    location: "Shoreditch, London",
    spent: "£290.00",
    color: "bg-indigo-500",
  },
  {
    name: "Darlene Robertson",
    id: "#BK202509",
    joinDate: "14 Sep 2025 • 7:30 PM",
    services: "34 Times",
    location: "Berlin, Germany",
    spent: "£290.00",
    color: "bg-teal-500",
  },
  {
    name: "Darlene Robertson",
    id: "#BK202509",
    joinDate: "14 Sep 2025 • 7:30 PM",
    services: "8 Times",
    location: "Berlin, Germany",
    spent: "£290.00",
    color: "bg-amber-500",
  },
];

export default function CustomersList() {
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (open && ddRef.current && !ddRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="w-full rounded-2xl border border-zinc-100 bg-white shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 pt-5">
        <h2 className="text-[18px] font-semibold text-zinc-800">
          Customer List
        </h2>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F6F4F5] text-[#FF006A] text-[12px] hover:bg-pink-100 hover:text-pink-500 transition">
            See All
            <LuArrowUpRight className="text-xl" />
          </button>

          {/* Range dropdown */}
          <div ref={ddRef} className="relative inline-block text-left">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center px-4 py-2 rounded-full bg-[#F6F4F5] text-[#333333] text-[12px] hover:bg-pink-100 hover:text-pink-500 transition"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              30 Days
              <MdKeyboardArrowDown
                className={`text-2xl ml-1 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <ul className="py-2 text-sm text-gray-700" role="listbox">
                  {["7 Days", "15 Days", "30 Days", "90 Days"].map((label) => (
                    <li key={label}>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-pink-100 hover:text-pink-500"
                        onClick={() => setOpen(false)}
                        role="option"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 pb-4 pt-4">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg
              className="h-[18px] w-[18px]"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14.5 14.5 18 18M8.75 15.5a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search User"
            className="h-11 w-full rounded-[8px] border border-[#EFE7EA] bg-[#FFFFFF] pl-9 pr-3 text-[16px] text-[#3D3D3D] placeholder:text-[#3D3D3D] outline-none ring-0 focus:border-[#FF006A]"
          />
        </div>

        <button
          type="button"
          className="h-11 rounded-[30px] bg-[#FF006A] px-4 sm:px-5 text-[16px] font-medium text-white shadow-sm hover:bg-pink-600 active:bg-pink-700"
        >
          Search
        </button>
      </div>

      {/* Always-table with controlled column widths */}
      <div className="px-2 pb-4">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-collapse min-w-[820px]">
            {/* Make last column wide enough on all screens */}
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[14%]" />
              <col className="w-[23%]" />
              <col className="w-[13%]" />
              <col className="w-[14%]" />
              <col className="w-[8%] md:w-[140px]" />
            </colgroup>

            <thead className="sticky top-0 z-0">
              <tr className="h-11 border-b border-[#EFE7EA] bg-white text-[16px] font-medium text-[#333333]">
                <th className="px-4 sm:px-6 text-left whitespace-nowrap">
                  Customer Name
                </th>
                <th className="px-2 text-left whitespace-nowrap">ID</th>
                <th className="px-2 text-left whitespace-nowrap">Join Date</th>
                <th className="px-2 text-left whitespace-nowrap">
                  Service Taken
                </th>
                <th className="px-2 text-left whitespace-nowrap">Location</th>
                {/* prevent wrap of header */}
                <th className="px-4 sm:px-6 text-right whitespace-nowrap">
                  Total&nbsp;Spent
                </th>
              </tr>
            </thead>

            <tbody className="text-[16px] text-[#333333]">
              {customers.map((c, i) => (
                <tr key={i} className="h-[56px] bg-white hover:bg-zinc-50/60">
                  <td className="px-4 sm:px-6">
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src="/Dashboard/customer.png"
                        alt={c.name}
                        width={32}
                        height={32}
                        className="rounded-[8px] object-cover"
                      />

                      <span className="truncate">{c.name}</span>
                    </div>
                  </td>

                  <td className="px-2 align-middle text-zinc-600 whitespace-nowrap">
                    {c.id}
                  </td>
                  <td className="px-2 align-middle whitespace-nowrap">
                    {c.joinDate}
                  </td>
                  <td className="px-2 align-middle whitespace-nowrap">
                    {c.services}
                  </td>
                  <td className="px-2 align-middle">{c.location}</td>

                  {/* right-align numbers, never wrap, use tabular figures */}
                  <td className="px-4 sm:px-6 align-middle font-medium whitespace-nowrap text-right tabular-nums">
                    {c.spent}
                  </td>
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
    </section>
  );
}
