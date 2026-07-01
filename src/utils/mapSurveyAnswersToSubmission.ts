import type { QuestionDto, QuestionResponseSubmissionDto } from "../types/api";

export type FileAnswerValue = {
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
};

export type MatrixAnswerValue = Record<string, string | string[]>;

export type OtherOptionAnswerValue = {
  optionId: string;
  otherText?: string;
};

export type AnswerValue =
  | string
  | string[]
  | number
  | boolean
  | FileAnswerValue
  | MatrixAnswerValue
  | OtherOptionAnswerValue;

function isAnswerProvided(question: QuestionDto, answers: Record<string, AnswerValue>): boolean {
  if (!(question.id in answers)) {
    return false;
  }

  const answer = answers[question.id];

  switch (question.type) {
    case 2:
    case 14:
      return Array.isArray(answer) && answer.length > 0;
    case 5:
    case 16:
    case 17:
      return typeof answer === "number" && !Number.isNaN(answer);
    case 6:
      return typeof answer === "boolean";
    case 12:
      return (
        typeof answer === "object" &&
        answer !== null &&
        !Array.isArray(answer) &&
        "fileUrl" in answer &&
        Boolean((answer as FileAnswerValue).fileUrl)
      );
    case 13:
    case 15:
      return (
        typeof answer === "object" &&
        answer !== null &&
        !Array.isArray(answer) &&
        Object.keys(answer as MatrixAnswerValue).length > 0
      );
    case 1:
    case 11:
      if (typeof answer === "object" && answer !== null && "optionId" in answer) {
        const otherAnswer = answer as OtherOptionAnswerValue;
        return Boolean(otherAnswer.optionId);
      }
      return typeof answer === "string" && answer.trim().length > 0;
    default:
      if (typeof answer === "string") {
        return answer.trim().length > 0;
      }
      if (typeof answer === "number") {
        return !Number.isNaN(answer);
      }
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      return false;
  }
}

export function validateRequiredAnswers(
  questions: QuestionDto[],
  answers: Record<string, AnswerValue>
): string | null {
  for (const question of questions) {
    if (question.isRequired && !isAnswerProvided(question, answers)) {
      const label = question.title?.trim() || `Question ${question.order}`;
      return `Please answer the required question: ${label}`;
    }
  }
  return null;
}

function mapSingleAnswer(
  question: QuestionDto,
  answer: AnswerValue
): QuestionResponseSubmissionDto | null {
  switch (question.type) {
    case 1:
    case 11: {
      if (typeof answer === "object" && answer !== null && "optionId" in answer) {
        const otherAnswer = answer as OtherOptionAnswerValue;
        if (!otherAnswer.optionId) {
          return null;
        }
        return {
          questionId: question.id,
          selectedOptionIds: [otherAnswer.optionId],
          textResponse: otherAnswer.otherText?.trim() || undefined,
        };
      }
      if (typeof answer !== "string" || !answer.trim()) {
        return null;
      }
      return {
        questionId: question.id,
        selectedOptionIds: [answer],
      };
    }
    case 2: {
      if (!Array.isArray(answer) || answer.length === 0) {
        return null;
      }
      return {
        questionId: question.id,
        selectedOptionIds: answer,
      };
    }
    case 3:
    case 4:
    case 9:
    case 10: {
      if (typeof answer !== "string" || !answer.trim()) {
        return null;
      }
      return {
        questionId: question.id,
        textResponse: answer.trim(),
      };
    }
    case 14: {
      if (!Array.isArray(answer) || answer.length === 0) {
        return null;
      }
      return {
        questionId: question.id,
        selectedOptionIds: answer,
      };
    }
    case 5:
    case 17: {
      if (typeof answer !== "number" || Number.isNaN(answer)) {
        return null;
      }
      return {
        questionId: question.id,
        ratingValue: answer,
        numericValue: answer,
      };
    }
    case 16: {
      if (typeof answer !== "number" || Number.isNaN(answer)) {
        return null;
      }
      return {
        questionId: question.id,
        numericValue: answer,
      };
    }
    case 6: {
      if (typeof answer !== "boolean") {
        return null;
      }
      return {
        questionId: question.id,
        textResponse: answer ? "Yes" : "No",
      };
    }
    case 7: {
      if (typeof answer !== "string" || !answer.trim()) {
        return null;
      }
      return {
        questionId: question.id,
        dateResponse: answer.trim(),
      };
    }
    case 8: {
      if (typeof answer !== "string" || !answer.trim()) {
        return null;
      }
      const timeValue = answer.trim();
      return {
        questionId: question.id,
        timeResponse: timeValue.length === 5 ? `${timeValue}:00` : timeValue,
      };
    }
    case 12: {
      if (
        typeof answer !== "object" ||
        answer === null ||
        Array.isArray(answer) ||
        !("fileUrl" in answer)
      ) {
        return null;
      }
      const fileAnswer = answer as FileAnswerValue;
      if (!fileAnswer.fileUrl) {
        return null;
      }
      return {
        questionId: question.id,
        fileUrl: fileAnswer.fileUrl,
        fileName: fileAnswer.fileName,
        fileSizeBytes: fileAnswer.fileSizeBytes,
      };
    }
    case 13:
    case 15: {
      if (
        typeof answer !== "object" ||
        answer === null ||
        Array.isArray(answer) ||
        Object.keys(answer).length === 0
      ) {
        return null;
      }
      return {
        questionId: question.id,
        matrixResponse: JSON.stringify(answer),
      };
    }
    default:
      return null;
  }
}

export function mapAnswersToSubmission(
  questions: QuestionDto[],
  answers: Record<string, AnswerValue>
): QuestionResponseSubmissionDto[] {
  const submissions: QuestionResponseSubmissionDto[] = [];

  for (const question of questions) {
    if (!(question.id in answers)) {
      continue;
    }

    const mapped = mapSingleAnswer(question, answers[question.id]);
    if (mapped) {
      submissions.push(mapped);
    }
  }

  return submissions;
}
