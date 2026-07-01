import type { QuestionDto, QuestionType as ApiQuestionType, SurveySection } from "../types/api";
import type { Question, QuestionType } from "../types/question";

export type { SurveySection };

function isOtherOption(text?: string): boolean {
  return /^other$/i.test(text?.trim() || "");
}

const API_TO_UI_TYPE: Record<ApiQuestionType, QuestionType> = {
  1: "single-choice",
  2: "multiple-choice",
  3: "short-answer",
  4: "long-answer",
  5: "rating-scale",
  6: "yes-no",
  7: "date",
  8: "time",
  9: "email",
  10: "phone",
  11: "dropdown",
  12: "file-upload",
  13: "single-grid",
  14: "ranking",
  15: "multiple-grid",
  16: "slider-scale",
  17: "likert-scale",
};

export function mapApiQuestionType(type: ApiQuestionType): QuestionType {
  return API_TO_UI_TYPE[type];
}

export function mapApiQuestionToLocal(question: QuestionDto): Question {
  const type = mapApiQuestionType(question.type);

  return {
    id: question.id,
    type,
    title: question.title || "",
    description: question.description,
    required: question.isRequired,
    order: question.order,
    image: question.imageUrl,
    validation: question.validation
      ? {
          minLength: question.validation.minLength,
          maxLength: question.validation.maxLength,
          pattern: question.validation.pattern,
        }
      : undefined,
    options:
      question.options
        ?.sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((opt) => ({
          id: opt.id,
          text: opt.text || "",
          image: opt.imageUrl,
          isOther: opt.isOther ?? isOtherOption(opt.text),
        })) || [],
    ratingScale: question.ratingScale
      ? {
          min: question.ratingScale.min,
          max: question.ratingScale.max,
          minLabel: question.ratingScale.minLabel,
          maxLabel: question.ratingScale.maxLabel,
          step: question.ratingScale.step,
        }
      : undefined,
    likertScale:
      type === "likert-scale" && question.ratingScale
        ? {
            min: question.ratingScale.min,
            max: question.ratingScale.max,
            minLabel: question.ratingScale.minLabel,
            maxLabel: question.ratingScale.maxLabel,
            step: question.ratingScale.step,
          }
        : type === "likert-scale"
          ? { min: 0, max: 10, step: 1 }
          : undefined,
    slider:
      type === "slider-scale" && question.ratingScale
        ? {
            min: question.ratingScale.min,
            max: question.ratingScale.max,
            minLabel: question.ratingScale.minLabel,
            maxLabel: question.ratingScale.maxLabel,
            step: question.ratingScale.step ?? 1,
          }
        : type === "slider-scale"
          ? { min: 0, max: 10, step: 1 }
          : undefined,
    matrix: question.matrix?.rows
      ? {
          rows: question.matrix.rows,
          columns: question.matrix.columns || [],
        }
      : undefined,
    dateSettings: type === "date" ? { format: "YYYY-MM-DD" } : undefined,
    timeSettings: type === "time" ? { format: "HH:mm" } : undefined,
    fileSettings:
      type === "file-upload"
        ? {
            maxFiles: 1,
            allowedTypes: ["image/*", "application/pdf"],
            maxSizeMB: 10,
          }
        : undefined,
  };
}

export function mapApiQuestionsToLocal(questions: QuestionDto[]): Question[] {
  return [...questions]
    .sort((a, b) => a.order - b.order)
    .map(mapApiQuestionToLocal);
}

export interface SurveyPage {
  section?: SurveySection;
  questions: Question[];
}

export function buildSurveyPages(
  questions: Question[],
  sections?: SurveySection[]
): SurveyPage[] {
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  if (!sections || sections.length === 0) {
    return sorted.length > 0 ? [{ questions: sorted }] : [];
  }

  const pages: SurveyPage[] = [];
  const assignedIds = new Set<string>();

  for (const section of sections) {
    const sectionQuestions = section.questionIds
      .map((id) => sorted.find((q) => q.id === id))
      .filter((q): q is Question => Boolean(q));

    sectionQuestions.forEach((q) => assignedIds.add(q.id));

    if (sectionQuestions.length > 0) {
      pages.push({ section, questions: sectionQuestions });
    }
  }

  const unassigned = sorted.filter((q) => !assignedIds.has(q.id));
  if (unassigned.length > 0) {
    pages.push({ questions: unassigned });
  }

  return pages.length > 0 ? pages : sorted.length > 0 ? [{ questions: sorted }] : [];
}

export function hasSurveySections(sections?: SurveySection[]): boolean {
  return Boolean(sections && sections.length > 0);
}

export function getGlobalQuestionNumber(
  pages: SurveyPage[],
  pageIndex: number,
  questionIndex: number
): number {
  let number = 0;
  for (let p = 0; p <= pageIndex; p++) {
    const page = pages[p];
    if (p < pageIndex) {
      number += page.questions.length;
    } else {
      number += questionIndex + 1;
    }
  }
  return number;
}
