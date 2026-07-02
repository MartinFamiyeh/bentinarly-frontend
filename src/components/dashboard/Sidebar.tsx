import { useState } from "react";
import CreateSurvey from "./CreateSurvey";
import CreateProject from "./CreateProject";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import HelpAndRefreshSection from "./HelpAndRefreshSection";
import UserProfileSection from "./UserProfileSection";

interface SidebarProps {
  isMinimized: boolean;
  toggle: () => void;
}

const Sidebar = ({ isMinimized, toggle }: SidebarProps) => {
  const [isCreateSurveyModalOpen, setIsCreateSurveyModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  return (
    <aside
      className={`h-screen rounded-r-xl bg-white dark:bg-gray-900 shadow-sm flex flex-col transition-all duration-300 ease-in-out z-40 overflow-visible ${
        isMinimized ? "w-20" : "w-64"
      }`}>
      <SidebarHeader isMinimized={isMinimized} toggle={toggle} />

      <div className="flex flex-col flex-grow px-4 overflow-y-auto">
        <SidebarNavigation
          isMinimized={isMinimized}
          setIsCreateSurveyModalOpen={setIsCreateSurveyModalOpen}
          setIsCreateProjectModalOpen={setIsCreateProjectModalOpen}
        />
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
