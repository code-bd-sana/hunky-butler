"use client";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import UserButtler from "@/components/Dashboard/UsersCardForAdmin/UserButtler";
import UserCustomer from "@/components/Dashboard/UsersCardForAdmin/UserCustomer";
import ButtlerList from "@/components/Dashboard/UsersTableForAdmin/ButtlerList";
import CustomersList from "@/components/Dashboard/UsersTableForAdmin/CustomersList";
import { useActiveTab, useSetTab } from "@/hooks/useUsersTab";
import React, { useEffect, useState } from "react";

export default function page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const setUserTab = useSetTab();
  const activeTab = useActiveTab();

  const tab = [
    {
      name: "Customer",
      slug: "customer",
    },
    {
      name: "Butler",
      slug: "butler",
    },
  ];

  useEffect(() => {
    setUserTab("customer");
  }, []);
  return (
    <div>
      <DashNav
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tab={tab}
      />
      {activeTab === "customer" ? (
        <UserCustomer></UserCustomer>
      ) : (
        <UserButtler />
      )}
      {activeTab === "customer" ? (
        <CustomersList></CustomersList>
      ) : (
        <ButtlerList />
      )}
    </div>
  );
}
