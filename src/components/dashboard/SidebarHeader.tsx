import React from "react";
import Expand from "../../assets/icons/expand.png";
import Minimize from "../../assets/icons/minimize.png";

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
      <button onClick={toggle}>
        <img src={isMinimized ? Expand : Minimize} className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SidebarHeader;
