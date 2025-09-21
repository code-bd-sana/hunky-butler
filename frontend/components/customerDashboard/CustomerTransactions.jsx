"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuArrowUpRight, LuEye, LuDownload } from "react-icons/lu";

const PRIMARY = "#FF006A";

const tabs = ["All", "Completed", "Ongoing", "Cancelled"];

const rows = [
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    method: "Visa **** 9821",
    feeRefund: "-",
    status: "Paid",
    amount: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    method: "PayPal",
    feeRefund: "-",
    status: "Refunded",
    amount: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    method: "Mastercard **** 7721",
    feeRefund: "-",
    status: "Paid",
    amount: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    method: "Visa **** 9821",
    feeRefund: "Refunded",
    status: "Refunded",
    amount: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    method: "PayPal",
    feeRefund: "-",
    status: "Paid",
    amount: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    method: "Visa **** 9821",
    feeRefund: "Refunded",
    status: "Processing",
    amount: "£290.00",
  },
  {
    ref: "#BK202509",
    date: "14 Sep 2025 • 7:30 PM",
    method: "Mastercard **** 7721",
    feeRefund: "-",
    status: "Paid",
    amount: "£290.00",
  },
];

export default function CustomerTransactions() {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-5 md:px-6 py-4">
        <h2 className="text-[18px] leading-6 font-medium text-[#141414]">
          Recent Transactions
        </h2>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 h-[48px] rounded-full bg-[#F6F4F5] p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`px-5 py-2 rounded-full text-[13px] leading-5 font-medium transition ${
                  active === t ? "text-white" : "text-[#6B7280] bg-white"
                }`}
                style={
                  active === t
                    ? {
                        backgroundColor: PRIMARY,
                        boxShadow: "0 1px 2px rgba(0,0,0,.06)",
                      }
                    : { border: "1px solid #E5E7EB" }
                }
              >
                {t}
              </button>
            ))}
          </div>

          {/* 30 Days */}
          <div className="relative">
            <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-1 px-5 py-2 h-[48px] rounded-full text-[13px] leading-5 font-medium bg-[#F6F4F5] text-[#292929]"
              style={{ borderColor: "#E5E7EB" }}
            >
              30 Days
              <MdKeyboardArrowDown
                className={`text-xl transition-transform ${
                  open ? "rotate-180" : ""
                }`}
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

          {/* See All */}
          <button
            className="flex items-center gap-1 px-5 py-2 h-[48px] rounded-full text-[13px] leading-5 font-medium bg-[#F6F4F5]"
            style={{ color: PRIMARY }}
          >
            See All
            <LuArrowUpRight className="text-lg" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-[16px] leading-5 text-[#292929]">
              <th className="px-5 md:px-6 py-3 font-medium text-left">Ref</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">
                Date/Time
              </th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">
                Method
              </th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">
                Fee/Refund
              </th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">
                Status
              </th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">
                Amount
              </th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">
                Actions
              </th>
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
                  {r.method}
                </td>

                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                  {r.feeRefund}
                </td>

                <td className="px-5 md:px-6 py-6">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium
                    ${
                      r.status === "Paid"
                        ? "bg-[#E0F3E6] text-[#0D8A34]"
                        : r.status === "Refunded"
                        ? "bg-[#FEE2E2] text-[#DC2626]"
                        : "bg-[#F6E7FF] text-[#B20CE6]"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                  {r.amount}
                </td>

                <td className="px-5 md:px-6 py-6">
                  <div className="flex items-center gap-4">
                    <button
                      className="inline-flex items-center gap-2 text-[14px] font-medium"
                      style={{ color: PRIMARY }}
                    >
                      Download Receipt
                      <LuDownload className="text-[18px]" />
                    </button>
                    <button
                      aria-label="View"
                      className="grid place-items-center w-9 h-9 rounded-full hover:bg-gray-50"
                    >
                      <LuEye className="text-[24px]" />
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
