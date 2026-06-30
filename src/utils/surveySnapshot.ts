import type { Survey } from "../types/question";

/** Normalized JSON snapshot for comparing survey state (draft vs server). */
export function createSurveySnapshot(survey: Survey): string {
  const snapshot = {
    id: survey.id,
    title: survey.title?.trim() || "",
    description: survey.description?.trim() || "",
    settings: survey.settings,
    questions: survey.questions
      .filter((q) => q.title?.trim())
      .map((q) => ({
        id: q.id,
        type: q.type,
        title: q.title?.trim() || "",
        description: q.description?.trim() || "",
        required: q.required,
        order: q.order,
        options: (q.options || [])
          .filter((opt) => opt.text?.trim())
          .map((opt) => ({
            id: opt.id,
            text: opt.text?.trim() || "",
          })),
      }))
      .sort((a, b) => a.order - b.order),
  };
  return JSON.stringify(snapshot);
}

export function surveysDiffer(a: Survey, b: Survey): boolean {
  return createSurveySnapshot(a) !== createSurveySnapshot(b);
}
