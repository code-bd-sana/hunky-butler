"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";

const rows = [
  {
    id: "#BK202509",
    name: "Buff Butler",
    price: "£290.00",
    date: "14 Sep 2025",
    status: "Active",
    img: "/ImageGalary/pic2.jpeg",
  },
  {
    id: "#BK202509",
    name: "Life Drawing",
    price: "£290.00",
    date: "14 Sep 2025",
    status: "Paused",
    img: "/ImageGalary/pic1.jpeg",
  },
  {
    id: "#BK202509",
    name: "Cocktail Masterclasses",
    price: "£290.00",
    date: "14 Sep 2025",
    status: "Active",
    img: "/ImageGalary/pic6.jpeg",
  },
  {
    id: "#BK202509",
    name: "Strippers",
    price: "£290.00",
    date: "14 Sep 2025",
    status: "Paused",
    img: "/ImageGalary/pic8.jpeg",
  },
];

function StatusPill({ value }) {
  const active = value === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[14px] font-semibold leading-none ${
        active
          ? "bg-[#E7FFF3] text-[#00992B]"
          : "bg-[#FFE7FB] text-[#C90CE6]"
      }`}
    >
      {value}
    </span>
  );
}

function Toggle({ checked, onChange }) {
  return (
  <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`relative inline-flex h-[28px] w-[44px] items-center rounded-full p-[4px] transition-colors
        ${checked ? "bg-[#FF2E84]" : "bg-[#2B2B2B]"}`}
    >
      <span
        className={`block h-[20px] w-[20px] rounded-full bg-white shadow
          transition-transform duration-200 ease-out
          ${checked ? "translate-x-[16px]" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function ServiceTable() {
  const [states, setStates] = useState(rows.map((r) => r.status === "Active"));

  return (
    <div className="w-full">
      {/* Card */}
      <div className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4">
          <div className="text-[18px] font-medium text-[#141414]">
            Services <span className="text-[#141414]">(4)</span>
          </div>

          <Link
            href="/addNewServices"
            className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[16px] font-semibold text-white shadow-sm transition
              bg-[#FF006A]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full">
              +
            </span>
            Add New Service
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-[16px] text-[#333333]">
                <th className="sticky left-0 z-10 bg-white px-5 sm:px-6 py-3 text-left font-medium">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Service Name
                </th>
                <th className="px-4 py-3 text-left font-medium">Price/Hour</th>
                <th className="px-4 py-3 text-left font-medium">
                  Date Created
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className="text-[16px] text-[#333333] hover:bg-neutral-50"
                >
                  {/* ID */}
                  <td className="sticky left-0 z-[1] bg-white px-5 sm:px-6 py-4 align-middle">
                    <span className="font-medium text-neutral-700">{r.id}</span>
                  </td>

                  {/* Service Name with thumbnail */}
                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-12 overflow-hidden rounded-md ring-1 ring-black/5">
                        <Image
                          src={r.img}
                          alt={r.name}
                          width={48}
                          height={36}
                          className="h-full w-full object-cover"
                          sizes="48px"
                        />
                      </div>
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 align-middle">
                    <span className="font-medium">{r.price}</span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 align-middle">
                    <span className="text-neutral-600">{r.date}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4  align-middle">
                    <StatusPill value={states[i] ? "Active" : "Paused"} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="text-neutral-500 hover:text-neutral-700"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        type="button"
                        className="text-neutral-500 hover:text-red-600"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                      <Toggle
                        checked={states[i]}
                        onChange={() =>
                          setStates((s) =>
                            s.map((v, idx) => (idx === i ? !v : v))
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-3" />
      </div>
    </div>
  );
}
