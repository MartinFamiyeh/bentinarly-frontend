import React, { createContext, useContext, useState } from "react";

export type SaveStatus = "idle" | "draft-local" | "saving" | "saved" | "error";

type SurveyEditingContextType = {
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  lastLocalDraftAt: number | null;
  setStatus: (status: SaveStatus) => void;
  setLastSavedAt: (timestamp: number) => void;
  setLastLocalDraftAt: (timestamp: number) => void;
  /** @deprecated Use saveStatus */
  autoSaveStatus: SaveStatus;
};

const SurveyEditingContext = createContext<SurveyEditingContextType>({
  saveStatus: "idle",
  lastSavedAt: null,
  lastLocalDraftAt: null,
  setStatus: () => {},
  setLastSavedAt: () => {},
  setLastLocalDraftAt: () => {},
  autoSaveStatus: "idle",
});

export const SurveyEditingProvider = ({ children }: { children: React.ReactNode }) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [lastLocalDraftAt, setLastLocalDraftAt] = useState<number | null>(null);

  return (
    <SurveyEditingContext.Provider
      value={{
        saveStatus,
        lastSavedAt,
        lastLocalDraftAt,
        setStatus: setSaveStatus,
        setLastSavedAt,
        setLastLocalDraftAt,
        autoSaveStatus: saveStatus,
      }}>
      {children}
    </SurveyEditingContext.Provider>
  );
};

export const useSurveyEditing = () => useContext(SurveyEditingContext);
