import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Project from "../../assets/icons/folder.png";
import ProjectActive from "../../assets/icons/folder-active.png";
import Analytics from "../../assets/icons/analytics.png";
import AnalyticsActive from "../../assets/icons/analytics-active.png";
import Templates from "../../assets/icons/templates.png";
import TemplatesActive from "../../assets/icons/templates-active.png";
import { createPortal } from "react-dom";

interface NavLinkItem {
  to: string;
  activeIcon: string;
  inactiveIcon: string;
  text: string;
}

interface SidebarNavigationProps {
  isMinimized: boolean;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

interface TooltipProps {
  text: string;
  position: { top: number; left: number };
}

const Tooltip: React.FC<TooltipProps> = ({ text, position }) => (
  <Portal>
    <div
      className="absolute z-50 flex items-center"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translateY(-50%)",
      }}>
      <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white shadow-sm" />
      <div className="bg-white text-[#FE5102] text-xs font-medium px-2 py-1 rounded shadow whitespace-nowrap">
        {text}
      </div>
    </div>
  </Portal>
);

const navLinks: NavLinkItem[] = [
  {
    to: "/surveys/allsurveys",
    activeIcon: ProjectActive,
    inactiveIcon: Project,
    text: "All Surveys",
  },
  {
    to: "/surveys/profile",
    activeIcon: AnalyticsActive,
    inactiveIcon: Analytics,
    text: "Profile",
  },
  {
    to: "/surveys/rewards",
    activeIcon: TemplatesActive,
    inactiveIcon: Templates,
    text: "Rewards & Earnings",
  },
  {
    to: "/surveys/notifications",
    activeIcon: TemplatesActive,
    inactiveIcon: Templates,
    text: "Notifications",
  },
];

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isMinimized }) => {
  const [hoveredItem, setHoveredItem] = useState<NavLinkItem | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (
    item: NavLinkItem,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (isMinimized) {
      setHoveredItem(item);
      const targetRect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + 16,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <nav className="flex-grow">
      <ul>
        {navLinks.map((item) => (
          <li key={item.to} className="relative group mb-4">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 text-sm rounded-md ${
                  isActive
                    ? "bg-[#FFF5F0] text-[#FE5102] font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                } ${isMinimized ? "justify-center" : ""}`
              }
              onMouseEnter={(e) => handleMouseEnter(item, e)}
              onMouseLeave={handleMouseLeave}>
              {({ isActive }) => (
                <>
                  <img src={isActive ? item.activeIcon : item.inactiveIcon} className="w-5 h-5" />
                  {!isMinimized && item.text}
                </>
              )}
            </NavLink>

            {isMinimized && hoveredItem?.to === item.to && (
              <Tooltip text={item.text} position={tooltipPosition} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
