import type { Question, QuestionType } from "../types/question";
import * as ApiTypes from "../types/api";

/** Question types not yet supported by the backend enum — hidden from the picker. */
export const BACKEND_UNSUPPORTED_QUESTION_TYPES: QuestionType[] = [
  "ranking",
  "multiple-grid",
  "slider-scale",
  "likert-scale",
];

export function isSupportedQuestionType(type: QuestionType): boolean {
  return !BACKEND_UNSUPPORTED_QUESTION_TYPES.includes(type);
}

export function mapQuestionTypeToApi(type: Question["type"]): ApiTypes.QuestionType {
  const mapping: Record<Question["type"], ApiTypes.QuestionType> = {
    "single-choice": 1,
    "multiple-choice": 2,
    "short-answer": 3,
    "long-answer": 4,
    "rating-scale": 5,
    "yes-no": 6,
    "date": 7,
    "time": 8,
    "email": 9,
    "phone": 10,
    "dropdown": 11,
    "file-upload": 12,
    "single-grid": 13,
    // Legacy UI types map to closest supported backend types if encountered in drafts
    ranking: 2,
    "multiple-grid": 13,
    "slider-scale": 5,
    "likert-scale": 5,
  };
  return mapping[type];
}

export function mapApiTypeToQuestionType(apiType: ApiTypes.QuestionType): QuestionType {
  const reverseMapping: Record<ApiTypes.QuestionType, QuestionType> = {
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
    14: "short-answer",
    15: "long-answer",
    16: "rating-scale",
    17: "rating-scale",
  };
  return reverseMapping[apiType];
}

function mapLocalRatingScale(
  scale?: Question["ratingScale"] | Question["likertScale"] | Question["slider"]
): ApiTypes.QuestionRatingScale | undefined {
  if (!scale) return undefined;
  return {
    min: scale.min,
    max: scale.max,
    minLabel: scale.minLabel,
    maxLabel: scale.maxLabel,
    step: scale.step,
  };
}

function mapApiRatingScaleToLocal(
  ratingScale?: ApiTypes.QuestionRatingScale,
  type?: QuestionType
): Partial<Question> {
  if (!ratingScale) return {};
  if (type === "slider-scale") {
    return { slider: { ...ratingScale } };
  }
  if (type === "likert-scale") {
    return { likertScale: { ...ratingScale } };
  }
  return { ratingScale: { ...ratingScale } };
}

function mapLocalMatrix(
  question: Question
): ApiTypes.QuestionMatrix | undefined {
  if (!question.matrix) return undefined;
  const matrixType: ApiTypes.MatrixType =
    question.type === "multiple-grid" ? 2 : 1;
  return {
    rows: question.matrix.rows,
    columns: question.matrix.columns,
    type: matrixType,
  };
}

function mapLocalValidation(
  question: Question
): ApiTypes.QuestionValidation | undefined {
  const validation = question.validation;
  if (!validation || Object.keys(validation).length === 0) {
    if (question.type === "file-upload" && question.fileSettings) {
      return {
        maxValue: question.fileSettings.maxSizeMB,
      };
    }
    return undefined;
  }
  return {
    minLength: validation.minLength,
    maxLength: validation.maxLength,
    pattern: validation.pattern,
  };
}

export function mapLocalQuestionToApiPayload(
  question: Question
): Pick<
  ApiTypes.CreateQuestionDto,
  | "type"
  | "title"
  | "description"
  | "isRequired"
  | "order"
  | "options"
  | "validation"
  | "ratingScale"
  | "matrix"
> {
  const validOptions = question.options?.filter((opt) => opt.text?.trim()) || [];
  const ratingScale =
    mapLocalRatingScale(question.ratingScale) ??
    mapLocalRatingScale(question.likertScale) ??
    mapLocalRatingScale(question.slider);

  return {
    type: mapQuestionTypeToApi(question.type),
    title: question.title.trim(),
    description: question.description,
    isRequired: question.required,
    order: question.order,
    options: validOptions.map((opt, optIndex) => ({
      text: opt.text.trim(),
      order: optIndex,
    })),
    validation: mapLocalValidation(question),
    ratingScale,
    matrix: mapLocalMatrix(question),
  };
}

export function mapApiQuestionToLocal(
  q: ApiTypes.QuestionDto,
  index: number
): Question {
  const type = mapApiTypeToQuestionType(q.type);
  const ratingFields = mapApiRatingScaleToLocal(q.ratingScale, type);

  return {
    id: q.id,
    type,
    title: q.title || "",
    description: q.description || "",
    required: q.isRequired,
    order: q.order || index + 1,
    options:
      q.options
        ?.sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((opt) => ({
          id: opt.id,
          text: opt.text || "",
        })) || [],
    validation: q.validation
      ? {
          minLength: q.validation.minLength,
          maxLength: q.validation.maxLength,
          pattern: q.validation.pattern,
        }
      : undefined,
    matrix: q.matrix
      ? {
          rows: q.matrix.rows || [],
          columns: q.matrix.columns || [],
        }
      : undefined,
    ...ratingFields,
  };
}

export function mapApiQuestionsToLocal(questions: ApiTypes.QuestionDto[]): Question[] {
  return [...questions]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((q, index) => mapApiQuestionToLocal(q, index));
}
