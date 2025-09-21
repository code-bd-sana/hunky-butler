"use client";
import React, { useState } from "react";
import "../globals.css";
import Sidebar from "@/components/Dashboard/Sidebar/Sidebar";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
// export const metadata = {
//   title: "Hunky Butlers",
//   description:
//     "Buff Butlers, Life Drawing, Cocktail Masterclasses & More, We Bring the Fun to You.",
// };
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body className="antialiased">
       <Provider store={store}>

         <div className="w-full flex flex-col md:flex-row md:gap-10 min-h-screen pt-2 md:pt-10 px-2 md:px-6 lg:px-10 bg-[#f6f4f5]">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {/* Main Content */}
          <div className="flex-1">
           
            {children} {/* admin/user/customer pages go here */}
          </div>
        </div>
       </Provider>
      </body>
    </html>
  );
};

export default DashboardLayout;
