import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useLoading } from "../../contexts/LoadingContext";
import Logo from "../../assets/icons/logo.svg";
import { Switch, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { showSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();

  const handleThemeToggle = async () => {
    showLoading();
    toggleDarkMode();
    // Simulate some loading time
    await new Promise((resolve) => setTimeout(resolve, 1000));
    hideLoading();
    showSnackbar(`Switched to ${isDarkMode ? "light" : "dark"} mode`, "info");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bentinarly Poll</h1>
        </div>
        <div className="flex items-center gap-2">
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Switch checked={isDarkMode} onChange={handleThemeToggle} color="primary" />
        </div>
      </div>
    </header>
  );
};

export default Header;
