import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Accounts from "../../assets/icons/accounts.png";
import Bell from "../../assets/icons/bell.png";
import Lock from "../../assets/icons/lock.png";
import Edit from "../../assets/icons/edit.png";
import Moon from "../../assets/icons/dark-moon.png";
import Logout from "../../assets/icons/logout.png";
import ArrowRight from "../../assets/icons/arrow-right.png";
import Arrow from "../../assets/icons/chevron-down.png";

interface UserProfileSectionProps {
  isMinimized: boolean;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ isMinimized }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuPos, setUserMenuPos] = useState<{ top: number; left: number } | null>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node) &&
        isUserMenuOpen
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

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
                <div
                  key={i}
                  className={`flex items-center justify-between hover:bg-gray-100 py-2 px-4`}>
                  <div className="flex gap-3 items-center">
                    <img src={item.icon} alt="" className="w-5 h-5" />
                    <a href="#" className="flex items-center text-sm text-[#696969]">
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
                  <a href="#" className="flex items-center text-sm text-red-600">
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

  return (
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
  );
};

export default UserProfileSection;
