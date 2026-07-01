import type { SurveyDto } from "../types/api";

export type ParticipantSurveyStatus = "Available" | "In Progress" | "Paused" | "Completed";

export function getParticipantStatus(survey: SurveyDto): ParticipantSurveyStatus {
  if (survey.status === 3 || survey.status === 4) return "Completed";
  if (survey.status === 5) return "Paused";
  return "Available";
}

export function estimateSurveyDuration(questionCount: number): string {
  const minutes = Math.max(5, questionCount || 5);
  return `${minutes}mins`;
}

export function getSurveyActionLabel(status: ParticipantSurveyStatus): string | null {
  if (status === "Completed") return null;
  if (status === "In Progress") return "Continue";
  return "Take Survey";
}
