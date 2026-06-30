import { useCallback, useEffect, useRef, useState } from "react";
import type { Survey } from "../types/question";
import {
  clearDraft,
  loadDraft,
  saveDraft,
  type SurveyDraftEntry,
} from "../utils/surveyDraftCache";
import { createSurveySnapshot } from "../utils/surveySnapshot";
import { useSurveyEditing } from "../contexts/SurveyEditingContext";

const DRAFT_DEBOUNCE_MS = 500;

interface UseSurveyDraftOptions {
  survey: Survey;
  draftKey: string;
  lastSavedSurvey: string | null;
  isSurveyLoaded: boolean;
  enabled: boolean;
}

export function useSurveyDraft({
  survey,
  draftKey,
  lastSavedSurvey,
  isSurveyLoaded,
  enabled,
}: UseSurveyDraftOptions) {
  const { setStatus, setLastLocalDraftAt } = useSurveyEditing();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextWriteRef = useRef(false);
  const [pendingRestore, setPendingRestore] = useState<SurveyDraftEntry | null>(null);

  const currentSnapshot = createSurveySnapshot(survey);

  const surveyHasUnsavedContent =
    Boolean(survey.title?.trim() && survey.title.trim() !== "New Survey") ||
    survey.questions.some((q) => q.title?.trim()) ||
    Boolean(survey.description?.trim());

  const hasUnsavedServerChanges =
    enabled &&
    isSurveyLoaded &&
    (lastSavedSurvey === null
      ? surveyHasUnsavedContent
      : currentSnapshot !== lastSavedSurvey);

  const writeDraftNow = useCallback(
    (surveyToSave: Survey, serverSnapshot?: string | null) => {
      if (!enabled) {
        return;
      }
      saveDraft(draftKey, surveyToSave, {
        serverSnapshot: serverSnapshot ?? lastSavedSurvey ?? undefined,
      });
      setLastLocalDraftAt(Date.now());
      const draftSnapshot = createSurveySnapshot(surveyToSave);
      const isDirty =
        lastSavedSurvey === null
          ? Boolean(
              surveyToSave.title?.trim() &&
                surveyToSave.title.trim() !== "New Survey"
            ) ||
            surveyToSave.questions.some((q) => q.title?.trim()) ||
            Boolean(surveyToSave.description?.trim())
          : draftSnapshot !== lastSavedSurvey;
      if (isDirty) {
        setStatus("draft-local");
      }
    },
    [draftKey, enabled, lastSavedSurvey, setLastLocalDraftAt, setStatus]
  );

  const discardDraft = useCallback(() => {
    clearDraft(draftKey);
    setPendingRestore(null);
  }, [draftKey]);

  const restoreDraft = useCallback((): Survey | null => {
    const entry = pendingRestore ?? loadDraft(draftKey);
    if (!entry) {
      return null;
    }
    skipNextWriteRef.current = true;
    setPendingRestore(null);
    setStatus("draft-local");
    setLastLocalDraftAt(entry.savedAt);
    return entry.survey;
  }, [draftKey, pendingRestore, setLastLocalDraftAt, setStatus]);

  const offerDraftRestore = useCallback(
    (serverSurvey: Survey, serverSnapshot: string) => {
      const entry = loadDraft(draftKey);
      if (!entry) {
        return;
      }
      const draftSnapshot = createSurveySnapshot(entry.survey);
      if (draftSnapshot === serverSnapshot) {
        clearDraft(draftKey);
        return;
      }
      setPendingRestore(entry);
    },
    [draftKey]
  );

  const offerDraftRestoreForNew = useCallback((currentSurvey: Survey) => {
    const entry = loadDraft("new");
    if (!entry) {
      return;
    }
    if (createSurveySnapshot(entry.survey) === createSurveySnapshot(currentSurvey)) {
      clearDraft("new");
      return;
    }
    setPendingRestore(entry);
  }, []);

  const clearDraftForSurvey = useCallback(
    (savedSurveyId: string, previousSurveyId?: string) => {
      clearDraft(savedSurveyId);
      if (previousSurveyId && previousSurveyId !== savedSurveyId) {
        clearDraft(previousSurveyId);
      }
      setPendingRestore(null);
    },
    []
  );

  useEffect(() => {
    if (!enabled || !isSurveyLoaded) {
      return;
    }

    if (skipNextWriteRef.current) {
      skipNextWriteRef.current = false;
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      writeDraftNow(survey, lastSavedSurvey);
    }, DRAFT_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [survey, enabled, isSurveyLoaded, writeDraftNow, lastSavedSurvey]);

  useEffect(() => {
    if (!enabled || !isSurveyLoaded) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isDirty =
        lastSavedSurvey === null
          ? surveyHasUnsavedContent
          : currentSnapshot !== lastSavedSurvey;
      if (!isDirty) {
        return;
      }
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, isSurveyLoaded, lastSavedSurvey, currentSnapshot, surveyHasUnsavedContent]);

  return {
    pendingRestore,
    hasUnsavedServerChanges,
    offerDraftRestore,
    offerDraftRestoreForNew,
    restoreDraft,
    discardDraft,
    clearDraftForSurvey,
    writeDraftNow,
  };
}
