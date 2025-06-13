import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { HiMenu, HiX } from "react-icons/hi";

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    toggleDarkMode();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/about', label: 'About Us' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/contact', label: 'Contact Us' },
  ];
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-[#0B0B0B] shadow-sm z-50 mt-2 rounded-full border-2 border-gray-100 dark:border-[#232323] w-[90%] mx-auto px-4">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/src/assets/icons/logo.svg" 
              alt="Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-white font-sofia">Bentinarly Poll</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-regular transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-[#FE5102] dark:text-[#FE5102] font-semibold'
                    : 'text-gray-600 hover:text-[#FE5102] dark:text-gray-300 dark:hover:text-[#FE5102]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <IconButton 
              color="inherit" 
              onClick={handleThemeToggle}
              className="text-gray-600 dark:text-gray-300 hover:text-[#FE5102] dark:hover:text-[#FE5102]"
            >
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <button className="hidden lg:block bg-[#FE5102] text-white dark:text-black px-6 py-2 rounded-full font-medium hover:opacity-90 transition-all">
              Login
            </button>
            {/* Hamburger Menu Button */}
            <button 
              className="lg:hidden text-[#FE5102] hover:opacity-80 transition-all"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-[#0B0B0B] shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-end">
                <button 
                  onClick={toggleMenu}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#FE5102] dark:hover:text-[#FE5102]"
                >
                  <HiX size={24} />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className={`text-base font-regular transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-[#FE5102] dark:text-[#FE5102] font-semibold'
                        : 'text-gray-600 hover:text-[#FE5102] dark:text-gray-300 dark:hover:text-[#FE5102]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button 
                  onClick={toggleMenu}
                  className="mt-4 w-full bg-[#FE5102] text-white dark:text-black px-6 py-2 rounded-full font-medium hover:opacity-90 transition-all"
                >
                  Login
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
