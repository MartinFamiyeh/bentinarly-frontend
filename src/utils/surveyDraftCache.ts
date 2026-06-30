import type { Survey } from "../types/question";

export interface SurveyDraftEntry {
  survey: Survey;
  savedAt: number;
  serverUpdatedAt?: string;
  serverSnapshot?: string;
}

const DRAFT_KEY_PREFIX = "surveyDraft_";

export function getDraftKey(surveyId: string): string {
  return `${DRAFT_KEY_PREFIX}${surveyId}`;
}

export function saveDraft(
  surveyId: string,
  survey: Survey,
  options?: { serverUpdatedAt?: string; serverSnapshot?: string }
): void {
  try {
    const entry: SurveyDraftEntry = {
      survey,
      savedAt: Date.now(),
      serverUpdatedAt: options?.serverUpdatedAt,
      serverSnapshot: options?.serverSnapshot,
    };
    localStorage.setItem(getDraftKey(surveyId), JSON.stringify(entry));
  } catch {
    // Ignore quota / private mode errors
  }
}

export function loadDraft(surveyId: string): SurveyDraftEntry | null {
  try {
    const raw = localStorage.getItem(getDraftKey(surveyId));
    if (!raw) {
      return null;
    }
    const entry = JSON.parse(raw) as SurveyDraftEntry;
    if (!entry?.survey || typeof entry.savedAt !== "number") {
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

export function clearDraft(surveyId: string): void {
  try {
    localStorage.removeItem(getDraftKey(surveyId));
  } catch {
    // Ignore localStorage errors
  }
}

/** Remove draft for "new" and any real survey id after first save. */
export function clearDraftsForSurvey(savedSurveyId: string, previousSurveyId?: string): void {
  clearDraft(savedSurveyId);
  if (previousSurveyId && previousSurveyId !== savedSurveyId) {
    clearDraft(previousSurveyId);
  }
}
