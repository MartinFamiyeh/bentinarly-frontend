// src/layouts/SurveyLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SurveySidebar from "../components/dashboard/SurveySidebar";

const SurveyLayout = () => {
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex h-screen bg-[#F1F1F1] gap-x-4">
      <SurveySidebar isMinimized={isSidebarMinimized} toggle={toggleSidebar} />

      <main className={`flex-1`}>
        <Outlet />
      </main>
    </div>
  );
};

export default SurveyLayout;
