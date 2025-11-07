"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuArrowUpRight, LuEye, LuDownload } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { useGetCustomerPaymentHistoryQuery } from "@/features/booking";

const PRIMARY = "#FF006A";

const tabs = ["All", "Paid", "Refunded", "Failed"];

export default function CustomerTransactions() {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  
  const { data: sessionData } = useSession();
  const email = sessionData?.user?.email;

  const skip = (currentPage - 1) * limit;
  
  const { data: paymentData, isLoading, error } = useGetCustomerPaymentHistoryQuery({
    email,
    skip,
    limit
  });

  const payments = paymentData?.data || [];
  const totalCount = paymentData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Filter payments based on active tab
  const filteredPayments = payments.filter(payment => {
    if (active === "All") return true;
    if (active === "Paid") return payment.paymentStatus === "paid";
    if (active === "Refunded") return payment.paymentStatus === "refunded";
    if (active === "Failed") return payment.paymentStatus === "failed";
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' • ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return { bg: "#E0F3E6", text: "#0D8A34" };
      case 'refunded':
        return { bg: "#FEE2E2", text: "#DC2626" };
      case 'failed':
        return { bg: "#FEE2E2", text: "#DC2626" };
      case 'pending':
        return { bg: "#FFF3CD", text: "#856404" };
      default:
        return { bg: "#F6F4F5", text: "#6B7280" };
    }
  };

  // Handle receipt download
  const handleDownloadReceipt = (payment) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank');
    } else {
      // Create a simple receipt if Stripe receipt is not available
      const receiptContent = `
        Receipt for ${payment.serviceName}
        Booking ID: ${payment.bookingId}
        Amount: $${payment.amountPaid} ${payment.currency}
        Date: ${new Date(payment.paidAt).toLocaleDateString()}
        Status: ${payment.paymentStatus}
        Thank you for your business!
      `;
      
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${payment.bookingId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Handle view details
  const handleViewDetails = (payment) => {
    // You can implement a modal or navigate to details page
   
    // Example: open modal with payment details
    alert(`Payment Details:\n
Booking ID: ${payment.bookingId}
Service: ${payment.serviceName}
Amount: $${payment.amountPaid} ${payment.currency}
Status: ${payment.paymentStatus}
Date: ${formatDate(payment.paidAt)}
${payment.receiptUrl ? `Receipt: ${payment.receiptUrl}` : ''}
    `);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center">
        <p className="text-red-500">Error loading transactions</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-5 md:px-6 py-4">
        <h2 className="text-[18px] leading-6 font-medium text-[#141414]">
          Recent Transactions
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-2">
          {/* Tabs */}
          {/* <div className="flex items-center gap-1 rounded-full bg-[#F6F4F5] p-1 h-[40px] sm:h-[44px] lg:h-[48px] overflow-x-auto whitespace-nowrap lg:overflow-visible lg:whitespace-normal [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActive(t);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className={`
                  rounded-full font-medium transition shrink-0
                  px-3 py-1.5 text-[12px]
                  sm:px-4 sm:py-2 sm:text-[12px]
                  lg:px-5 lg:py-2 lg:text-[13px]
                  ${active === t ? "text-white" : "text-[#6B7280] bg-white"}
                `}
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
          </div> */}

          <div className="flex gap-1.5 relative">
            {/* 30 Days */}
            {/* <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-1 rounded-full font-medium bg-[#F6F4F5] text-[#292929] px-4 py-1.5 h-[40px] text-[12px] sm:px-5 sm:py-2 sm:h-[48px] sm:text-[13px]"
              style={{ borderColor: "#E5E7EB" }}
            >
              30 Days
              <MdKeyboardArrowDown
                className={`transition-transform ${open ? "rotate-180" : ""} text-base sm:text-xl`}
              />
            </button> */}

            {open && (
              <div className="absolute right-0 top-12 mt-2 w-40 rounded-lg border bg-white shadow-lg z-10" style={{ borderColor: "#E5E7EB" }}>
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

            {/* See All */}
            {/* <button
              className="flex items-center gap-1 rounded-full font-medium bg-[#F6F4F5] px-4 py-1.5 h-[40px] text-[12px] sm:px-5 sm:py-2 sm:h-[48px] sm:text-[13px]"
              style={{ color: PRIMARY }}
            >
              See All
              <LuArrowUpRight className="text-base sm:text-lg" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-scroll max-w-[76vw] max-h-[528px] scrollbar-hide overflow-y-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-[16px] leading-5 text-[#292929]">
              <th className="px-5 md:px-6 py-3 font-medium text-left">Ref</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Date/Time</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Method</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Service</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Status</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Amount</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 md:px-6 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment, i) => {
                const statusColors = getStatusColor(payment.paymentStatus);
                
                return (
                  <tr key={payment._id || i} className="hover:bg-[#FAFAFB]">
                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                      #{payment.bookingId?.slice(-8) || 'N/A'}
                    </td>

                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                      {formatDate(payment.paidAt)}
                    </td>

                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929] capitalize">
                      {payment.paymentMethod?.replace('_', ' ') || 'Card'}
                    </td>

                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929] capitalize">
                      {payment.serviceName?.replace(/-/g, ' ') || 'Service'}
                    </td>

                    <td className="px-5 md:px-6 py-6">
                      <span
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium capitalize"
                        style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.text
                        }}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929] font-medium">
                      ${payment.amountPaid} {payment.currency}
                    </td>

                    <td className="px-5 md:px-6 py-6">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleDownloadReceipt(payment)}
                          className="inline-flex items-center gap-2 text-[14px] font-medium hover:opacity-80 transition-opacity"
                          style={{ color: PRIMARY }}
                        >
                          Download Receipt
                          <LuDownload className="text-[18px]" />
                        </button>
                        <button
                          onClick={() => handleViewDetails(payment)}
                          aria-label="View"
                          className="grid place-items-center w-9 h-9 rounded-full hover:bg-gray-50 transition-colors"
                        >
                      
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show limited pages with ellipsis
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? "bg-[#FF006A] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}