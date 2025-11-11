"use client";
import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown, MdChevronLeft, MdChevronRight, MdStar, MdLocationOn } from "react-icons/md";
import { LuArrowUpRight } from "react-icons/lu";
import { FiEye } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import Image from "next/image";
import { useAssignToButlerMutation, useGetBookingButlerQuery, useGetBookingQuery, useUpdaterStatusMutation } from "@/features/booking";
import { useGetAllButlerQuery } from "@/features/butler";
import toast, { Toaster } from "react-hot-toast";
import { useGetAdminSummuryQuery } from "@/features/summury";
import { useSession } from "next-auth/react";

// Map Modal Component
const MapModal = ({ location, postCode, isOpen, onClose }) => {
  if (!isOpen || !postCode) return null;

  // Construct the Google Maps embed URL
  const getMapUrl = () => {
    const query = postCode || location;
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyA1KF6rwYd2Za6Xyh3qZC7y-hDKUxFSStA&q=${encodeURIComponent(query)}`;
  };

  // Construct the Google Maps direct link
  const getDirectMapUrl = () => {
    const query = postCode || location;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Location Map</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Map Content */}
        <div className="p-6 h-[calc(100%-80px)] flex flex-col">
          {/* Location Information */}
          <div className="mb-4 space-y-2">
            <p className="text-gray-600">
              <strong>Post Code:</strong> {postCode || "N/A"}
            </p>
            {location && (
              <p className="text-gray-600">
                <strong>Full Address:</strong> {location}
              </p>
            )}
          </div>

          {/* Map Container */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={getMapUrl()}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              📍 Location based on post code: {postCode}
            </div>
            <a
              href={getDirectMapUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#FF006A] text-white rounded-full hover:bg-[#e5005f] transition-colors"
            >
              Open in Google Maps
              <LuArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated BookingDetailsModal with Map
const BookingDetailsModal = ({ booking, isOpen, onClose, onOpenMap }) => {
  if (!isOpen) return null;

  // Function to calculate days remaining until event
  const getDaysRemaining = (dateOfEvent) => {
    if (!dateOfEvent) return null;
    
    const eventDate = new Date(dateOfEvent);
    const today = new Date();
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysRemaining;
  };

  // Check if sensitive info should be shown (within 3 days)
  const shouldShowSensitiveInfo = () => {
    const daysRemaining = getDaysRemaining(booking?.dateOfEvent);
    return daysRemaining !== null && daysRemaining <= 3 && daysRemaining >= 0;
  };

  const daysRemaining = getDaysRemaining(booking?.dateOfEvent);
  const showSensitiveInfo = shouldShowSensitiveInfo();

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
          {/* Days Remaining Alert */}
         

          {/* Map Section - Show only if postcode exists AND within 3 days */}
          {booking?.postCode && showSensitiveInfo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <MdLocationOn className="text-[#FF006A]" />
                  Location Map
                </h4>
                <button
                  onClick={() => onOpenMap(booking.location, booking.postCode)}
                  className="flex items-center gap-1 px-3 py-1 bg-[#FF006A] text-white rounded-full text-sm hover:bg-[#e5005f] transition-colors"
                >
                  View Full Map
                  <LuArrowUpRight className="text-xs" />
                </button>
              </div>
              <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA1KF6rwYd2Za6Xyh3qZC7y-hDKUxFSStA&q=${encodeURIComponent(booking.postCode)}`}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Post Code:</strong> {booking.postCode}</p>
                {booking.location && (
                  <p><strong>Address:</strong> {booking.location}</p>
                )}
              </div>
            </div>
          )}

          {/* Map Restricted Message - Show when not within 3 days */}
          {booking?.postCode && !showSensitiveInfo && (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <MdLocationOn className="text-3xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Location Map</p>
              <p className="text-sm text-gray-500 mt-1">
                {daysRemaining > 3 
                  ? `Map will be available ${daysRemaining - 3} day${daysRemaining - 3 > 1 ? 's' : ''} before the event`
                  : 'Event completed - Map access expired'
                }
              </p>
            </div>
          )}

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
              {daysRemaining !== null && (
                <p className={`text-xs mt-1 ${
                  daysRemaining <= 3 ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  {daysRemaining > 0 
                    ? `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining`
                    : daysRemaining === 0 
                      ? 'Today'
                      : `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) > 1 ? 's' : ''} ago`
                  }
                </p>
              )}
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
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">
                  {showSensitiveInfo ? (
                    booking?.phone
                  ) : (
                    <span className="text-gray-400">
                      {daysRemaining > 3 
                        ? `Available in ${daysRemaining - 3} day${daysRemaining - 3 > 1 ? 's' : ''}`
                        : 'Not available'
                      }
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Post Code</label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">
                    {showSensitiveInfo ? (
                      booking?.postCode
                    ) : (
                      <span className="text-gray-400">
                        {daysRemaining > 3 
                          ? `Available in ${daysRemaining - 3} day${daysRemaining - 3 > 1 ? 's' : ''}`
                          : 'Not available'
                        }
                      </span>
                    )}
                  </p>
                  {booking?.postCode && showSensitiveInfo && (
                    <button
                      onClick={() => onOpenMap(booking.location, booking.postCode)}
                      className="p-1 text-[#FF006A] hover:text-[#e5005f] transition-colors"
                      title="View on Map"
                    >
                      <MdLocationOn className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-gray-900">
                  {showSensitiveInfo ? (
                    booking?.location || "N/A"
                  ) : (
                    <span className="text-gray-400">
                      {daysRemaining > 3 
                        ? `Available in ${daysRemaining - 3} day${daysRemaining - 3 > 1 ? 's' : ''}`
                        : 'Not available'
                      }
                    </span>
                  )}
                </p>
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
                <label className="text-sm font-medium text-gray-600">Event Date</label>
                <p className="text-gray-900">
                  {booking?.dateOfEvent ? new Date(booking.dateOfEvent).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Sensitive Information Notice */}
          {!showSensitiveInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800">Information Access</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    Customer contact details and location information will be available 3 days before the scheduled event for privacy and security reasons.
                  </p>
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
              {loader ? "loading..." : 'Assign Butler'}
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
    onStatusChange(booking?._id, selectedStatus);
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
              {updateLoading ? "Loading..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Pagination Component (same as before)
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
      <div className="text-sm text-gray-600 text-center sm:text-left">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
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

const ButlerBooking = () => {
  const [activeButton, setActiveButton] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [butlerModalOpen, setButlerModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPostCode, setSelectedPostCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {data:user, status} = useSession();

  const id = user?.user?.id;

  if(status === 'loading...'){
    return <p>loading....</p>
  }

  // Calculate skip based on current page
  const skip = (currentPage - 1) * itemsPerPage;

  const { data, isLoading, error, refetch } = useGetBookingButlerQuery(
    { 
      limit: itemsPerPage, 
      skip: skip,
      status: activeButton,
      id:id
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: butlerData } = useGetAllButlerQuery();
  const [updaterStatus, {isLoading:updateLoading, error:updateError}] = useUpdaterStatusMutation();
  const {refetch:summuryRefetch} = useGetAdminSummuryQuery();

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

  const handleOpenMap = (location, postCode) => {
    setSelectedLocation(location);
    setSelectedPostCode(postCode);
    setMapModalOpen(true);
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
    try {
      // Implementation here
    } catch (error) {
      console.log(error)
      toast.error(error?.message || "Something went wrong!")
    }
  };

  const handleStatusUpdate = async(bookingId, newStatus) => {
    try {
      const data = {
        id: bookingId,
        status: newStatus,
        butlerid: id
      }

      const response= await updaterStatus(data).unwrap();
      toast.success("Status Updated");
      refetch()
      summuryRefetch();
      
    } catch (error) {
      toast.error(error?.message || "Something went wrong")
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
    setMapModalOpen(false);
    setSelectedBooking(null);
    setSelectedLocation("");
    setSelectedPostCode("");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Loading skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6">
          <div className="h-7 w-32 bg-gray-200 rounded-lg animate-pulse mb-4 md:mb-0"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-full bg-[#F6F4F5] p-1 h-[48px]">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-1.5 sm:ml-auto">
              <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-h-[370px] max-w-[76vw] overflow-scroll scrollbar-hide overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#333333] border-b text-base">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((header) => (
                  <th key={header} className="p-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <tr key={row} className="border-b border-gray-100">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cell) => (
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
    <div className="bg-white rounded-xl shadow-md p-6">
      <Toaster/>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-0">
          Bookings
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#F6F4F5] md:p-1 justify-center p-4 mx-auto sm:h-[44px] lg:h-[48px] overflow-x-auto whitespace-nowrap lg:overflow-visible lg:whitespace-normal [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
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
      <div className="max-h-[370px] max-w-[76vw] overflow-scroll scrollbar-hide overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#333333] border-b text-base">
              <th className="p-3 font-medium">Ref</th>
              <th className="p-3 font-medium">Date/Time</th>
              <th className="p-3 font-medium">Service</th>
              <th className="p-3 font-medium">Client</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Earning</th>
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
                    {b?.image ? (
                      <Image
                        src={b?.image}
                        alt={b.customer || 'img'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/Dashboard/customer.png"
                        alt={b.customer || 'img'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    )}
                    <span>{b.firstName + " " + b.lastName}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span>{b.location || "--"}</span>
                    {b.postCode && (
                      <button
                        onClick={() => handleOpenMap(b.location, b.postCode)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View on Map"
                      >
                        <MdLocationOn className="text-lg" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      statusColors[b.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                  </span>
                </td>
                <td className="p-3">${b?.butlerFee}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(b)}
                      className="p-2 text-gray-600 hover:text-[#FF006A] transition-colors"
                      title="View Details"
                    >
                      <FiEye className="text-lg" />
                    </button>
                    
                    {/* Map Button */}
                  
                    
                    {/* Change Status Button */}
                    <button
                      onClick={() => handleStatusChange(b)}
                      className="p-2 text-gray-600 hover:text-[#FF006A] transition-colors"
                      title="Change Status"
                    >
                      <MdOutlineEdit className="text-lg" />
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

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModalOpen}
        onClose={closeModals}
        onOpenMap={handleOpenMap}
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
        refetch={refetch}
      />

      <MapModal
        location={selectedLocation}
        postCode={selectedPostCode}
        isOpen={mapModalOpen}
        onClose={closeModals}
      />
    </div>
  );
};

export default ButlerBooking;