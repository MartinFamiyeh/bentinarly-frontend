export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "short-answer"
  | "long-answer"
  | "rating-scale"
  | "yes-no"
  | "date"
  | "time"
  | "email"
  | "phone"
  | "dropdown"
  | "file-upload"
  | "single-grid"
  | "ranking"
  | "multiple-grid"
  | "slider-scale"
  | "likert-scale";

export interface QuestionOption {
  id: string;
  text: string;
  image?: string;
  isOther?: boolean;
}

export interface RatingScale {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  step?: number;
}

export interface MatrixQuestion {
  rows: string[];
  columns: string[];
}

export interface DateQuestion {
  format: string;
}

export interface FileQuestion {
  maxFiles: number;
  allowedTypes: string[];
  maxSizeMB: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  ratingScale?: RatingScale;
  likertScale?: RatingScale;
  matrix?: MatrixQuestion;
  dateSettings?: DateQuestion;
  timeSettings?: DateQuestion;
  slider?: RatingScale;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  branching?: {
    conditions: BranchingCondition[];
  };
  image?: string;
  order: number;
}

export interface BranchingCondition {
  id: string;
  optionId?: string;
  action: "skip" | "show";
  targetQuestionId?: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: {
    allowAnonymous: boolean;
    collectEmails: boolean;
    shuffleQuestions: boolean;
    oneResponsePerPerson: boolean;
  };
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "closed";
}

// export interface SurveyQuestion {
//   id: string;
//   surveyId: string;
//   type: QuestionType;
//   title: string;
//   description: string | null;
//   isRequired: boolean;
//   order: number;
//   imageUrl: string | null;
//   validation: QuestionValidation | null;
//   branching: BranchingCondition | null;
//   ratingScale: RatingScale | null;
//   matrix: QuestionMatrix | null;
//   options: QuestionOption[];
//   createdAt: string; // ISO date
//   updatedAt: string; // ISO date
// }

