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
import { GiHandcuffs } from "react-icons/gi";
import { useSession } from "next-auth/react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const pathname = usePathname();
  const data = useSession();

  const role = data?.data?.user?.role;
  const status = data.status;


  // Loading Skeleton
  if(status === 'loading'){
    return (
      <div>
        {/* Sidebar Skeleton */}
        <div
          className={`fixed lg:sticky top-0 left-0 z-50 bg-white
            h-screen lg:h-[calc(100vh-5rem)] w-72 border rounded-2xl pt-10 p-6
            flex flex-col overflow-hidden transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0`}
        >
          {/* Header Skeleton */}
          <div className="space-y-6 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Menu Items Skeleton */}
          <div className="flex-1 overflow-y-auto mt-6 pb-4">
            <nav className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg"
                >
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer Skeleton */}
          <div className="text-gray-400 text-sm shrink-0">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 md:hidden"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}
      </div>
    );
  }

  const adminSidebar = [
    { name: "Bookings", icon: <BsBook />, href: "/dashboard" },
    { name: "Users", icon: <FaUsers />, href: "/dashboard/users" },
    {
      name: "Financials",
      icon: <FaMoneyBillAlt />,
      href: "/dashboard/financials",
    },
    { name: "Services", icon: <FaCog />, href: "/dashboard/services" },
    { name: "Admin Tools", icon: <FaCog />, href: "/dashboard/adminTools" },
    { name: "Messages", icon: <FaEnvelope />, href: "/dashboard/messages" },
  ];
  
  const customerSidebar = [
    { name: "My Bookings", icon: <BsBook />, href: "/dashboard" },
    { name: "Payments details", icon: <FaUsers />, href: "/dashboard/payments" },
    { name: "Messages", icon: <FaEnvelope />, href: "/dashboard/messages" },
  ];
  
  const butlerSidebar = [
    { name: "My Bookings", icon: <BsBook />, href: "/dashboard" },
    { name: "Payments details", icon: <FaUsers />, href: "/dashboard/payments" },
    { name: "Schedule", icon: <FaUsers />, href: "/dashboard/schedule" },
    { name: "Messages", icon: <FaEnvelope />, href: "/dashboard/messages" },
  ];

  let sidebarItems = [];
  sidebarItems = role === 'admin' ? adminSidebar : role === 'customer' ? customerSidebar : butlerSidebar;

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 z-50 bg-white
          h-screen lg:h-[calc(100vh-5rem)] w-72 border rounded-2xl pt-10 p-6
          flex flex-col overflow-hidden transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Header (no scroll) */}
        <div className="space-y-6 shrink-0">
          <div className="flex items-center gap-2">
            <Image
              src="/Footer/logo.png"
              alt="logo"
              width={46}
              height={52}
              className="object-cover"
            />
            <h2 className="font-semibold">Hunky Butler Service</h2>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="text-2xl text-[#FF006A] lg:hidden"
            >
              <GiHandcuffs />
            </button>
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
        <div
          className="fixed inset-0 md:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
    </div>
  );
};

export default Sidebar;