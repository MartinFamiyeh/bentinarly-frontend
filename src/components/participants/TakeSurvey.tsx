import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import type { PublicSurveyDto, QuestionDto } from "../../types/api";
import type { Question } from "../../types/question";
import { useFilesApi, useResponsesApi, useSurveysApi } from "../../services/apiClient";
import { useSnackbar } from "../../contexts/SnackbarContext";
import {
  type AnswerValue,
  type FileAnswerValue,
  mapAnswersToSubmission,
  validateRequiredAnswers,
} from "../../utils/mapSurveyAnswersToSubmission";
import {
  buildSurveyPages,
  getGlobalQuestionNumber,
  hasSurveySections,
  mapApiQuestionsToLocal,
} from "../../utils/surveyPages";
import {
  clearPersistedAnswers,
  loadPersistedAnswers,
  persistAnswers,
} from "../../utils/surveyAnswerPersistence";
import SurveyPollNavbar from "./take-survey/SurveyPollNavbar";
import SectionTitleCard from "./take-survey/SectionTitleCard";
import SurveyQuestionInput from "./take-survey/SurveyQuestionInput";
import ClearFormModal from "./take-survey/ClearFormModal";
import SurveyThankYou from "./take-survey/SurveyThankYou";

const TakeSurvey: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const surveyId = searchParams.get("surveyId");
  const surveysApi = useSurveysApi();
  const responsesApi = useResponsesApi();
  const filesApi = useFilesApi();
  const { showSnackbar } = useSnackbar();

  const [survey, setSurvey] = useState<PublicSurveyDto | null>(null);
  const [rewardAmount, setRewardAmount] = useState<number | undefined>(
    (location.state as { rewardPerResponse?: number } | null)?.rewardPerResponse
  );
  const [apiQuestions, setApiQuestions] = useState<QuestionDto[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [uploadingQuestionId, setUploadingQuestionId] = useState<string | null>(null);

  const sections = survey?.settings?.sections;

  const pages = useMemo(
    () => buildSurveyPages(questions, sections),
    [questions, sections]
  );

  const isPaginated = hasSurveySections(sections);
  const currentPage = pages[currentPageIndex];
  const totalPages = pages.length;

  const fetchSurvey = useCallback(async () => {
    if (!surveyId) {
      setLoading(false);
      setLoadError("Survey ID is missing from the URL.");
      return;
    }

    try {
      setLoading(true);
      setLoadError(null);
      const [surveyData, questionsData] = await Promise.all([
        surveysApi.getPublicSurvey(surveyId),
        surveysApi.getPublicQuestions(surveyId),
      ]);
      setSurvey(surveyData);

      if (surveyData.rewardPerResponse != null) {
        setRewardAmount(surveyData.rewardPerResponse);
      }

      const sortedApiQuestions = (questionsData || []).sort((a, b) => a.order - b.order);
      setApiQuestions(sortedApiQuestions);
      const localQuestions = mapApiQuestionsToLocal(sortedApiQuestions);
      setQuestions(localQuestions);

      const persisted = loadPersistedAnswers(surveyId);
      const initialAnswers: Record<string, AnswerValue> = { ...(persisted ?? {}) };

      for (const question of localQuestions) {
        if (question.type === "ranking" && !initialAnswers[question.id]) {
          initialAnswers[question.id] = question.options?.map((o) => o.id) || [];
        }
      }

      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Failed to fetch survey", err);
      setLoadError("Unable to load this survey. It may be unpublished or no longer available.");
      setSurvey(null);
      setApiQuestions([]);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [surveyId, surveysApi]);

  useEffect(() => {
    if (rewardAmount != null || !surveyId) {
      return;
    }

    const loadReward = async () => {
      try {
        const list = await surveysApi.getSurveys({});
        const match = list.items?.find((item) => item.id === surveyId);
        if (match?.rewardPerResponse != null) {
          setRewardAmount(match.rewardPerResponse);
        }
      } catch {
        // Reward display is optional; ignore lookup failures.
      }
    };

    void loadReward();
  }, [surveyId, rewardAmount, surveysApi]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  useEffect(() => {
    if (surveyId && Object.keys(answers).length > 0) {
      persistAnswers(surveyId, answers);
    }
  }, [answers, surveyId]);

  const updateAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const getApiQuestionsForPage = (pageIndex: number): QuestionDto[] => {
    const page = pages[pageIndex];
    if (!page) {
      return [];
    }
    const pageQuestionIds = new Set(page.questions.map((q) => q.id));
    return apiQuestions.filter((q) => pageQuestionIds.has(q.id));
  };

  const validateCurrentPage = (): boolean => {
    const pageApiQuestions = getApiQuestionsForPage(currentPageIndex);
    const validationError = validateRequiredAnswers(pageApiQuestions, answers);
    if (validationError) {
      showSnackbar(validationError, "error");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentPage()) {
      return;
    }
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearForm = () => {
    setAnswers({});
    setCurrentPageIndex(0);
    if (surveyId) {
      clearPersistedAnswers(surveyId);
    }
    setShowClearModal(false);
    showSnackbar("Form cleared.", "success");
  };

  const handleFileUpload = async (file: File): Promise<FileAnswerValue> => {
    const uploaded = await filesApi.uploadFile(file, "Survey response", true);
    return {
      fileUrl: uploaded.url || uploaded.filePath || uploaded.id,
      fileName: uploaded.originalFileName || uploaded.fileName || file.name,
      fileSizeBytes: uploaded.fileSizeBytes || file.size,
    };
  };

  const submitSurvey = async () => {
    if (!surveyId) {
      showSnackbar("Survey ID is missing.", "error");
      return;
    }

    const pageApiQuestions = isPaginated
      ? getApiQuestionsForPage(currentPageIndex)
      : apiQuestions;

    const validationError = validateRequiredAnswers(pageApiQuestions, answers);
    if (validationError) {
      showSnackbar(validationError, "error");
      return;
    }

    if (isPaginated && currentPageIndex < totalPages - 1) {
      handleNext();
      return;
    }

    const allValidationError = validateRequiredAnswers(apiQuestions, answers);
    if (allValidationError) {
      showSnackbar(allValidationError, "error");
      return;
    }

    const questionResponses = mapAnswersToSubmission(apiQuestions, answers);
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
      if (surveyId) {
        clearPersistedAnswers(surveyId);
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submit failed", err);
      showSnackbar("Failed to submit survey. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrimaryAction = () => {
    if (isPaginated && currentPageIndex < totalPages - 1) {
      handleNext();
      return;
    }
    void submitSurvey();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6]">
        <CircularProgress color="error" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4">
        <p className="text-center text-red-600">{loadError}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        <SurveyPollNavbar
          currentPage={1}
          totalPages={1}
          isPaginated={false}
          onClearForm={() => {}}
          canGoPrevious={false}
          canGoNext={false}
        />
        <SurveyThankYou rewardAmount={rewardAmount} />
      </div>
    );
  }

  if (!survey || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4">
        <p className="text-center text-[#696969]">This survey has no questions yet.</p>
      </div>
    );
  }

  const isLastPage = currentPageIndex >= totalPages - 1;
  const primaryLabel = isPaginated
    ? isLastPage
      ? submitting
        ? "Submitting..."
        : "Submit"
      : "Next"
    : submitting
      ? "Submitting..."
      : "Submit";

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <SurveyPollNavbar
        currentPage={currentPageIndex + 1}
        totalPages={totalPages}
        isPaginated={isPaginated}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onClearForm={() => setShowClearModal(true)}
        canGoPrevious={currentPageIndex > 0}
        canGoNext={currentPageIndex < totalPages - 1}
      />

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6 pb-28">
        {currentPageIndex === 0 && (
          <div className="rounded-xl border border-[#EEEEEE] bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-[#292929]">{survey.title || "Survey"}</h1>
            {survey.description && (
              <p className="mt-3 text-sm text-[#696969]">{survey.description}</p>
            )}
            <p className="mt-4 text-xs text-red-500">
              The symbol (*) indicates the question is required.
            </p>
          </div>
        )}

        {isPaginated && currentPage?.section && (
          <SectionTitleCard section={currentPage.section} />
        )}

        {currentPage?.questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="rounded-xl border border-[#FE510233] bg-white p-5 shadow-sm">
            <label className="mb-4 block text-sm font-semibold text-[#292929]">
              Q{getGlobalQuestionNumber(pages, currentPageIndex, questionIndex)}. {question.title}
              {question.required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {question.description && (
              <p className="mb-4 text-sm text-[#696969]">{question.description}</p>
            )}
            {question.image && (
              <img
                src={question.image}
                alt=""
                className="mb-4 max-h-48 w-full rounded-lg object-cover"
              />
            )}
            <SurveyQuestionInput
              question={question}
              value={answers[question.id]}
              onChange={(value) => updateAnswer(question.id, value)}
              uploading={uploadingQuestionId === question.id}
              onFileUpload={async (file) => {
                setUploadingQuestionId(question.id);
                try {
                  return await handleFileUpload(file);
                } finally {
                  setUploadingQuestionId(null);
                }
              }}
            />
          </div>
        ))}
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#EEEEEE] bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl justify-end">
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={submitting}
            className={`min-w-[140px] rounded-lg px-8 py-3 text-sm font-semibold text-white disabled:opacity-50 ${
              isPaginated
                ? "bg-[#FE5102] hover:bg-[#e54902]"
                : "bg-gradient-to-r from-[#FE5102] to-[#B148F3] hover:opacity-90"
            }`}>
            {primaryLabel}
          </button>
        </div>
      </div>

      <ClearFormModal
        isOpen={showClearModal}
        onCancel={() => setShowClearModal(false)}
        onConfirm={handleClearForm}
      />
    </div>
  );
};

export default TakeSurvey;
