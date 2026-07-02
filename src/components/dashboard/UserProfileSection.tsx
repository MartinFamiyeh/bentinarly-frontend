import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Accounts from "../../assets/icons/accounts.svg";
import Edit from "../../assets/icons/edit.svg";
import { ChevronRight } from "lucide-react";
import Lock from "../../assets/icons/change_pass.svg";
import Bell from "../../assets/icons/notifications.svg";
import Moon from "../../assets/icons/dark_moon.svg";
import Logout from "../../assets/icons/logout.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useResearcherOnboardingOptional } from "../../contexts/ResearcherOnboardingContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { isParticipantRole } from "../../utils/userRoleUtils";

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

interface UserProfileSectionProps {
  isMinimized: boolean;
}

const userAccounts = [
  {
    id: 1,
    name: "Jennifer Clomin",
    email: "jennifer.clom@email.com",
    avatar: "https://i.pravatar.cc/40?img=1",
    isActive: true,
  },
  {
    id: 2,
    name: "Jennifer Clomin",
    email: "jennifer.clomin@email.com",
    avatar: "https://i.pravatar.cc/40?img=2",
    isActive: false,
  },
];

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ isMinimized }) => {
  const { user, signout } = useAuth();
  const researcherOnboarding = useResearcherOnboardingOptional();
  const isOnboardingComplete = researcherOnboarding?.isComplete ?? true;
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const isParticipant = isParticipantRole(user?.role);
  const profilePath = isParticipant ? "/surveys/profile" : "/projects/profile";
  const profileLabel = isParticipant ? "Edit Profile" : isOnboardingComplete ? "Profile" : "Complete profile";
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [userMenuPos, setUserMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null); 
  const accountsModalRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOutsideButton =
        userButtonRef.current !== null && !userButtonRef.current.contains(target);
      const clickedOutsideDropdown =
        userDropdownRef.current === null || !userDropdownRef.current.contains(target);
      const clickedOutsideAccounts =
        !showAccountsModal ||
        (accountsModalRef.current !== null && !accountsModalRef.current.contains(target));

      if (
        isUserMenuOpen &&
        clickedOutsideButton &&
        clickedOutsideDropdown &&
        clickedOutsideAccounts
      ) {
        setUserMenuOpen(false);
        setShowAccountsModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen, showAccountsModal]);

  const toggleUserMenu = () => {
    if (userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setUserMenuPos({
        top: rect.top - 270,
        left: rect.right + 35,
      });
    }
    setUserMenuOpen(!isUserMenuOpen);
    setShowAccountsModal(false); 
  };

  const handleAccountsClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    setShowAccountsModal(!showAccountsModal); 
  };

  const handleDropdownClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const UserDropdownMenu = () =>
    isUserMenuOpen &&
    userMenuPos && (
      <Portal>
        <div
          ref={userDropdownRef}
          onClick={handleDropdownClick}
          style={{ position: "fixed", top: userMenuPos.top, left: userMenuPos.left }}
          className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999]">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img 
                src={user?.profileImageUrl || "https://i.pravatar.cc/40?img=1"} 
                alt="User" 
                className="w-8 h-8 rounded-lg" 
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
              </div>
            </div>
          </div>

          <div className="py-2 space-y-1">
            <div
              onClick={handleAccountsClick}
              className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 cursor-pointer">
              <div className="flex gap-3 items-center">
                <Accounts />
                <span className="text-sm text-[#696969] dark:text-gray-400">Accounts</span>
              </div>
              <ChevronRight size={13} />
            </div>

            {/* Profile */}
            <div 
              onClick={() => {
                navigate(profilePath);
                setUserMenuOpen(false);
              }}
              className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 cursor-pointer border-b border-gray-100 dark:border-gray-700">
              <div className="flex gap-3 items-center">
                <Edit />
                <span className="text-sm text-[#696969] dark:text-gray-400 flex items-center gap-2">
                  {profileLabel}
                  {!isParticipant && !isOnboardingComplete && (
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                  )}
                </span>
              </div>
              <ChevronRight size={13} />
            </div>

            {/* Change Password */}
            <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 cursor-pointer border-b border-gray-100 dark:border-gray-700">
              <div className="flex gap-3 items-center">
                <Lock />
                <span className="text-sm text-[#696969] dark:text-gray-400">Change Password</span>
              </div>
              <ChevronRight size={13} />
            </div>

            {/* Notifications with Toggle */}
            <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4">
              <div className="flex gap-3 items-center">
                <Bell />
                <span className="text-sm text-[#696969] dark:text-gray-400">Notifications</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsEnabled(!notificationsEnabled);
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  notificationsEnabled ? "bg-orange-500" : "bg-gray-300"
                }`}>
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode with Toggle */}
            <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex gap-3 items-center">
                <Moon />
                <span className="text-sm text-[#696969] dark:text-gray-400">Dark Mode</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDarkMode();
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-300"
                }`}>
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Logout */}
            <div 
              onClick={async () => {
                try {
                  await signout();
                  showSnackbar("Logged out successfully", "success");
                  navigate("/login");
                } catch (error) {
                  showSnackbar("Failed to logout", "error");
                }
                setUserMenuOpen(false);
              }}
              className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 cursor-pointer">
              <div className="flex gap-3 items-center">
                <Logout />
                <span className="text-sm text-red-600">Logout Account</span>
              </div>
              <ChevronRight size={13} />
            </div>
          </div>
        </div>

        {/* Switch Accounts Modal */}
        {showAccountsModal && (
          <div
            ref={accountsModalRef}
            onClick={handleDropdownClick}
            style={{
              position: "fixed",
              top: userMenuPos.top,
              left: userMenuPos.left + 240,
            }}
            className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[10000]">
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Switch Account</p>

              {userAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer mb-2">
                  <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-lg" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                </div>
              ))}

              <hr className="my-3 border-gray-200 dark:border-gray-700" />

              <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Accounts
              </button>

              <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Manage accounts
              </button>
            </div>
          </div>
        )}
      </Portal>
    );

  return (
    <div className="px-5 py-4 border-t border-[#E5E7EB] dark:border-gray-700">
      <button
        ref={userButtonRef}
        onClick={toggleUserMenu}
        className="flex items-center gap-2 w-full">
        <img 
          src={user?.profileImageUrl || "https://i.pravatar.cc/40?img=1"} 
          className="w-10 h-10 rounded-lg" 
          alt="User" 
        />
        {!isMinimized && (
          <>
            <div className="flex flex-col text-left">
              <p className="font-semibold text-sm dark:text-gray-100">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email || "User"}
              </p>
              <p className="text-xs text-gray-500">{user?.email || ""}</p>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isUserMenuOpen ? "-rotate-90" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </>
        )}
      </button>
      <UserDropdownMenu />
    </div>
  );
};

export default UserProfileSection;
