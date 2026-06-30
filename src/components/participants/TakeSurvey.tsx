import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { QuestionDto } from "../../types/api";
import { useSurveysApi } from "../../services/apiClient";
import CircularProgress from "@mui/material/CircularProgress";

type AnswerValue = string | string[] | number | boolean | Record<string, any>;

const TakeSurvey: React.FC = () => {
   const [searchParams] = useSearchParams();
   const surveyId = searchParams.get("surveyId");
  const surveysApi = useSurveysApi();

  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------------------- */
  /* Fetch Survey */
  /* ---------------------------------- */

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const questionsData = await surveysApi.getPublicQuestions(surveyId!);
      setQuestions(questionsData || []);
    } catch (err) {
      console.error("Failed to fetch survey", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (surveyId) fetchSurvey();
  }, []);

  /* ---------------------------------- */
  /* Answer Helpers */
  /* ---------------------------------- */
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

  /* ---------------------------------- */
  /* Submit */
  /* ---------------------------------- */
  const submitSurvey = async () => {
    try {
      setSubmitting(true);

      // 🔁 Replace with real API call
      await fetch(`/api/surveys/${surveyId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      alert("Survey submitted successfully 🎉");
    } catch (err) {
      console.error("Submit failed", err);
      alert("Failed to submit survey");
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

  /* ---------------------------------- */
  /* Render Question */
  /* ---------------------------------- */
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
                checked={answers[question.id] === true}
                onChange={() => updateAnswer(question.id, true)}
              />
              Yes
            </label>
            <label className="flex gap-2">
              <input
                type="radio"
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

      //   case "slider-scale":
      //     return (
      //       <input
      //         type="range"
      //         min={question.slider!.min}
      //         max={question.slider!.max}
      //         step={question.slider!.step || 1}
      //         value={(answers[question.id] as number) ?? question.slider!.min}
      //         onChange={(e) => updateAnswer(question.id, Number(e.target.value))}
      //         className="w-full"
      //       />
      //     );

      default:
        return <p className="text-gray-400">Unsupported question type</p>;
    }
  };

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <CircularProgress color="error" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
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
        onClick={submitSurvey}
        disabled={submitting}
        className="w-full bg-[#FE5102] text-white py-2 rounded-md font-medium disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit Survey"}
      </button>
    </div>
  );
};

export default TakeSurvey;
