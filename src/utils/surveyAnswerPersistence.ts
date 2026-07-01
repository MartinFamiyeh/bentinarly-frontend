import type { AnswerValue } from "./mapSurveyAnswersToSubmission";

const STORAGE_PREFIX = "bentinarly-survey-answers";

function storageKey(surveyId: string): string {
  return `${STORAGE_PREFIX}:${surveyId}`;
}

export function loadPersistedAnswers(surveyId: string): Record<string, AnswerValue> | null {
  try {
    const raw = localStorage.getItem(storageKey(surveyId));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Record<string, AnswerValue>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function persistAnswers(surveyId: string, answers: Record<string, AnswerValue>): void {
  try {
    localStorage.setItem(storageKey(surveyId), JSON.stringify(answers));
  } catch {
    // Ignore quota errors
  }
}

export function clearPersistedAnswers(surveyId: string): void {
  try {
    localStorage.removeItem(storageKey(surveyId));
  } catch {
    // Ignore
  }
}
