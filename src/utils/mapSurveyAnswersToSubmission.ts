import type { QuestionDto, QuestionResponseSubmissionDto } from "../types/api";

export type AnswerValue = string | string[] | number | boolean;

function isAnswerProvided(question: QuestionDto, answers: Record<string, AnswerValue>): boolean {
  if (!(question.id in answers)) {
    return false;
  }

  const answer = answers[question.id];

  switch (question.type) {
    case 2:
      return Array.isArray(answer) && answer.length > 0;
    case 5:
    case 16:
    case 17:
      return typeof answer === "number" && !Number.isNaN(answer);
    case 6:
      return typeof answer === "boolean";
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
    case 10:
    case 14:
    case 15: {
      if (typeof answer !== "string" || !answer.trim()) {
        return null;
      }
      return {
        questionId: question.id,
        textResponse: answer.trim(),
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
