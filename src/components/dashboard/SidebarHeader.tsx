import React from "react";
import Expand from "../../assets/icons/expand_nav.svg";
import Minimize from "../../assets/icons/collapse_nav.svg";

interface SidebarHeaderProps {
  isMinimized: boolean;
  toggle: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isMinimized, toggle }) => {
  return (
    <div
      className={`flex items-center p-4 shrink-0 ${
        isMinimized ? "justify-center flex-col space-y-4" : "justify-between"
      }`}>
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-[29px] h-[22.6px] shrink-0" />
        {!isMinimized && (
          <span className="font-medium text-xl text-[#292929]">Bentinarly Poll</span>
        )}
      </div>
      <button onClick={toggle}>{isMinimized ? <Expand /> : <Minimize />}</button>
    </div>
  );
};

export default SidebarHeader;
