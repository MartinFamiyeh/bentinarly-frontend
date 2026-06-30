import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { QuestionDto } from "../../types/api";
import { useResponsesApi, useSurveysApi } from "../../services/apiClient";
import { useSnackbar } from "../../contexts/SnackbarContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  type AnswerValue,
  mapAnswersToSubmission,
  validateRequiredAnswers,
} from "../../utils/mapSurveyAnswersToSubmission";

const TakeSurvey: React.FC = () => {
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get("surveyId");
  const surveysApi = useSurveysApi();
  const responsesApi = useResponsesApi();
  const { showSnackbar } = useSnackbar();

  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchSurvey = useCallback(async () => {
    if (!surveyId) {
      setLoading(false);
      setLoadError("Survey ID is missing from the URL.");
      return;
    }

    try {
      setLoading(true);
      setLoadError(null);
      const questionsData = await surveysApi.getPublicQuestions(surveyId);
      setQuestions(questionsData || []);
    } catch (err) {
      console.error("Failed to fetch survey", err);
      setLoadError("Unable to load this survey. It may be unpublished or no longer available.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [surveyId, surveysApi]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  const updateAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleArrayValue = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const arr = (prev[questionId] as string[]) || [];
      return {
        ...prev,
        [questionId]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const submitSurvey = async () => {
    if (!surveyId) {
      showSnackbar("Survey ID is missing.", "error");
      return;
    }

    const validationError = validateRequiredAnswers(questions, answers);
    if (validationError) {
      showSnackbar(validationError, "error");
      return;
    }

    const questionResponses = mapAnswersToSubmission(questions, answers);
    if (questionResponses.length === 0) {
      showSnackbar("Please answer at least one question before submitting.", "error");
      return;
    }

    try {
      setSubmitting(true);
      await responsesApi.submitResponse(surveyId, {
        questionResponses,
        userAgent: navigator.userAgent,
      });
      setSubmitted(true);
      showSnackbar("Survey submitted successfully.", "success");
    } catch (err) {
      console.error("Submit failed", err);
      showSnackbar("Failed to submit survey. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getInputType = (questionType: number): string => {
    switch (questionType) {
      case 7:
        return "date";
      case 8:
        return "time";
      case 9:
        return "email";
      case 10:
        return "tel";
      default:
        return "text";
    }
  };

  const renderQuestionContent = (question: QuestionDto) => {
    switch (question.type) {
      case 1:
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => updateAnswer(question.id, option.id)}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={(answers[question.id] as string[])?.includes(option.id)}
                  onChange={() => toggleArrayValue(question.id, option.id)}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 3:
        return (
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={(answers[question.id] as string) || ""}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
          />
        );

      case 4:
        return (
          <textarea
            rows={4}
            className="w-full border rounded px-3 py-2"
            value={(answers[question.id] as string) || ""}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
          />
        );

      case 6:
        return (
          <div className="space-y-2">
            <label className="flex gap-2">
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === true}
                onChange={() => updateAnswer(question.id, true)}
              />
              Yes
            </label>
            <label className="flex gap-2">
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === false}
                onChange={() => updateAnswer(question.id, false)}
              />
              No
            </label>
          </div>
        );

      case 5: {
        const min = question.ratingScale?.min || 1;
        const max = question.ratingScale?.max || 5;

        return (
          <div className="flex gap-2">
            {Array.from({ length: max - min + 1 }).map((_, i) => {
              const val = min + i;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateAnswer(question.id, val)}
                  className={`text-2xl ${
                    val <= Number(answers[question.id] || 0) ? "text-[#FE5102]" : "text-gray-300"
                  }`}>
                  ★
                </button>
              );
            })}
          </div>
        );
      }

      case 11:
        return (
          <select
            className="w-full border rounded px-3 py-2"
            value={(answers[question.id] as string) || ""}
            onChange={(e) => updateAnswer(question.id, e.target.value)}>
            <option value="">Select an option</option>
            {question.options?.map((o) => (
              <option key={o.id} value={o.id}>
                {o.text}
              </option>
            ))}
          </select>
        );

      case 7:
      case 8:
      case 9:
      case 10:
        return (
          <input
            type={getInputType(question.type)}
            className="w-full border rounded px-3 py-2"
            value={(answers[question.id] as string) || ""}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
          />
        );

      default:
        return <p className="text-gray-400">Unsupported question type</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <CircularProgress color="error" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <p className="text-red-600">{loadError}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-[#292929]">Thank you!</h1>
        <p className="text-gray-600">Your responses have been submitted successfully.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <p className="text-gray-600">This survey has no questions yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      {questions.map((question, index) => (
        <div key={question.id} className="space-y-3">
          <label className="font-medium">
            Q{index + 1}. {question.title}
            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>

          {question.description && <p className="text-sm text-gray-500">{question.description}</p>}

          {renderQuestionContent(question)}
        </div>
      ))}

      <button
        type="button"
        onClick={submitSurvey}
        disabled={submitting}
        className="w-full bg-[#FE5102] text-white py-2 rounded-md font-medium disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit Survey"}
      </button>
    </div>
  );
};

export default TakeSurvey;
