// src/layouts/ParticipantsLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/participants/ParticipantsSidebar";
import { useSidebarCollapsed } from "../hooks/useSidebarCollapsed";

const ParticipantsLayout = () => {
  const { isMinimized: isSidebarMinimized, toggleSidebar } = useSidebarCollapsed();

  return (
    <div className="flex h-screen bg-[#F1F1F1] dark:bg-[#0B0B0B] gap-x-4">
      <Sidebar isMinimized={isSidebarMinimized} toggle={toggleSidebar} />

      <main className={`flex-1`}>
        <Outlet />
      </main>
    </div>
  );
};

export default ParticipantsLayout;
