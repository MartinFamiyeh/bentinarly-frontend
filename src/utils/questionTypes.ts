import type { QuestionType } from '../types/question';

// Import SVG icons
import SingleChoiceIcon from '../assets/icons/single_choice.svg';
import MultipleChoiceIcon from '../assets/icons/multiple_choice.svg';
import ShortAnswerIcon from '../assets/icons/short_answer.svg';
import LongAnswerIcon from '../assets/icons/long_answer.svg';
import RatingScaleIcon from '../assets/icons/rating_scale.svg';
import YesNoIcon from '../assets/icons/yes_no.svg';
import DateIcon from '../assets/icons/date.svg';
import TimeIcon from '../assets/icons/time.svg';
import DropdownIcon from '../assets/icons/arrow_down.svg';
import FileUploadIcon from '../assets/icons/file_upload.svg';
import MatrixIcon from '../assets/icons/matrix.svg';

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
    type: 'single-choice',
    label: 'Single Choice',
    icon: SingleChoiceIcon,
    description: 'Choose one option from a list',
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    icon: MultipleChoiceIcon,
    description: 'Choose multiple options from a list',
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'short-answer',
    label: 'Short Answer',
    icon: ShortAnswerIcon,
    description: 'Brief text response',
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'long-answer',
    label: 'Long Answer',
    icon: LongAnswerIcon,
    description: 'Detailed text response',
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'rating-scale',
    label: 'Rating Scale',
    icon: RatingScaleIcon,
    description: 'Rate on a scale',
    hasOptions: false,
    hasRating: true,
    hasMatrix: false,
  },
  {
    type: 'yes-no',
    label: 'Yes or No',
    icon: YesNoIcon,
    description: 'Simple yes/no response',
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'date',
    label: 'Date',
    icon: DateIcon,
    description: 'Select a date',
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'time',
    label: 'Time',
    icon: TimeIcon,
    description: 'Select a time',
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: DropdownIcon,
    description: 'Select from dropdown',
    hasOptions: true,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'file-upload',
    label: 'File Upload',
    icon: FileUploadIcon,
    description: 'Upload a file',
    hasOptions: false,
    hasRating: false,
    hasMatrix: false,
  },
  {
    type: 'matrix',
    label: 'Matrix',
    icon: MatrixIcon,
    description: 'Grid of questions',
    hasOptions: false,
    hasRating: false,
    hasMatrix: true,
  },
];

export const DEFAULT_RATING_SCALE = {
  min: 1,
  max: 5,
  minLabel: 'Poor',
  maxLabel: 'Excellent',
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
  return QUESTION_TYPES.find(qt => qt.type === type);
}

export function createDefaultQuestion(type: QuestionType, order: number) {
  const baseQuestion = {
    id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title: '',
    required: false,
    order,
    validation: {},
  };

  switch (type) {
    case 'single-choice':
    case 'multiple-choice':
    case 'dropdown':
      return {
        ...baseQuestion,
        options: [
          { id: 'option_1', text: 'Option 1', isOther: false },
        ],
      };
    case 'rating-scale':
      return {
        ...baseQuestion,
        ratingScale: DEFAULT_RATING_SCALE,
      };
    case 'matrix':
      return {
        ...baseQuestion,
        matrix: {
          rows: ['Row 1', 'Row 2'],
          columns: ['Column 1', 'Column 2'],
        },
      };
    default:
      return baseQuestion;
  }
}
