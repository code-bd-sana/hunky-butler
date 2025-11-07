"use client";
import { useGetPaymentHistoryQuery } from "@/features/booking";
import Image from "next/image";
import React, { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";

const buttons = ["All", "Done", "Pending", "Processing"];

const statusColors = {
  Done: "bg-[#E0F3E6] text-[#00992B]",
  Processing: "bg-blue-100 text-blue-600",
  Cancelled: "bg-gray-100 text-gray-600",
  Pending: "bg-[#f9e2fc] text-[#C90CE6]",
};

const Payouts = () => {
  const [activeButton, setActiveButton] = useState("All");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 items per page

  const { data, isLoading, error } = useGetPaymentHistoryQuery({
    skip: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage
  });

  const paymentHistory = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Format date to "DD MMM YYYY" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get performer name from butler data
const getPerformerName = (payment) => {
  if (payment.butler && payment.butler.length > 0) {
    // Map kore butler der name gulo ber korbo
    const butlerNames = payment.butler.map(butler => {
      const firstName = butler.id?.firstName || butler.id?.firstName || '';
      const lastName = butler.id?.lastName || butler.id?.lastName || '';
      return `${firstName} ${lastName}`.trim();
    }).filter(name => name !== ''); // Empty names remove korbo
    
    // Jodi kono name thake, comma separated return korbo
    if (butlerNames.length > 0) {
      return butlerNames.join(', ');
    }
  }
  return "Not assign";
};

  // Get performer image
  const getPerformerImage = (payment) => {
    return payment.butler?.image || "/Dashboard/customer.png";
  };

  const filteredPayouts = activeButton === "All" 
    ? paymentHistory 
    : paymentHistory.filter((p) => p.status === activeButton);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-lg text-gray-600">Loading payouts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-lg text-red-600">Error loading payouts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-0">
          Payouts
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Tabs */}
          {/* <div className="flex items-center gap-1 rounded-full bg-[#F6F4F5] p-1 h-[40px] sm:h-[44px] lg:h-[48px] overflow-x-auto whitespace-nowrap lg:overflow-visible lg:whitespace-normal [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
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
          </div> */}

          {/* Right controls */}
          <div className="flex justify-center items-center gap-1.5 sm:ml-auto relative">
            {/* <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-1 rounded-full font-medium bg-[#F6F4F5] text-[#292929] px-4 py-1.5 h-[40px] text-[12px] sm:px-5 sm:py-2 sm:h-[48px] sm:text-[13px]"
            >
              30 Days
              <MdKeyboardArrowDown
                className={`transition-transform ${
                  open ? "rotate-180" : ""
                } text-base sm:text-xl`}
              />
            </button> */}

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

            {/* <button
              className="flex items-center gap-1 rounded-full font-medium bg-[#F6F4F5] px-4 py-1.5 h-[40px] text-[12px] sm:px-5 sm:py-2 sm:h-[48px] sm:text-[13px]"
              style={{ color: "#FF006A" }}
            >
              See All
              <LuArrowUpRight className="text-base sm:text-lg" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[370px] max-w-[76vw] overflow-scroll scrollbar-hide overflow-y-auto">
        <table className="w-full text-left overflow-scroll border-collapse">
          <thead className="border-b">
            <tr className="text-[#333333] text-base">
              <th className="p-3">Performer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Deposit</th>
              <th className="p-3">Amount Due</th>
              <th className="p-3">Ref</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody className="text-[16px] text-[#333333] mt-2">
            {filteredPayouts.map((payment, i) => (
              <tr key={payment._id || i} className="h-[56px] bg-white hover:bg-zinc-50/60">
                <td className="px-4 sm:px-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={getPerformerImage(payment)}
                      alt={getPerformerName(payment)}
                      width={32}
                      height={32}
                      className="rounded-[8px] object-cover"
                    />
                    <span className="truncate">{getPerformerName(payment)}</span>
                  </div>
                </td>
                <td className="px-2 align-middle text-zinc-600 whitespace-nowrap">
                  £{payment.totalAmount}
                </td>
                <td className="px-2 align-middle  text-zinc-600 whitespace-nowrap">
                  £{  
payment?.paymentStatus === 'deposit_paid' ?  payment?.depositAmount : 0}
                </td>
                <td className="px-2 align-middle text-zinc-600 whitespace-nowrap">
                  £{payment?.amountDue || 0}
                </td>
                <td className="px-2 align-middle whitespace-nowrap">
                  {payment.bookingId}
                </td>
                <td className="px-2 align-middle whitespace-nowrap">
                  {formatDate(payment.createdAt)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      statusColors[payment.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {payment.paymentStatus || "Unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#F6F4F5] text-[#292929] hover:bg-gray-200"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? "bg-[#FF006A] text-white"
                  : "bg-[#F6F4F5] text-[#292929] hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#F6F4F5] text-[#292929] hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 mt-4 text-center">
        Showing {filteredPayouts.length} of {totalCount} results
      </div>
    </div>
  );
};

export default Payouts;