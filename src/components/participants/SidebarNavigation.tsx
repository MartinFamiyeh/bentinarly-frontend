import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import AllSurveys from "../../assets/icons/all-surveys.svg";
import AllSurveysActive from "../../assets/icons/all-surveys-active.svg";
import Wallet from "../../assets/icons/wallet.svg";
import WalletActive from "../../assets/icons/wallet-active.svg";
import Profile from "../../assets/icons/profile-icon.svg";
import ProfileActive from "../../assets/icons/profile-icon-active.svg";
import { createPortal } from "react-dom";

type SvgIcon = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

interface NavLinkItem {
  to: string;
  activeIcon: SvgIcon;
  inactiveIcon: SvgIcon;
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
    activeIcon: AllSurveysActive as unknown as SvgIcon,
    inactiveIcon: AllSurveys as unknown as SvgIcon,
    text: "All Surveys",
  },
  {
    to: "/surveys/rewards",
    activeIcon: WalletActive as unknown as SvgIcon,
    inactiveIcon: Wallet as unknown as SvgIcon,
    text: "Rewards & Earnings",
  },
  {
    to: "/surveys/profile",
    activeIcon: ProfileActive as unknown as SvgIcon,
    inactiveIcon: Profile as unknown as SvgIcon,
    text: "Profile",
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
              end={item.to === "/surveys/allsurveys"}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-[#FFF5F0] text-[#FE5102] font-semibold"
                    : "text-[#696969] hover:bg-gray-100 font-medium"
                } ${isMinimized ? "justify-center" : ""}`
              }
              onMouseEnter={(e) => handleMouseEnter(item, e)}
              onMouseLeave={handleMouseLeave}>
              {({ isActive }) => {
                const Icon = isActive ? item.activeIcon : item.inactiveIcon;
                return (
                  <>
                    <Icon className="w-5 h-5 shrink-0" aria-hidden />
                    {!isMinimized && item.text}
                  </>
                );
              }}
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
