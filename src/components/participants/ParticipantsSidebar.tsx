import { useState } from "react";
import CreateSurvey from "../dashboard/CreateSurvey";
import CreateProject from "../dashboard/CreateProject";
import SidebarHeader from "../dashboard/SidebarHeader";
import SidebarNavigation from "../participants/SidebarNavigation";
import HelpAndRefreshSection from "../dashboard/HelpAndRefreshSection";
import UserProfileSection from "../dashboard/UserProfileSection";

interface SidebarProps {
  isMinimized: boolean;
  toggle: () => void;
}

const Sidebar = ({ isMinimized, toggle }: SidebarProps) => {
  const [isCreateSurveyModalOpen, setIsCreateSurveyModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  return (
    <aside
      className={`h-screen rounded-r-xl bg-white shadow-sm flex flex-col transition-all duration-300 ease-in-out z-40 overflow-visible ${
        isMinimized ? "w-20" : "w-64"
      }`}>
      <SidebarHeader isMinimized={isMinimized} toggle={toggle} />

      <div className="flex flex-col flex-grow px-4 overflow-y-auto">
        <SidebarNavigation isMinimized={isMinimized} />
        <HelpAndRefreshSection isMinimized={isMinimized} />
      </div>

      <UserProfileSection isMinimized={isMinimized} />

      <CreateSurvey
        isOpen={isCreateSurveyModalOpen}
        onClose={() => setIsCreateSurveyModalOpen(false)}
      />

      <CreateProject
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
