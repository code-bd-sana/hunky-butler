"use client";
import React, { useState } from "react";
import "../globals.css";
import Sidebar from "@/components/Dashboard/Sidebar/Sidebar";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "../provider/SocketProvider";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
   <SocketProvider>
        <SessionProvider>
         <Provider store={store}>
          <div className="w-full max-w-screen bg-[#f6f4f5] flex flex-col md:flex-row gap-0 lg:gap-8 min-h-screen pt-2 md:py-10 px-2 md:px-6 lg:px-10 md:pl-0">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            {/* Main Content */}
            <div className="max-w-screen flex-1 overflow-hidden px-4 mx-auto">
              {children} {/* admin/user/customer pages go here */}
            </div>
          </div>
        </Provider>
       </SessionProvider>
   </SocketProvider>
  );
};

export default DashboardLayout;
