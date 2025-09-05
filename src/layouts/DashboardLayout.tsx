// src/layouts/DashboardLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex h-screen bg-[#F1F1F1]">
      <Sidebar isMinimized={isSidebarMinimized} toggle={toggleSidebar} />

      {/* Main Content Area */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarMinimized ? "ml-20" : "ml-64"
        }`}>
        {/* The content of your pages will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
