// src/layouts/ParticipantsLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/participants/ParticipantsSidebar";

const ParticipantsLayout = () => {
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex h-screen bg-[#F1F1F1] gap-x-4">
      <Sidebar isMinimized={isSidebarMinimized} toggle={toggleSidebar} />

      <main className={`flex-1`}>
        <Outlet />
      </main>
    </div>
  );
};

export default ParticipantsLayout;
