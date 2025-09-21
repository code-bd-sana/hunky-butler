"use client";
import { useAdminToolTab } from "@/hooks/useAdminToolTab";
import { useActiveTab, useSetTab } from "@/hooks/useUsersTab";
import Image from "next/image";
import React, { useState } from "react";
import { FiBell, FiSun } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiMenuUnfold3Fill } from "react-icons/ri";


const DashNav = ({ isSidebarOpen, setIsSidebarOpen, tab }) => {
  const activeTab = useActiveTab();
  const activeAdminTool = useAdminToolTab();
  console.log(activeAdminTool, "this is admin tools tab");
  console.log(activeTab, "This is active tab");
  const [open, setOpen] = useState(false);

  const setUserTab = useSetTab();

  const tabHandaler = async (slug) => {
    try {
      setUserTab(slug);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="md:flex justify-between bg-white items-center mb-6  rounded-3xl py-4 px-3">
      <div className="md:hidden px-4 py-2 mt-2">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl text-[#FF006A]"
        ></button>
      </div>

      {tab ? (
        <div>
          <div
            className={`lg:flex items-center  ml-4 ${
              activeTab === "notification" || "article" ? "" : ""
            }`}
          >
            {tab.map((tab) => (
              <div
                key={tab.slug}
                onClick={() => tabHandaler(tab.slug)}
                className={`${
                  activeTab === tab.slug ? "text-[#FF006A]" : ""
                } text-center cursor-pointer`}
              >
                {tab.name}

                <div
                  className={` mt-1 mx-auto md:mx-0 h-[1px] ${
                    tab.slug === "notification" ? "w-64" : "w-28"
                  } ${tab.slug === "article" ? "w-64" : "w-28"}   ${
                    activeTab === tab.slug ? "bg-[#FF006A]" : ""
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-500 text-sm">Good Morning</p>
          <h2 className="text-2xl font-semibold">Tylor Greak</h2>
        </div>
      )}
      <div className="flex justify-center items-center gap-4">
        <FiBell className="text-xl text-gray-600 cursor-pointer" />
        {/* <FiSun className="text-xl text-gray-600 cursor-pointer" /> */}

        <div className="">
          {/* Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex  items-center px-2 py-2 rounded-full border bg-white text-gray-600 border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition"
          >
            <Image
              src="/Dashboard/customer.png" // public folder er image
              alt=""
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <MdKeyboardArrowDown
              className={`text-2xl ml-1 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-6  mt-2 w-40 bg-white border border-gray-200 rounded-lg z-10">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <button className="w-full text-left  px-4 py-2 hover:bg-pink-100 hover:text-pink-500">
                    Profile
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashNav;
