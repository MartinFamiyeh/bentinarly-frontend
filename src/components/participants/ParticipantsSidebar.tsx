import SidebarHeader from "../dashboard/SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import HelpAndRefreshSection from "../dashboard/HelpAndRefreshSection";
import UserProfileSection from "../dashboard/UserProfileSection";

interface SidebarProps {
  isMinimized: boolean;
  toggle: () => void;
}

const ParticipantsSidebar = ({ isMinimized, toggle }: SidebarProps) => {
  return (
    <aside
      className={`h-screen rounded-r-xl bg-white dark:bg-gray-900 shadow-sm flex flex-col transition-all duration-300 ease-in-out z-40 overflow-visible ${
        isMinimized ? "w-20" : "w-64"
      }`}>
      <SidebarHeader isMinimized={isMinimized} toggle={toggle} />

      <div className="flex flex-col flex-grow px-4 overflow-y-auto">
        <SidebarNavigation isMinimized={isMinimized} />
        <HelpAndRefreshSection isMinimized={isMinimized} />
      </div>

      <UserProfileSection isMinimized={isMinimized} />
    </aside>
  );
};

export default ParticipantsSidebar;
