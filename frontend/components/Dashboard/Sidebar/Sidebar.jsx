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

const Sidebar = () => {
  const sidebarItems = [
    { name: "Bookings", icon: <BsBook /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Financials", icon: <FaMoneyBillAlt /> },
    { name: "Services", icon: <FaCog /> },
    { name: "Admin Tools", icon: <FaCog /> },
    { name: "Messages", icon: <FaEnvelope /> },
  ];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="bg-white">
      <div className="md:hidden px-4 py-2 mt-2  shadow-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl text-[#FF006A]"
        >
          <RiMenuUnfold3Fill />
        </button>
      </div>
      <div
        className={`fixed md:relative top-0 left-0 z-50 bg-white min-h-screen w-64 border rounded-2xl pt-10  p-6 flex flex-col space-y-4 shadow-md transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl text-[#FF006A] md:hidden"
        >
          <RiMenuUnfold3Fill />
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="/Footer/logo.png"
            alt="logo"
            width={46}
            height={52}
            className=" object-cover"
          />
          <h2 className="font-semibold">Hunky Butler Service</h2>
        </div>
        <div>
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
