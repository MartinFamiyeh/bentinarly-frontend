// src/layouts/DashboardLayout.tsx
import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import { useResearcherOnboarding } from "../contexts/ResearcherOnboardingContext";
import { useSidebarCollapsed } from "../hooks/useSidebarCollapsed";

const DashboardLayout = () => {
  const { isMinimized: isSidebarMinimized, toggleSidebar } = useSidebarCollapsed();
  const { shouldAutoOpen, openModal } = useResearcherOnboarding();
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (shouldAutoOpen && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      openModal();
    }
  }, [shouldAutoOpen, openModal]);

  return (
    <div className="flex h-screen bg-[#F1F1F1] dark:bg-[#0B0B0B] gap-x-4">
      <Sidebar isMinimized={isSidebarMinimized} toggle={toggleSidebar} />

      <main className={`flex-1`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
