"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuEye } from "react-icons/fi";
import { useGetButlerPaymentHistoryQuery } from "@/features/booking";
import { useSession } from "next-auth/react";

const PRIMARY = "#FF006A";

const statusStyles = {
  completed: "bg-[#E0F3E6] text-[#0D8A34]",   // green
  upcoming: "bg-[#F6E7FF] text-[#B20CE6]",    // purple
  confirmed: "bg-[#E7F0FF] text-[#1D4ED8]",   // blue 
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",   // red  
  paid: "bg-[#E0F3E6] text-[#0D8A34]",        // green for paid payments
  pending: "bg-[#FFF3CD] text-[#856404]",     // yellow
};

export default function ButlerUpcomingBooking() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);

  const { data } = useSession();
  const skip = (currentPage - 1) * limit;

  const { data: paymentData, isLoading, error } = useGetButlerPaymentHistoryQuery({
    id: data?.user?.id,
    skip,
    limit
  });

  const payments = paymentData?.data || [];
  const totalCount = paymentData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

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

  // Get status display text and color
  const getStatusInfo = (payment) => {
    if (payment.paymentStatus === 'completed') {
      return { text: 'Completed', style: statusStyles.completed };
    } else if (payment.paymentStatus === 'assigned') {
      return { text: 'paid', style: statusStyles.confirmed };
    } else if (payment.paymentStatus === 'pending') {
      return { text: 'Upcoming', style: statusStyles.upcoming };
    } else if (payment.butlerAssignmentStatus === 'cancelled') {
      return { text: 'Cancelled', style: statusStyles.cancelled };
    } else {
      return { text: 'Pending', style: statusStyles.pending };
    }
  };

  // Handle view details
  const handleViewDetails = (payment) => {

    // You can implement a modal here
    alert(`Payment Details:\n
Booking ID: ${payment.bookingId}
Service: ${payment.serviceName}
Total Amount: £${payment.totalAmount}
Status: ${getStatusInfo(payment).text}
Client: ${payment.customerName || payment.customerEmail}
Date: ${formatDate(payment.paidAt)}
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
        <p className="text-red-500">Error loading payment history</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white">
      {/* Header: title + 30 Days chip */}
      <div className="flex items-center justify-between px-5 md:px-6 py-4">
        <h2 className="text-[18px] leading-6 font-medium text-[#141414]">
          Payment history
        </h2>

        <div className="flex items-center gap-4">
          {/* Pagination Info */}
          {totalCount > 0 && (
            <div className="text-sm text-gray-600 hidden sm:block">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount}
            </div>
          )}

          <div className="relative">
            {/* <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-1 px-5 py-2 h-[32px] md:h-[36px] rounded-full text-[13px] leading-5 font-medium bg-[#F6F4F5] text-[#292929]"
              style={{ borderColor: "#E5E7EB" }}
            >
              30 Days
              <MdKeyboardArrowDown
                className={`text-xl transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button> */}
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[360px] scrollbar-hide overflow-y-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-[16px] leading-5 text-[#292929]">
              <th className="px-5 md:px-6 py-3 font-medium text-left">Ref</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Date/Time</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Service</th>
              {/* <th className="px-5 md:px-6 py-3 font-medium text-left">Client</th> */}
              <th className="px-5 md:px-6 py-3 font-medium text-left">Location</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Status</th>
              <th className="px-5 md:px-6 py-3 font-medium text-left">Earnings</th>

            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-5 md:px-6 py-8 text-center text-gray-500">
                  No payment history found
                </td>
              </tr>
            ) : (
              payments.map((payment, i) => {
                const statusInfo = getStatusInfo(payment);

                return (
                  <tr key={payment._id || i} className="hover:bg-[#FAFAFB]">
                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                      #{payment.bookingId?.slice(-8) || 'N/A'}
                    </td>

                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                      {formatDate(payment.paidAt)}
                    </td>

                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929] capitalize">
                      {payment.serviceName?.replace(/-/g, ' ') || 'Service'}
                    </td>

                    {/* Client (avatar + name) */}
                    {/* <td className="px-5 md:px-6 py-6">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/Dashboard/customer.png"
                          alt={payment.customerName || payment.customerEmail}
                          width={28}
                          height={28}
                          className="rounded-full object-cover"
                        />
                        <span className="text-[16px] text-[#292929]">
                          {payment.firstName + ' '  + payment?.lastName || payment.customerEmail?.split('@')[0] || 'Client'}
                        </span>
                      </div>
                    </td> */}

                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929]">
                      {payment.serviceLocation || 'Location not specified'}
                    </td>

                    <td className="px-5 md:px-6 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium capitalize ${statusInfo.style}`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>

                    {/* Earnings */}
                    <td className="px-5 md:px-6 py-6 text-[16px] text-[#292929] font-medium">
                      £{payment.totalAmount} {payment.currency}
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
          <div className="text-sm text-gray-600 sm:hidden">
            Page {currentPage} of {totalPages}
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
                // Show limited pages with ellipsis for better UX
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