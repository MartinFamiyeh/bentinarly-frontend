import React from "react";
import { NavLink } from "react-router-dom";
import Expand from "../../assets/icons/expand_nav.svg";
import Minimize from "../../assets/icons/collapse_nav.svg";
import Questionnaire from "../../assets/icons/questionnaire.png";
import QuestionnaireActive from "../../assets/icons/questionnaire-active.png";

import Demographic from "../../assets/icons/demographic.png";
import DemographicActive from "../../assets/icons/demographics-active.png";

import Analytics from "../../assets/icons/analytics.png";
import AnalyticsActive from "../../assets/icons/analytics-active.png";

import { useSurveyEditing } from "../../contexts/SurveyEditingContext";

interface NavLinkItem {
  to: string;
  activeIcon: string;
  inactiveIcon: string;
  text: string;
  subItems?: { to: string; text: string }[];
}

interface SidebarProps {
  isMinimized: boolean;
  toggle: () => void;
}

const SurveySidebar = ({ isMinimized, toggle }: SidebarProps) => {
  const { saveStatus, lastSavedAt, lastLocalDraftAt } = useSurveyEditing();
  const navLinks: NavLinkItem[] = [
    {
      to: "/survey/questionnaires",
      activeIcon: QuestionnaireActive,
      inactiveIcon: Questionnaire,
      text: "Questionnaires",
    },
    {
      to: "/survey/demographics",
      activeIcon: DemographicActive,
      inactiveIcon: Demographic,
      text: "Target Audience",
    },
    {
      to: "/survey/analytics",
      activeIcon: AnalyticsActive,
      inactiveIcon: Analytics,
      text: "Analytics",
    },
  ];

  return (
    <aside
      className={`h-screen rounded-r-xl bg-white shadow-sm flex flex-col transition-all duration-300 ease-in-out z-40 ${
        isMinimized ? "w-20" : "w-64"
      }`}>
      <div
        className={`flex items-center p-4 shrink-0  ${
          isMinimized ? "justify-center flex-col space-y-4" : "justify-between"
        }`}>
        <div className={`flex items-center gap-2 overflow-hidden ${isMinimized ? "" : ""}`}>
          <img src="/logo.svg" alt="Logo" className="w-[29px] h-[22.6px] shrink-0" />
          <span
            className={`font-medium text-xl whitespace-nowrap text-[#292929] ${
              isMinimized ? "hidden" : "inline"
            }`}>
            Bentinarly Poll
          </span>
        </div>
        <button onClick={toggle}>{isMinimized ? <Expand /> : <Minimize />}</button>
      </div>

      {/* <div className="p-4">
        <div
          className={`relative flex items-center gap-2 group ${
            isMinimized ? "justify-center" : ""
          }`}>
          <Survey  />
          <span className={isMinimized ? "hidden" : "inline"}>Survey Name</span>

          {isMinimized && (
            <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#FFF5F0] text-[#FE5102] text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
              Survey Name
            </span>
          )}
        </div>
      </div> */}

      <div className="flex flex-col flex-grow px-4 overflow-hiden">
        <nav className="flex-grow">
          <ul>
            {navLinks.map((item) => {
              return (
                <li key={item.to} className="relative group mb-4">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 text-sm rounded-md transition-colors w-full ${
                        isActive
                          ? "bg-[#FFF5F0] text-[#FE5102] font-semibold"
                          : "text-gray-600 hover:bg-gray-100 font-medium"
                      } ${isMinimized ? "justify-center" : ""}`
                    }>
                    {({ isActive }) => (
                      <>
                        <img
                          src={isActive ? item.activeIcon : item.inactiveIcon}
                          className="w-5 h-5"
                          alt={`${item.text} icon`}
                        />
                        <span
                          className={`transition-opacity duration-200 ${
                            isMinimized ? "hidden" : "inline"
                          }`}>
                          {item.text}
                        </span>
                      </>
                    )}
                  </NavLink>
                  {isMinimized && (
                    <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#FFF5F0] text-[#FE5102] text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.text}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Save / draft status at bottom of sidebar */}
        <div className="py-3 text-xs text-gray-500 border-t border-gray-100 mt-2">
          {!isMinimized && (
            <>
              {saveStatus === "saving" && <p>Saving...</p>}
              {saveStatus === "saved" && (
                <p>
                  Saved to server
                  {lastSavedAt
                    ? ` · ${new Date(lastSavedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : ""}
                </p>
              )}
              {saveStatus === "draft-local" && (
                <p>
                  Draft saved locally
                  {lastLocalDraftAt
                    ? ` · ${new Date(lastLocalDraftAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : ""}
                </p>
              )}
              {saveStatus === "error" && <p className="text-red-500">Save failed</p>}
              {saveStatus === "idle" && !lastSavedAt && !lastLocalDraftAt && (
                <p>Unsaved draft</p>
              )}
              {saveStatus === "idle" && !lastSavedAt && lastLocalDraftAt && (
                <p>
                  Draft saved locally
                  {` · ${new Date(lastLocalDraftAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SurveySidebar;
