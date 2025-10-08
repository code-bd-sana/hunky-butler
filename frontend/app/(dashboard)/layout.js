"use client";
import React, { useState } from "react";
import "../globals.css";
import Sidebar from "@/components/Dashboard/Sidebar/Sidebar";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body className="antialiased ">
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
      </body>
    </html>
  );
};

export default DashboardLayout;
