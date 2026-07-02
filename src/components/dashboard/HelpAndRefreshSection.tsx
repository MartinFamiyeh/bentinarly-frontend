import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import Refresh from "../../assets/icons/refresh.png";
import Help from "../../assets/icons/help.png";
import Arrow from "../../assets/icons/chevron-down.png";

interface HelpAndRefreshSectionProps {
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
      {/* Arrow */}
      <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white dark:border-r-gray-900 shadow-sm" />

      {/* Tooltip box */}
      <div className="bg-white dark:bg-gray-900 text-[#FE5102] text-xs font-medium px-2 py-1 rounded shadow whitespace-nowrap">
        {text}
      </div>
    </div>
  </Portal>
);

const HelpAndRefreshSection: React.FC<HelpAndRefreshSectionProps> = ({ isMinimized }) => {
  const [isHelpMenuOpen, setHelpMenuOpen] = useState(false);
  const [helpMenuPos, setHelpMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpButtonRef.current &&
        !helpButtonRef.current.contains(event.target as Node) &&
        isHelpMenuOpen
      ) {
        setHelpMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isHelpMenuOpen]);

  const toggleHelpMenu = () => {
    if (helpButtonRef.current) {
      const rect = helpButtonRef.current.getBoundingClientRect();
      setHelpMenuPos({
        top: rect.top - 250,
        left: rect.right + 25,
      });
    }
    setHelpMenuOpen(!isHelpMenuOpen);
  };

  const handleMouseEnter = (
    item: string,
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
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

  const HelpDropdownMenu = () =>
    isHelpMenuOpen &&
    helpMenuPos && (
      <Portal>
        <div
          style={{ position: "fixed", top: helpMenuPos.top, left: helpMenuPos.left }}
          className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-[9999]">
          <div className="py-4">
            <div className="px-4 text-xs mb-1 text-[#292929] dark:text-gray-100">
              <p>Help Center</p>
            </div>
            {[
              "How do I build a survey and customize the questions to fit my research?",
              "How do I find and reach the right participants for my surveys?",
              "What do the different survey statuses mean and how do I manage them?",
              "Where can I view my survey responses and analyze the data?",
              "How does pricing work and what does it cost to run a survey on Bentinarly?",
            ].map((q, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center px-4 py-2 text-sm text-[#6B7280] dark:text-gray-400 hover:bg-[#FFF5F0] dark:hover:bg-gray-800">
                {q}
              </a>
            ))}
          </div>
        </div>
      </Portal>
    );

  return (
    <>
      <Link
        to="#"
        className={`flex items-center gap-3 p-2 my-1 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isMinimized ? "justify-center" : ""
        }`}
        onMouseEnter={(e) => handleMouseEnter("Refresh", e)}
        onMouseLeave={handleMouseLeave}>
        <img src={Refresh} className="w-5 h-5" />
        {!isMinimized && "Refresh"}
      </Link>
      {isMinimized && hoveredItem === "Refresh" && (
        <Tooltip text="Refresh" position={tooltipPosition} />
      )}

      <button
        ref={helpButtonRef}
        onClick={toggleHelpMenu}
        className={`flex items-center gap-3 p-2 my-1 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isMinimized ? "justify-center" : "justify-between"
        }`}
        onMouseEnter={(e) => handleMouseEnter("Help Center", e)}
        onMouseLeave={handleMouseLeave}>
        <div className="flex items-center gap-2">
          <img src={isHelpMenuOpen ? Help : Help} className="w-5 h-5" />
          {!isMinimized && "Help Center"}
        </div>

        {!isMinimized && (
          <img src={Arrow} className={isHelpMenuOpen ? "-rotate-90" : "-rotate-90"} />
        )}
      </button>
      {isMinimized && hoveredItem === "Help Center" && (
        <Tooltip text="Help Center" position={tooltipPosition} />
      )}

      <HelpDropdownMenu />
    </>
  );
};

export default HelpAndRefreshSection;
