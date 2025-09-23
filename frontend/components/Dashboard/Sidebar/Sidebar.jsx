"use client";
import React from "react";
import { RiMenuUnfold3Fill } from "react-icons/ri";
import { BsBook } from "react-icons/bs";
import { usePathname } from "next/navigation";
import { FaMoneyBillAlt, FaCog, FaEnvelope, FaUsers } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/features/sidebarSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const pathname = usePathname();

  const sidebarItems = [
    { name: "Bookings", icon: <BsBook />, href: "/dashboard" },
    { name: "Users", icon: <FaUsers />, href: "/dashboard/users" },
    { name: "Financials", icon: <FaMoneyBillAlt />, href: "/dashboard/financials" },
    { name: "Services", icon: <FaCog />, href: "/dashboard/services" },
    { name: "Admin Tools", icon: <FaCog />, href: "/dashboard/adminTools" },
    { name: "Messages", icon: <FaEnvelope />, href: "/dashboard/messages" },
  ];

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 bg-white
        h-screen w-72 border rounded-2xl pt-10 p-6
        md:sticky md:top-10 md:h-[calc(100vh-5rem)]
        flex flex-col overflow-hidden transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header (no scroll) */}
        <div className="space-y-6 shrink-0">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="text-2xl text-[#FF006A] md:hidden"
          >
            <RiMenuUnfold3Fill />
          </button>

          <div className="flex items-center gap-2">
            <Image src="/Footer/logo.png" alt="logo" width={46} height={52} className="object-cover" />
            <h2 className="font-semibold">Hunky Butler Service</h2>
          </div>
        </div>

        {/* Scrollable menu ONLY */}
        <div className="flex-1 overflow-y-auto mt-6 pb-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-pink-100 text-pink-600 font-medium"
                      : "hover:bg-pink-50 text-gray-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer pinned at bottom */}
        <div className="text-gray-400 text-sm shrink-0">
          <p>Version 0.1</p>
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 md:hidden" onClick={() => dispatch(toggleSidebar())} />
      )}
    </div>
  );
};

export default Sidebar;
