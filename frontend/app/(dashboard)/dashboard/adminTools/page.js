"use client";
import ArticaleManagement from "@/components/admin/ArticaleManagement";
import NotificationManagement from "@/components/admin/NotificationManagement";
import DashNav from "@/components/Dashboard/DashNav/DashNav";
import { useActiveTab, useSetTab } from "@/hooks/useUsersTab";
import React, { useEffect, useState } from "react";

export default function AdminToolspage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setUserTab = useSetTab();
  const activeTab = useActiveTab();

  const tab = [
    {
      name: "Notification management",
      slug: "notification",
    },
    {
      name: "Article management",
      slug: "article",
    },
  ];

  useEffect(() => {
    setUserTab("notification");
  }, []);
  return (
    <div>
      <DashNav
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tab={tab}
      />

      {activeTab === "notification" ? (
        <NotificationManagement />
      ) : (
        <ArticaleManagement />
      )}
    </div>
  );
}
