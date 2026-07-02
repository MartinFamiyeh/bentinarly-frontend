// src/layouts/SurveyLayout.tsx
import { Outlet } from "react-router-dom";
import SurveySidebar from "../components/dashboard/SurveySidebar";
import { SurveyEditingProvider } from "../contexts/SurveyEditingContext";
import { useSidebarCollapsed } from "../hooks/useSidebarCollapsed";

const SurveyLayout = () => {
  const { isMinimized: isSidebarMinimized, toggleSidebar } = useSidebarCollapsed();

  return (
    <SurveyEditingProvider>
      <div className="flex h-screen bg-[#F1F1F1] dark:bg-[#0B0B0B] gap-x-4">
        <SurveySidebar isMinimized={isSidebarMinimized} toggle={toggleSidebar} />

        <main className={`flex-1`}>
          <Outlet />
        </main>
      </div>
    </SurveyEditingProvider>
  );
};

export default SurveyLayout;
