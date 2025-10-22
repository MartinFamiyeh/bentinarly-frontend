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

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  ratingScale?: RatingScale;
  matrix?: MatrixQuestion;
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
