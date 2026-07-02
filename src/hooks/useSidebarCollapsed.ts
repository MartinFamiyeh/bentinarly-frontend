import { useCallback, useState } from "react";

const STORAGE_KEY = "bentinarly:sidebar-minimized";

function readCollapsedState(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeCollapsedState(isMinimized: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(isMinimized));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.)
  }
}

export function useSidebarCollapsed() {
  const [isMinimized, setIsMinimized] = useState(readCollapsedState);

  const toggleSidebar = useCallback(() => {
    setIsMinimized((prev) => {
      const next = !prev;
      writeCollapsedState(next);
      return next;
    });
  }, []);

  return { isMinimized, toggleSidebar };
}
