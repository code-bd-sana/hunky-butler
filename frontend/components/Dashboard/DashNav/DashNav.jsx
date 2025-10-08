"use client";
import { useMyProfileQuery } from "@/features/auth";
import { toggleSidebar } from "@/features/sidebarSlice";
import { useAdminToolTab } from "@/hooks/useAdminToolTab";
import { useActiveTab, useSetTab } from "@/hooks/useUsersTab";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FiBell, FiSun } from "react-icons/fi";
import { HiMenuAlt1 } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiMenuUnfold3Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";

const DashNav = ({ tab }) => {
  const activeTab = useActiveTab();
  const activeAdminTool = useAdminToolTab();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const setUserTab = useSetTab();
  const data = useSession();

  const role = data?.data?.user?.role;
  const status = data.status;
  const {data:profile, isLoading} = useMyProfileQuery(data?.data?.user?.id)


  if(status === "loading"){
    return <div className="flex justify-between items-center max-w-[90vw] bg-white mb-6 rounded-3xl py-4 px-4 md:px-8 animate-pulse border border-zinc-100 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  }

  ``

  const tabHandaler = async (slug) => {
    try {
      setUserTab(slug);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between overflow-hidden max-w-[90vw] bg-white items-center mb-6  rounded-3xl py-4 px-2 md:px-8">
      {tab ? (
        <div className="flex items-center">
          <div className="2xl:hidden">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="text-xl md:text-2xl text-[#FF006A]  border-2 border-gray-300 p-2 rounded-md"
            >
              <HiMenuAlt1 />
            </button>
          </div>
          <div
            className={`flex md:flex-row items-center ${
              activeTab === "notification" || "article" ? "" : ""
            }`}
          >
            {tab.map((tab) => (
              <div
                key={tab.slug}
                onClick={() => tabHandaler(tab.slug)}
                className={`
      ${
        activeTab === tab.slug
          ? "text-[#FF006A] text-sm md:text-base"
          : "text-sm md:text-base text-left"
      } 
      ${tab.slug === "notification" ? "text-sm ml-2" : "ml-2"} 
       cursor-pointer
    `}
              >
                {tab.name}

                <div
                  className={`mt-1 mx-auto md:mx-0 h-[1px] 
        ${tab.slug === "notification" ? "" : " w-16 md:w-28"} 
        ${tab.slug === "article" ? "" : "w-16 md:w-28"}   
        ${activeTab === tab.slug ? "bg-[#FF006A]" : ""}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="2xl:hidden">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="text-2xl text-[#FF006A]  border-2 border-gray-300 p-2 rounded-md"
            >
              <HiMenuAlt1 />
            </button>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Good Morning</p>
            <h2 className="text-xl md:text-2xl font-semibold">Tylor Greak</h2>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center gap-2">
        <div className="border-2 border-gray-300 p-2 md:p-4 rounded-full">
          <FiBell className="text-xl cursor-pointer" />
        </div>
        {/* <FiSun className="text-xl text-gray-600 cursor-pointer" /> */}

        <div className="">
          {/* Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex  items-center px-2 py-1 cursor-pointer md:px-3 md:py-2 rounded-full border bg-white text-gray-600 border-gray-300 text-sm font-medium hover:bg-pink-100 hover:text-pink-500 transition"
          >
            <Image
              src={profile?.data?.image}// public folder er image
              alt="profile"
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover"
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
                 <Link href={'/dashboard/profile'}> 
                  <button className="w-full text-left cursor-pointer px-4 py-2 hover:bg-pink-100 hover:text-pink-500">
                    Profile
                  </button></Link>
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
