"use client";
import AdminCard from "@/components/Dashboard/AdminCard/AdminCard";
import Booking from "@/components/Dashboard/Booking/Booking";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { RiMenuUnfold3Fill } from "react-icons/ri";
import { BsBook } from "react-icons/bs";
import {
  FaUser,
  FaMoneyBillAlt,
  FaCog,
  FaEnvelope,
  FaUsers,
} from "react-icons/fa";
import Image from "next/image";
const DashboardHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarItems = [
    { name: "Bookings", icon: <BsBook /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Financials", icon: <FaMoneyBillAlt /> },
    { name: "Services", icon: <FaCog /> },
    { name: "Admin Tools", icon: <FaCog /> },
    { name: "Messages", icon: <FaEnvelope /> },
  ];
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 min-h-screen">
      {/* Mobile Topbar */}
      <div className="md:hidden px-4 py-2 mt-2 bg-white shadow-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl text-[#FF006A]"
        >
          <RiMenuUnfold3Fill />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 z-50 h-full w-60 bg-white p-6 flex flex-col justify-between shadow-md transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/Footer/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <h2 className="font-semibold">Hunky Butler Service</h2>
        </div>
        <div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl text-[#FF006A] md:hidden"
          >
            <RiMenuUnfold3Fill />
          </button>
          <nav className="space-y-4">
            {sidebarItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 cursor-pointer"
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            ))}
          </nav>
        </div>
        <div className="text-gray-400 text-sm">Version 0.1</div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-2 md:p-6">
        <AdminCard />
        <Booking />
      </div>
    </div>
  );
};

export default DashboardHome;
