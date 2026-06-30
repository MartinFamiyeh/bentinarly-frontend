import type { QuestionType } from "../types/question";

// Import SVG icons
import SingleChoiceIcon from "../assets/icons/single_choice.svg";
import MultipleChoiceIcon from "../assets/icons/multiple_choice.svg";
import ShortAnswerIcon from "../assets/icons/short_answer.svg";
import LongAnswerIcon from "../assets/icons/long_answer.svg";
import RatingScaleIcon from "../assets/icons/rating_scale.svg";
import YesNoIcon from "../assets/icons/yes_no.svg";
import DateIcon from "../assets/icons/date.svg";
import TimeIcon from "../assets/icons/time.svg";
import DropdownIcon from "../assets/icons/dropdown.svg";
import FileUploadIcon from "../assets/icons/upload.svg";
import MatrixIcon from "../assets/icons/matrix.svg";
import SliderIcon from "../assets/icons/slider.svg";
import SingleGridIcon from "../assets/icons/single-matrix.svg";
import LikertIcon from "../assets/icons/likert.svg";
import RankingIcon from "../assets/icons/ranking.svg";

export const QUESTION_TYPES: Array<{
  type: QuestionType;
  label: string;
  icon: string | React.ComponentType<any>;
  description: string;
  hasOptions: boolean;
  hasRating: boolean;
  hasMatrix: boolean;
}> = [
  {
    type: "single-choice",
    label: "Single Choice",
    icon: SingleChoiceIcon,
    description: "",
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "multiple-choice",
    label: "Multiple Choice",
    icon: MultipleChoiceIcon,
    description: "",
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "short-answer",
    label: "Short Answer",
    icon: ShortAnswerIcon,
    description: "",
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "long-answer",
    label: "Long Answer",
    icon: LongAnswerIcon,
    description: "",
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "yes-no",
    label: "Yes or No",
    icon: YesNoIcon,
    description: "",
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "rating-scale",
    label: "Rating",
    icon: RatingScaleIcon,
    description: "",
    hasOptions: false,
    hasRating: true,
    hasMatrix: false,
  },
  {
    type: "ranking",
    label: "Ranking",
    icon: RankingIcon,
    description: "",
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "likert-scale",
    label: "Likert Scale",
    icon: LikertIcon,
    description: "",
    hasOptions: false,
    hasRating: true,
    hasMatrix: false,
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: DropdownIcon,
    description: "",
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "file-upload",
    label: "File Upload",
    icon: FileUploadIcon,
    description: "",
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "single-grid",
    label: "Single Choice Grid",
    icon: SingleGridIcon,
    description: "",
    hasOptions: false,
    hasRating: false,
    hasMatrix: true,
  },
  {
    type: "multiple-grid",
    label: "Multiple Choice Grid",
    icon: MatrixIcon,
    description: "",
    hasOptions: false,
    hasRating: false,
    hasMatrix: true,
  },
  {
    type: "slider-scale",
    label: "Slider Scale",
    icon: SliderIcon,
    description: "",
    hasOptions: false,
    hasRating: true,
    hasMatrix: false,
  },
  {
    type: "date",
    label: "Date Picker",
    icon: DateIcon,
    description: "",
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: "time",
    label: "Time Picker",
    icon: TimeIcon,
    description: "",
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
];

export const DEFAULT_RATING_SCALE = {
  min: 1,
  max: 5,
  minLabel: "Poor",
  maxLabel: "Excellent",
  step: 1,
};

export const VALIDATION_LIMITS = {
  questionTitle: { max: 200 },
  questionDescription: { max: 500 },
  optionText: { max: 100 },
  shortAnswer: { max: 100 },
  longAnswer: { max: 1000 },
  minOptions: 2,
  maxOptions: 20,
};

export function getQuestionTypeConfig(type: QuestionType) {
  return QUESTION_TYPES.find((qt) => qt.type === type);
}

export function isPersistedQuestionId(id: string): boolean {
  return !id.startsWith("question_") && id.length > 20;
}

export function isPersistedOptionId(id: string): boolean {
  return !id.startsWith("option_") && id !== "yes" && id !== "no" && id.length > 20;
}

export function hasUnsyncedQuestionsWithContent(
  questions: Array<{ id: string; title?: string }>
): boolean {
  return questions.some(
    (question) => Boolean(question.title?.trim()) && !isPersistedQuestionId(question.id)
  );
}

export function createDefaultQuestion(type: QuestionType, order: number) {
  const baseQuestion = {
    id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title: "",
    required: false,
    order,
    validation: {},
  };

  switch (type) {
    case "single-choice":
    case "multiple-choice":
    case "dropdown":
    case "ranking":
      return {
        ...baseQuestion,
        options: [
          { id: "option_1", text: "Option 1", isOther: false },
          { id: "option_2", text: "Option 2", isOther: false },
        ],
      };

    case "yes-no":
      return {
        ...baseQuestion,
        options: [
          { id: "yes", text: "Yes" },
          { id: "no", text: "No" },
        ],
      };

    case "short-answer":
      return {
        ...baseQuestion,
        validation: { maxLength: VALIDATION_LIMITS.shortAnswer.max },
      };

    case "long-answer":
      return {
        ...baseQuestion,
        validation: { maxLength: VALIDATION_LIMITS.longAnswer.max },
      };

    case "rating-scale":
      return {
        ...baseQuestion,
        ratingScale: { ...DEFAULT_RATING_SCALE },
      };

    case "likert-scale":
      return {
        ...baseQuestion,
        likertScale: {
          min: 0,
          max: 10,
          step: 1,
          minLabel: "",
          maxLabel: "",
        },
      };

    case "single-grid":
      return {
        ...baseQuestion,
        matrix: {
          rows: ["Row 1", "row 2"],
          columns: ["Column 1"],
        },
      };

    case "multiple-grid":
      return {
        ...baseQuestion,
        matrix: {
          rows: ["Row 1"],
          columns: ["Column 1"],
        },
      };

    case "slider-scale":
      return {
        ...baseQuestion,
        slider: {
          min: 0,
          max: 10,
          step: 1,
          minLabel: "",
          maxLabel: "",
        },
      };

    case "file-upload":
      return {
        ...baseQuestion,
        fileSettings: {
          maxFiles: 1,
          allowedTypes: ["image/*", "application/pdf"],
          maxSizeMB: 10,
        },
      };

    case "date":
      return {
        ...baseQuestion,
        dateSettings: {
          format: "YYYY-MM-DD",
        },
      };

    case "time":
      return {
        ...baseQuestion,
        timeSettings: {
          format: "HH:mm",
        },
      };

    default:
      return baseQuestion;
  }
}
