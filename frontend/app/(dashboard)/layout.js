import Navbar from "@/components/shared/Navbar";
import React from "react";
import "../globals.css";
export const metadata = {
  title: "Hunky Butlers",
  description:
    "Buff Butlers, Life Drawing, Cocktail Masterclasses & More, We Bring the Fun to You.",
};
const DashboardLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default DashboardLayout;
