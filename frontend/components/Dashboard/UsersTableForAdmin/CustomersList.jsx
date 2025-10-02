"use client"
import { useGetCustomerOverviwQuery } from "@/features/booking";
import { useGetAllCustomerQuery } from "@/features/customer";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Individual customer row component
const CustomerRow = ({ customer }) => {
  const { data: bookingData } = useGetCustomerOverviwQuery(customer.email);
  
  const serviceTaken = bookingData?.totalServiceTaken || 0;
  const totalSpent = bookingData?.totalSpent || 0;

  return (
    <tr className="h-[56px] bg-white hover:bg-zinc-50/60 border-b border-[#EFE7EA]">
      <td className="px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/Dashboard/customer.png"
            alt={"image"}
            width={32}
            height={32}
            className="rounded-[8px] object-cover"
          />
          <span className="truncate">{customer.name || 'Guest'}</span>
        </div>
      </td>

      <td className="px-2 align-middle text-zinc-600 whitespace-nowrap">
        {customer._id?.slice(0, 6)}...
      </td>
      
      <td className="px-2 align-middle whitespace-nowrap">
        {customer?.createdAt && new Date(customer.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </td>
      
      <td className="px-2 align-middle whitespace-nowrap">
        {serviceTaken} Times
      </td>
      
      <td className="px-2 align-middle">{customer?.email}</td>

      <td className="px-4 sm:px-6 align-middle font-medium whitespace-nowrap text-right tabular-nums">
        £{totalSpent.toFixed(2)}
      </td>
    </tr>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Show limited page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
          currentPage === 1
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <FaChevronLeft className="text-sm" />
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
            currentPage === page
              ? 'border-[#FF006A] bg-[#FF006A] text-white'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
          currentPage === totalPages
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
};

export default function CustomersList() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ddRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useGetAllCustomerQuery({
    page: currentPage,
    limit: 10,
    search: debouncedSearch
  });

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

  const handleSearch = (e) => {
    e.preventDefault();
    setDebouncedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className="w-full rounded-2xl border border-zinc-100 bg-white shadow-sm p-8">
        <div className="flex items-center justify-center">
          <p className="text-lg">Loading customers...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full rounded-2xl border border-zinc-100 bg-white shadow-sm p-8">
        <div className="flex items-center justify-center">
          <p className="text-lg text-red-500">Error loading customers</p>
        </div>
      </section>
    );
  }

  const customers = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalCustomers = data?.total || 0;

  return (
    <section className="w-full rounded-2xl border border-zinc-100 bg-white shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 pt-5">
        <div>
          <h2 className="text-[18px] font-semibold text-zinc-800">
            Customer List
          </h2>
         
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F6F4F5] text-[#FF006A] text-[12px] hover:bg-pink-100 hover:text-pink-500 transition">
            See All
            <LuArrowUpRight className="text-xl" />
          </button> */}

          {/* Range dropdown */}
          <div ref={ddRef} className="relative inline-block text-left">
            {/* <button
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
            </button> */}

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
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-[8px] border border-[#EFE7EA] bg-[#FFFFFF] pl-9 pr-3 text-[16px] text-[#3D3D3D] placeholder:text-[#3D3D3D] outline-none ring-0 focus:border-[#FF006A]"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="h-11 rounded-[30px] bg-[#FF006A] px-4 sm:px-5 text-[16px] font-medium text-white shadow-sm hover:bg-pink-600 active:bg-pink-700"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="px-2 pb-4">
        <div className="overflow-x-auto max-h-[500px] scrollbar-hide overflow-y-auto rounded-xl">
          <table className="w-full border-collapse min-w-[820px]">
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
                <th className="px-2 text-left whitespace-nowrap">Email</th>
                <th className="px-4 sm:px-6 text-right whitespace-nowrap">
                  Total&nbsp;Spent
                </th>
              </tr>
            </thead>

            <tbody className="text-[16px] text-[#333333]">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <CustomerRow key={customer._id} customer={customer} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}