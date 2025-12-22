import React, { createContext, useContext, useState } from "react";

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

type SurveyEditingContextType = {
  autoSaveStatus: AutoSaveStatus;
  lastSavedAt: number | null;
  setStatus: (status: AutoSaveStatus) => void;
  setLastSavedAt: (timestamp: number) => void;
};

const SurveyEditingContext = createContext<SurveyEditingContextType>({
  autoSaveStatus: "idle",
  lastSavedAt: null,
  setStatus: () => {},
  setLastSavedAt: () => {},
});

export const SurveyEditingProvider = ({ children }: { children: React.ReactNode }) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  return (
    <SurveyEditingContext.Provider
      value={{
        autoSaveStatus,
        lastSavedAt,
        setStatus: setAutoSaveStatus,
        setLastSavedAt,
      }}>
      {children}
    </SurveyEditingContext.Provider>
  );
};

export const useSurveyEditing = () => useContext(SurveyEditingContext);


