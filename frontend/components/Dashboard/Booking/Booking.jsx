"use client";
import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown, MdChevronLeft, MdChevronRight, MdStar } from "react-icons/md";
import { LuArrowUpRight } from "react-icons/lu";
import { FiEye } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import Image from "next/image";
import { useAssignToButlerMutation, useGetBookingQuery, useUpdaterStatusMutation } from "@/features/booking";
import { useGetAllButlerQuery } from "@/features/butler";
import toast, { Toaster } from "react-hot-toast";
import { useGetAdminSummuryQuery } from "@/features/summury";

// Details Modal Component
const BookingDetailsModal = ({ booking, isOpen, onClose }) => {


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Booking Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Reference</label>
              <p className="text-gray-900 font-medium">{booking?._id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  {
                    completed: "bg-[#E0F3E6] text-[#00992B]",
                    ongoing: "bg-blue-100 text-blue-600",
                    cancelled: "bg-gray-100 text-gray-600",
                  }[booking?.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1)}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Event</label>
              <p className="text-gray-900">
                {booking?.dateOfEvent ? new Date(booking.dateOfEvent).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Start Time</label>
              <p className="text-gray-900">{booking?.startTime || "N/A"}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">
                  {booking?.firstName} {booking?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{booking?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{booking?.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Post Code</label>
                <p className="text-gray-900">{booking?.postCode}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Service Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Service Name</label>
                <p className="text-gray-900">{booking?.serviceName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Duration</label>
                <p className="text-gray-900">
                  {booking?.DurationHours || booking?.durationHours || 0}h{" "}
                  {booking?.DurationMinutes || booking?.durationMinutes || 0}m
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Number of Staff</label>
                <p className="text-gray-900">{booking?.numberOfStaff}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-gray-900">{booking?.location || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Financial Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Total Price</label>
                <p className="text-gray-900 font-semibold">${booking?.price}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Platform Fee (20%)</label>
                <p className="text-gray-900">${(booking?.price * 0.2).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Butler Information */}
          {booking?.butler && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Butler Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Butler Name</label>
                  <p className="text-gray-900">
                    {booking.butler.name || 
                     `${booking.butler.firstName || ''} ${booking.butler.lastName || ''}`.trim() || 
                     'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{booking.butler.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rating</label>
                  <p className="text-gray-900">
                    {booking.butler.averageRating || "No ratings yet"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Reviews</label>
                  <p className="text-gray-900">{booking.butler.totalReviews || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#FF006A] text-white rounded-full font-medium hover:bg-[#e5005f] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Butler Assignment Modal Component
const ButlerAssignmentModal = ({ booking, isOpen, onClose, butlers, onAssignButler, refetch }) => {
  const [selectedButler, setSelectedButler] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignToButler, {isLoading:loader, error: isError}] = useAssignToButlerMutation();

  if (!isOpen) return null;

  // Sort butlers by rating (highest first)
  const sortedButlers = [...(butlers || [])].sort((a, b) => {
    const ratingA = a.averageRating || 0;
    const ratingB = b.averageRating || 0;
    return ratingB - ratingA;
  });

  // Filter butlers based on search
  const filteredButlers = sortedButlers.filter(butler =>
    butler.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    butler.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${butler.firstName || ''} ${butler.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (selectedButler) {
      console.log("Assigning butler:", {
        bookingId: booking?._id,
        butlerId: selectedButler
      });
      onAssignButler(booking?._id, selectedButler);
     
    }

    try {
      const data = {
          bookingId: booking?._id,
        butlerId: selectedButler
      }

      const response = await assignToButler(data).unwrap();
      console.log(response)
      toast.success("Assigned Success")
      refetch()
       onClose();
      
    } catch (error) {
      console.log(error)
      toast.error(error?.message || "Something went Wrong!")
    }
  };

  const getButlerDisplayName = (butler) => {
    return butler.name || 
           `${butler.firstName || ''} ${butler.lastName || ''}`.trim() || 
           '--';
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Assign Butler</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Booking Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Booking Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Reference</label>
                  <p className="text-gray-900 font-medium">{booking?._id?.slice(0, 10)}...</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer</label>
                  <p className="text-gray-900">
                    {booking?.firstName} {booking?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Service</label>
                  <p className="text-gray-900">{booking?.serviceName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-gray-900">
                    {booking?.dateOfEvent ? new Date(booking.dateOfEvent).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Butler Selection */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Select Butler</h4>
              
              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search butlers by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF006A] focus:border-transparent"
                />
              </div>

              {/* Butlers List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredButlers.length > 0 ? (
                  filteredButlers.map((butler) => (
                    <div
                      key={butler._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedButler === butler._id
                          ? "border-[#FF006A] bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedButler(butler._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#FF006A] to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                              {getButlerDisplayName(butler).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {getButlerDisplayName(butler)}
                              </h4>
                              <p className="text-sm text-gray-600">{butler.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MdStar className="text-yellow-400" />
                            <span>{butler.averageRating || "No ratings"}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {butler.totalReviews || 0} reviews
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No butlers found matching your search.
                  </div>
                )}
              </div>

              {selectedButler && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Selected: <strong>{filteredButlers.find(b => b._id === selectedButler)?.email}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedButler}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedButler
                  ? "bg-[#FF006A] text-white hover:bg-[#e5005f]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
           {   loader ? "loading..." : 'Assign Butler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Status Change Modal Component
const StatusChangeModal = ({ booking, isOpen, onClose, onStatusChange, updateLoading  }) => {
  const [selectedStatus, setSelectedStatus] = useState(booking?.status || "");
    const {isLoading} = useUpdaterStatusMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Changing status to:", selectedStatus);
    onStatusChange(booking?._id, selectedStatus);





    
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Change Status</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF006A] focus:border-transparent"
                required
              >
                <option value="">Choose status</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="cancelled">Cancelled</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              <p>Current status: <span className="font-medium capitalize">{booking?.status}</span></p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF006A] text-white rounded-full font-medium hover:bg-[#e5005f] transition-colors"
            >
             
              {updateLoading ? "Loading..." :  " Update Status"}
             
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
   <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-200">
  {/* Items count */}
  <div className="text-sm text-gray-600 text-center sm:text-left">
    Showing {startItem} to {endItem} of {totalItems} entries
  </div>

  {/* Pagination controls */}
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
    {/* Previous button - Top left on mobile */}
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors sm:w-auto ${
        currentPage === 1
          ? "text-gray-400 cursor-not-allowed bg-gray-100"
          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
      }`}
    >
      <MdChevronLeft className="text-lg" />
      <span className="sm:block hidden">Previous</span>
      <span className="sm:hidden block">Prev</span>
    </button>

    {/* Page numbers - Centered and compact */}
    <div className="flex items-center gap-1 overflow-x-auto max-w-full py-2">
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
            page === currentPage
              ? "bg-[#FF006A] text-white shadow-sm"
              : typeof page === 'number'
              ? "text-gray-700 hover:bg-gray-100 border border-gray-200"
              : "text-gray-400 cursor-default"
          }`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
    </div>

    {/* Next button - Top right on mobile */}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors sm:w-auto ${
        currentPage === totalPages
          ? "text-gray-400 cursor-not-allowed bg-gray-100"
          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
      }`}
    >
      <span className="sm:block hidden">Next</span>
      <span className="sm:hidden block">Next</span>
      <MdChevronRight className="text-lg" />
    </button>
  </div>
</div>
  );
};


const Booking = () => {
  const [activeButton, setActiveButton] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [butlerModalOpen, setButlerModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate skip based on current page
  const skip = (currentPage - 1) * itemsPerPage;
  
  // Use the hook with object parameters
  const { data, isLoading, error, refetch } = useGetBookingQuery(
    { 
      limit: itemsPerPage, 
      skip: skip,
      status: activeButton 
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: butlerData } = useGetAllButlerQuery();
  const [updaterStatus, {isLoading:updateLoading, error:updateError}] = useUpdaterStatusMutation();
  const {refetch:summuryRefetch} = useGetAdminSummuryQuery();
  
  // console.log("Butler Data:", butlerData?.data);
  // console.log("API Data:", data);
  // console.log("Current Page:", currentPage);
  // console.log("Skip:", skip);
  // console.log("Items Per Page:", itemsPerPage);

  const buttons = [
    { name: "All", status: "all" },
    { name: "Completed", status: "completed" },
    { name: "Ongoing", status: "ongoing" },
    { name: "Cancelled", status: "cancelled" },
    { name: "Accepted", status: "accepted" }
  ];

  const statusColors = {
    completed: "bg-[#E0F3E6] text-[#00992B]",
    ongoing: "bg-blue-100 text-blue-600",
    cancelled: "bg-gray-100 text-gray-600",
  };

  // Calculate total pages - assuming your API returns total count in data.total
  const totalItems = data?.total || data?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setStatusModalOpen(true);
  };

  const handleAssignButler = (booking) => {
    setSelectedBooking(booking);
    setButlerModalOpen(true);
  };

  const handleButlerAssignment = async(bookingId, butlerId) => {
    console.log("Assigning butler:", {
      bookingId: bookingId,
      butlerId: butlerId
    });

    try {


      
    } catch (error) {
      console.log(error)
      toast.error(error?.message || "Something went wrong!")
    }


    // Here you would typically make an API call to assign the butler
  };

  const handleStatusUpdate = async(bookingId, newStatus) => {
    // console.log(`Updating booking ${bookingId} to status: ${newStatus}`);

    try {

      const data = {
        id: bookingId,
        status: newStatus
      }


      const response= await updaterStatus(data).unwrap();
      toast.success("Status Updated");
      // console.log(response, "update booking");
      refetch()
      summuryRefetch();
      
    } catch (error) {
      toast.error(error?.message || "Something went wrong")
      // console.log(error)
    }

    // Here you would typically make an API call to update the status
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manual refetch when dependencies change
  useEffect(() => {
    refetch();
  }, [currentPage, itemsPerPage, refetch]);

  const closeModals = () => {
    setDetailsModalOpen(false);
    setStatusModalOpen(false);
    setButlerModalOpen(false);
    setSelectedBooking(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6">
          <div className="h-7 w-32 bg-gray-200 rounded-lg animate-pulse mb-4 md:mb-0"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {/* Tabs Skeleton */}
            <div className="flex items-center gap-1 rounded-full bg-[#F6F4F5] p-1 h-[48px]">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>

            {/* Right controls Skeleton */}
            <div className="flex justify-center items-center gap-1.5 sm:ml-auto">
              <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="max-h-[370px]  max-w-screen overflow-scroll scrollbar-hide overflow-y-auto">
          <table className="w-full max-h-[370px] overflow-y-scroll text-left border-collapse">
            <thead>
              <tr className="text-[#333333] border-b text-base">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((header) => (
                  <th key={header} className="p-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <tr key={row} className="border-b border-gray-100">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cell) => (
                    <td key={cell} className="p-3 py-4">
                      <div className="flex items-center gap-2">
                        {cell === 4 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        )}
                        <div className={`h-4 bg-gray-200 rounded animate-pulse ${
                          cell === 1 ? "w-20" : 
                          cell === 2 ? "w-32" : 
                          cell === 3 ? "w-24" : 
                          cell === 4 ? "w-16" : 
                          cell === 5 ? "w-20" : 
                          cell === 6 ? "w-16" : 
                          cell === 7 ? "w-12" : 
                          cell === 8 ? "w-16" : 
                          cell === 9 ? "w-20" : 
                          "w-16"
                        }`}></div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((page) => (
                <div key={page} className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading bookings</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl  shadow-md p-6">

      <Toaster/>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-0">
          Bookings
        </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#F6F4F5] md:p-1 justify-center  p-4 mx-auto sm:h-[44px] lg:h-[48px] overflow-x-auto whitespace-nowrap lg:overflow-visible lg:whitespace-normal [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {buttons.map((btn) => {
              const isActive = activeButton === btn.status;
              return (
                <button
                  key={btn.status}
                  onClick={() => setActiveButton(btn.status)}
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
                  {btn?.name}
                </button>
              );
            })}
          </div>

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

            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#FF006A] focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
    <div className="max-h-[370px] max-w-screen   overflow-scroll scrollbar-hide overflow-y-auto">
          <table className="w-full  max-h-[370px] overflow-y-scroll text-left border-collapse">
          <thead>
            <tr className="text-[#333333] border-b text-base">
              <th className="p-3 font-medium">Ref</th>
              <th className="p-3 font-medium">Date/Time</th>
              <th className="p-3 font-medium">Service</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Butler</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Fee (Platform)</th>
               <th className="p-3 font-medium">Payment Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.map((b, i) => (
              <tr key={i} className="text-[#292929] hover:bg-gray-50">
                <td className="p-3 py-4">{b._id.slice(0, 10)}...</td>
                <td className="p-3">
                  {new Date(b.dateOfEvent).toLocaleString()}
                </td>
                <td className="p-3">{b.serviceName}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Dashboard/customer.png"
                      alt={b.customer || 'img'}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span>{b.firstName + " " + b.lastName}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {b?.butler?.email ? (
                      <span className="text-green-600 font-medium">{b.butler.firstName}</span>
                    ) : (
                      <button
                        onClick={() => handleAssignButler(b)}
                        className="px-3 py-1 bg-[#FF006A] text-white rounded-full text-sm font-medium hover:bg-[#e5005f] transition-colors"
                      >
                        Assign Butler
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-3 text-center">{b.location || "--"}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      statusColors[b.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                  </span>
                </td>
                <td className="p-3">${b.price}</td>
                 
                <td className="p-3">${(b.price * 0.2).toFixed(2)}</td>
                  <td className="p-3">{b.paid}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(b)}
                      className="p-2 text-gray-600 hover:text-[#FF006A] transition-colors"
                      title="View Details"
                    >
                      <FiEye className="text-lg cursor-pointer" />
                    </button>
                    
                    {/* Change Status Button */}
                    <button
                      onClick={() => handleStatusChange(b)}
                      className="p-2 text-gray-600 hover:text-[#FF006A] transition-colors"
                      title="Change Status"
                    >
                      <MdOutlineEdit className="text-lg cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
         {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
      </div>

      {/* Pagination */}
     

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModalOpen}
        onClose={closeModals}
      />

      <StatusChangeModal
        booking={selectedBooking}
        isOpen={statusModalOpen}
        onClose={closeModals}
        onStatusChange={handleStatusUpdate}
        updateLoading={updateLoading}
        
      />

      <ButlerAssignmentModal
        booking={selectedBooking}
        isOpen={butlerModalOpen}
        onClose={closeModals}
        butlers={butlerData?.data}
        onAssignButler={handleButlerAssignment}
        refetch ={refetch}
      

 
      />
    </div>
  );
};

export default Booking;