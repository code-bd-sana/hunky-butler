"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const BORDER = "#EFE7ED";

const rows = [
  { ref: "#BK202509", amount: "£290.00", fee: "-£290.00", net: "£290.00", status: "Paid" },
  { ref: "#BK202509", amount: "£290.00", fee: "-£290.00", net: "£290.00", status: "Pending" },
  { ref: "#BK202509", amount: "£290.00", fee: "-£290.00", net: "£290.00", status: "Paid" },
  { ref: "#BK202509", amount: "£290.00", fee: "-£290.00", net: "£0.00",   status: "Paid" },
];

const statusStyles = {
  Paid: "bg-[#E0F3E6] text-[#0D8A34]",
  Pending: "bg-[#F6E7FF] text-[#B20CE6]",
};

export default function ButlerPaymentUpcomingBooking() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: BORDER }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 md:px-6 py-4">
        <h2 className="text-[18px] leading-6 font-medium text-[#141414]">
          Upcoming Bookings
        </h2>

        <div className="relative">
          <button
            onClick={() => setOpen((s) => !s)}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-[13px] font-medium bg-[#F6F4F5] text-[#292929]"
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
          <thead className="border-b" style={{ borderColor: BORDER }}>
            <tr className="text-[16px] md:text-[16px] leading-5 text-[#292929]">
              <th className="px-5 md:px-6 py-3 font-medium text-left">Ref</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Amount</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Fee (Platform)</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Net Earnings</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-[#FAFAFB]">
                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">{r.ref}</td>
                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">{r.amount}</td>
                <td className="px-5 md:px-6 py-6 text-[16px] text-[#E34343]">{r.fee}</td>
                <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">{r.net}</td>
                <td className="px-5 md:px-6 py-6">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium ${
                      statusStyles[r.status]
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
