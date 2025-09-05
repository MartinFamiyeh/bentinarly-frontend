import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useMatch } from "react-router-dom";
import { createPortal } from "react-dom";
import { FiPlus } from "react-icons/fi";

import Expand from "../../assets/icons/expand.png";
import Minimize from "../../assets/icons/minimize.png";
import PlusLight from "../../assets/icons/plus-light.png";
import Project from "../../assets/icons/folder.png";
import ProjectActive from "../../assets/icons/folder-active.png";
import Analytics from "../../assets/icons/analytics.png";
import AnalyticsActive from "../../assets/icons/analytics-active.png";
import Templates from "../../assets/icons/templates.png";
import TemplatesActive from "../../assets/icons/templates-active.png";
import Refresh from "../../assets/icons/refresh.png";
import HelpActive from "../../assets/icons/help-active.png";
import Help from "../../assets/icons/help.png";
import Arrow from "../../assets/icons/chevron-down.png";
import Menu from "../../assets/icons/menu.png";

import Accounts from "../../assets/icons/accounts.png";
import Bell from "../../assets/icons/bell.png";
import Lock from "../../assets/icons/lock.png";
import Edit from "../../assets/icons/edit.png";
import Moon from "../../assets/icons/dark-moon.png";
import Plus from "../../assets/icons/plus-dark.png";
import Manage from "../../assets/icons/manage-account.png";
import Logout from "../../assets/icons/logout.png";
import ArrowRight from "../../assets/icons/arrow-right.png";

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

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const Sidebar = ({ isMinimized, toggle }: SidebarProps) => {
  const [isProjectsOpen, setProjectsOpen] = useState(true);
  const [isHelpMenuOpen, setHelpMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [openProjectMenu, setOpenProjectMenu] = useState<number | null>(null);

  const [helpMenuPos, setHelpMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [userMenuPos, setUserMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [projectMenuPos, setProjectMenuPos] = useState<{
    [key: number]: { top: number; left: number } | null;
  }>({});

  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks: NavLinkItem[] = [
    { to: "/projects", activeIcon: ProjectActive, inactiveIcon: Project, text: "Projects" },
    { to: "/analytics", activeIcon: AnalyticsActive, inactiveIcon: Analytics, text: "Analytics" },
    { to: "/templates", activeIcon: TemplatesActive, inactiveIcon: Templates, text: "Templates" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpButtonRef.current &&
        !helpButtonRef.current.contains(event.target as Node) &&
        isHelpMenuOpen
      ) {
        setHelpMenuOpen(false);
      }
      if (
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node) &&
        isUserMenuOpen
      ) {
        setUserMenuOpen(false);
      }
      setOpenProjectMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isHelpMenuOpen, isUserMenuOpen]);

  const handleSubMenuClick = (
    e: React.MouseEvent,
    projectId: number,
    button: HTMLButtonElement
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = button.getBoundingClientRect();
    setProjectMenuPos((prev) => ({
      ...prev,
      [projectId]: { top: rect.bottom + 4, left: rect.left },
    }));

    setOpenProjectMenu(openProjectMenu === projectId ? null : projectId);
  };

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

  const toggleUserMenu = () => {
    if (userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setUserMenuPos({
        top: rect.top - 280,
        left: rect.right + 25,
      });
    }
    setUserMenuOpen(!isUserMenuOpen);
  };

  const HelpDropdownMenu = () =>
    isHelpMenuOpen &&
    helpMenuPos && (
      <Portal>
        <div
          style={{ position: "fixed", top: helpMenuPos.top, left: helpMenuPos.left }}
          className="w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-[9999]">
          <div className="py-4">
            <div className="px-4 text-xs mb-1 text-[#292929]">
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
                className="flex items-center px-4 py-2 text-sm text-[#6B7280] hover:bg-[#FFF5F0]">
                {q}
              </a>
            ))}
          </div>
        </div>
      </Portal>
    );

  const UserDropdownMenu = () =>
    isUserMenuOpen &&
    userMenuPos && (
      <Portal>
        <div
          style={{ position: "fixed", top: userMenuPos.top, left: userMenuPos.left }}
          className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
          <div className="">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/40" alt="User" className="w-8 h-8 rounded-lg" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Jennifer Clomin</p>
                  <p className="text-xs text-gray-500">jennifer.clomin@email.com</p>
                </div>
              </div>
            </div>
            <div className="py-2">
              {[
                { title: "Accounts", icon: Accounts, hasBorder: false },
                { title: "Edit profile", icon: Edit, hasBorder: true },
                { title: "Change Password", icon: Lock, hasBorder: true },
                { title: "Notifications", icon: Bell, hasBorder: false },
                { title: "Dark Mode", icon: Moon, hasBorder: true },
              ].map((item, i) => (
                <div className={`flex items-center justify-between hover:bg-gray-100 py-2 px-4`}>
                  <div className="flex gap-3 items-center">
                    <img src={item.icon} alt="" className="w-5 h-5" />
                    <a key={i} href="#" className="flex items-center text-sm text-[#696969]">
                      {item.title}
                    </a>
                  </div>
                  <img src={ArrowRight} alt="" className="w-4 h-4" />
                </div>
              ))}

              <hr className="my-2" />
              <div className={`flex items-center justify-between hover:bg-gray-100 py-2 px-4`}>
                <div className="flex gap-3 items-center">
                  <img src={Logout} alt="" className="w-5 h-5" />
                  <a
                    href="#"
                    className="flex items-center text-sm text-red-600">
                    Logout Account
                  </a>
                </div>
                <img src={ArrowRight} alt="" className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Portal>
    );

  const ProjectDropdownMenu = ({ projectId }: { projectId: number }) =>
    openProjectMenu === projectId &&
    projectMenuPos[projectId] && (
      <Portal>
        <div
          style={{
            position: "fixed",
            top: projectMenuPos[projectId]!.top,
            left: projectMenuPos[projectId]!.left,
          }}
          className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
          <div className="py-1">
            {["Rename", "Delete"].map((action, i) => (
              <button
                key={i}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {action}
              </button>
            ))}
          </div>
        </div>
      </Portal>
    );

  return (
    <aside
      className={`fixed top-0 left-0 h-full rounded-r-xl bg-white shadow-sm flex flex-col transition-all duration-300 ease-in-out z-40 overflow-visible ${
        isMinimized ? "w-20" : "w-64"
      }`}>
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

      <div className="flex flex-col flex-grow px-4 overflow-y-auto">
        <button className="btn bg-gradient-to-r from-[#FE5102] to-[#B148F3] mb-4 mx-auto border-none">
          <img src={PlusLight} className={isMinimized ? "" : "hidden"} />
          <span className={isMinimized ? "hidden" : "inline"}>Create Survey</span>
        </button>

        <nav className="flex-grow">
          <ul>
            {navLinks.map((item) => {
              const isProjectsActive = useMatch("/projects/*");
              if (item.text === "Projects") {
                return (
                  <li key={item.to} className="relative group">
                    <div
                      className={`flex items-center mb-4 p-2 rounded-md transition-colors w-full ${
                        isProjectsActive ? "bg-[#FFF5F0]" : "hover:bg-gray-100"
                      } ${isMinimized ? "justify-center" : "justify-between"}`}>
                      <NavLink
                        to={item.to}
                        end
                        className={`flex items-center gap-3 text-sm ${
                          isProjectsActive ? "text-[#FE5102] font-semibold" : "text-gray-600"
                        }`}>
                        <img
                          src={isProjectsActive ? item.activeIcon : item.inactiveIcon}
                          className="w-5 h-5"
                        />
                        {!isMinimized && item.text}
                      </NavLink>
                      {!isMinimized && (
                        <button
                          onClick={() => setProjectsOpen(!isProjectsOpen)}
                          className="p-1 rounded-md hover:bg-gray-200">
                          <img src={Arrow} className={isProjectsOpen ? "-rotate-180" : ""} />
                        </button>
                      )}
                    </div>

                    {!isMinimized && isProjectsOpen && (
                      <ul className="mt-1">
                        {[1, 2].map((id) => (
                          <li key={id}>
                            <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-100 relative">
                              <NavLink
                                to={`/projects/${id}`}
                                className={({ isActive }) =>
                                  isActive
                                    ? "text-[#FE5102] font-medium"
                                    : "text-gray-400 hover:text-gray-800"
                                }>
                                Project {id}
                              </NavLink>
                              <button
                                onClick={(e) =>
                                  handleSubMenuClick(e, id, e.currentTarget as HTMLButtonElement)
                                }
                                className="text-gray-400 hover:text-gray-700">
                                <img src={Menu} />
                              </button>
                              <ProjectDropdownMenu projectId={id} />
                            </div>
                          </li>
                        ))}
                        <li className="mt-1">
                          <button className="flex items-center gap-1 text-xs text-gray-800 p-2 w-full hover:bg-gray-100 rounded-md">
                            <FiPlus /> Add project
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.to} className="relative group mb-4">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 text-sm rounded-md ${
                        isActive
                          ? "bg-[#FFF5F0] text-[#FE5102] font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      } ${isMinimized ? "justify-center" : ""}`
                    }>
                    {({ isActive }) => (
                      <>
                        <img
                          src={isActive ? item.activeIcon : item.inactiveIcon}
                          className="w-5 h-5"
                        />
                        {!isMinimized && item.text}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          to="#"
          className={`flex items-center gap-3 p-2 my-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 ${
            isMinimized ? "justify-center" : ""
          }`}>
          <img src={Refresh} className="w-5 h-5" />
          {!isMinimized && "Refresh"}
        </Link>

        <button
          ref={helpButtonRef}
          onClick={toggleHelpMenu}
          className={`flex items-center gap-3 p-2 my-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 ${
            isMinimized ? "justify-center" : "justify-between"
          }`}>
          <div className="flex items-center gap-2">
            <img src={isHelpMenuOpen ? HelpActive : Help} className="w-5 h-5" />
            {!isMinimized && "Help Center"}
          </div>

          {!isMinimized && (
            <img src={Arrow} className={isHelpMenuOpen ? "-rotate-90" : "-rotate-90"} />
          )}
        </button>
        <HelpDropdownMenu />
      </div>

      <div className="px-5 py-4 border-t border-[#E5E7EB]">
        <button
          ref={userButtonRef}
          onClick={toggleUserMenu}
          className="flex items-center gap-2 w-full">
          <img src="https://i.pravatar.cc/40" className="w-10 h-10 rounded-lg" />
          {!isMinimized && (
            <>
              <div className="flex flex-col text-left">
                <p className="font-semibold text-sm">Jennifer Clomin</p>
                <p className="text-xs text-gray-500">jennifer.clom@email.com</p>
              </div>
              <img src={Arrow} className={isUserMenuOpen ? "-rotate-90" : ""} />
            </>
          )}
        </button>
        <UserDropdownMenu />
      </div>
    </aside>
  );
};

export default Sidebar;
