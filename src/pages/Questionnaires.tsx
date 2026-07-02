import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useParams, useNavigate } from "react-router-dom";
import type { Question, Survey, QuestionType } from "../types/question";
import {
  createDefaultQuestion,
  isPersistedOptionId,
  isPersistedQuestionId,
} from "../utils/questionTypes";
import {
  mapApiQuestionsToLocal,
  mapLocalQuestionToApiPayload,
} from "../utils/questionMappers";
import { createSurveySnapshot } from "../utils/surveySnapshot";
import { useSurveyDraft } from "../hooks/useSurveyDraft";
import { useSnackbar } from "../contexts/SnackbarContext";
import QuestionBox from "../components/survey/QuestionBox";
import Preview from "../assets/icons/eye.svg";
import Undo from "../assets/icons/undo.svg";
import Redo from "../assets/icons/redo.svg";
import Share from "../assets/icons/share.svg";
import Back from "../assets/icons/back-arrow.svg";
import Profile from "../assets/icons/profile.svg";
import QuestionMark from "../assets/icons/question.svg";
import AddQuestion from "../assets/icons/add-question.svg";
import { useSurveysApi, useQuestionsApi } from "../services/apiClient";
import ShareModal from "../components/survey/ShareModal";
import DraftRestoreModal from "../components/survey/DraftRestoreModal";
import PreviewSurvey from "../components/survey/PreviewSurvey";
import { useProjects } from "../contexts/ProjectsContext";
import { useSurveyEditing } from "../contexts/SurveyEditingContext";
import { useAuth } from "../contexts/AuthContext";
import * as ApiTypes from "../types/api";

const Questionnaires: React.FC = () => {
  const { surveyId } = useParams<{ surveyId?: string }>();
  const navigate = useNavigate();
  const surveysApi = useSurveysApi();
  const questionsApi = useQuestionsApi();
  const { selectedProject } = useProjects();
  const { setStatus, setLastSavedAt } = useSurveyEditing();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const isExistingSurveyRoute = Boolean(surveyId && surveyId !== "new");
  const [isSurveyLoaded, setIsSurveyLoaded] = useState(!isExistingSurveyRoute);
  const [survey, setSurvey] = useState<Survey>({
    id: surveyId || "new",
    title: "New Survey",
    description: "",
    questions: isExistingSurveyRoute
      ? []
      : [createDefaultQuestion("single-choice", 1)],
    settings: {
      allowAnonymous: true,
      collectEmails: false,
      shuffleQuestions: false,
      oneResponsePerPerson: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
  });

  const [isPreviewMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isPreviewSurvey, setIsPreviewSurvey] = useState(false);
  const [undoStack, setUndoStack] = useState<Survey[]>([]);
  const [redoStack, setRedoStack] = useState<Survey[]>([]);

  const [lastSavedSurvey, setLastSavedSurvey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [surveyOwnerId, setSurveyOwnerId] = useState<string>("");
  const [surveyOwnerName, setSurveyOwnerName] = useState<string>("");
  const [apiSurveyStatus, setApiSurveyStatus] = useState<ApiTypes.SurveyStatus>(1);
  const [surveyProjectId, setSurveyProjectId] = useState<string | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);

  const draftKey = surveyId || survey.id || "new";

  const {
    pendingRestore,
    hasUnsavedServerChanges,
    offerDraftRestore,
    offerDraftRestoreForNew,
    restoreDraft,
    discardDraft,
    clearDraftForSurvey,
  } = useSurveyDraft({
    survey,
    draftKey,
    lastSavedSurvey,
    isSurveyLoaded,
    enabled: true,
  });

  const handleNavigateAway = () => {
    if (
      hasUnsavedServerChanges &&
      !window.confirm("You have unsaved changes. Leave without saving to the server?")
    ) {
      return;
    }
    navigate("/projects/dashboard");
  };

  const handleRestoreDraft = () => {
    const restored = restoreDraft();
    if (restored) {
      setSurvey(restored);
    }
  };

  const handleDiscardDraft = () => {
    discardDraft();
  };

  const mapApiStatusToLocal = (status: ApiTypes.SurveyStatus): Survey["status"] => {
    switch (status) {
      case 1: return "draft";
      case 2: return "published";
      case 5: return "paused";
      default: return "closed";
    }
  };

  const mapLoadedSurvey = (
    surveyData: ApiTypes.SurveyDto,
    questions: ApiTypes.QuestionDto[]
  ): Survey => ({
    id: surveyData.id,
    title: surveyData.title || "Untitled Survey",
    description: surveyData.description || "",
    questions: mapApiQuestionsToLocal(questions),
    settings: {
      allowAnonymous: surveyData.settings?.allowAnonymous ?? true,
      collectEmails: surveyData.settings?.collectEmails ?? false,
      shuffleQuestions: surveyData.settings?.shuffleQuestions ?? false,
      oneResponsePerPerson: surveyData.settings?.oneResponsePerPerson ?? true,
    },
    createdAt: surveyData.createdAt,
    updatedAt: surveyData.updatedAt,
    status: mapApiStatusToLocal(surveyData.status),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load survey from backend if surveyId exists
  useEffect(() => {
    let cancelled = false;

    const loadSurvey = async () => {
      if (surveyId && surveyId !== "new") {
        setIsSurveyLoaded(false);
        setLoadError(null);
        try {
          const surveyData = await surveysApi.getSurvey(surveyId, { includeQuestions: true });
          const questions =
            surveyData.questions && surveyData.questions.length > 0
              ? surveyData.questions
              : await questionsApi.getQuestions(surveyId);

          if (cancelled) return;

          const loadedSurvey = mapLoadedSurvey(surveyData, questions);

          setSurvey(loadedSurvey);
          setSurveyOwnerId(surveyData.creatorId);
          setApiSurveyStatus(surveyData.status);
          setSurveyOwnerName(
            surveyData.creatorName || user?.firstName || user?.userName || "Unknown"
          );
          setSurveyProjectId(surveyData.projectId);

          const loadedSnapshot = createSurveySnapshot(loadedSurvey);
          setLastSavedSurvey(loadedSnapshot);
          offerDraftRestore(loadedSurvey, loadedSnapshot);
        } catch (error) {
          if (cancelled) return;
          console.error("Error loading survey:", error);
          const message =
            error instanceof Error ? error.message : "Failed to load survey. Please try again.";
          setLoadError(message);
          showSnackbar(message, "error");
        } finally {
          if (!cancelled) {
            setIsSurveyLoaded(true);
          }
        }
      } else {
        setLoadError(null);
        setIsSurveyLoaded(true);
      }
    };

    loadSurvey();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  const newDraftPromptCheckedRef = useRef(false);

  useEffect(() => {
    if (surveyId !== "new") {
      newDraftPromptCheckedRef.current = false;
      return;
    }
    if (!isSurveyLoaded || newDraftPromptCheckedRef.current) {
      return;
    }
    newDraftPromptCheckedRef.current = true;
    offerDraftRestoreForNew(survey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId, isSurveyLoaded]);

  const saveSnapshot = () => {
    // Deep clone current survey to avoid mutating history references
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(survey))]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      const previous = prevUndo[prevUndo.length - 1];
      setRedoStack((prevRedo) => [...prevRedo, JSON.parse(JSON.stringify(survey))]);
      setSurvey(previous);
      return prevUndo.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const next = prevRedo[prevRedo.length - 1];
      setUndoStack((prevUndo) => [...prevUndo, JSON.parse(JSON.stringify(survey))]);
      setSurvey(next);
      return prevRedo.slice(0, -1);
    });
  };

  const addQuestion = (type: QuestionType = "single-choice") => {
    saveSnapshot();
    const newQuestion = createDefaultQuestion(type, survey.questions.length + 1);
    setSurvey((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    saveSnapshot();
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? { ...updatedQuestion, id: questionId, order: q.order } // Ensure ID is preserved
          : q
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    saveSnapshot();
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions
        .filter((q) => q.id !== questionId)
        .map((q, index) => ({ ...q, order: index + 1 })),
      updatedAt: new Date().toISOString(),
    }));
  };

  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = survey.questions.find((q) => q.id === questionId);
    if (questionToDuplicate) {
      const currentIndex = survey.questions.findIndex((q) => q.id === questionId);
      const duplicatedQuestion = {
        ...questionToDuplicate,
        id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: currentIndex + 2, // Insert right after the original
      };

      saveSnapshot();
      setSurvey((prev) => {
        const newQuestions = [...prev.questions];
        newQuestions.splice(currentIndex + 1, 0, duplicatedQuestion);

        // Update order numbers for all questions after the insertion
        newQuestions.forEach((q, index) => {
          q.order = index + 1;
        });

        return {
          ...prev,
          questions: newQuestions,
          updatedAt: new Date().toISOString(),
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = survey.questions.findIndex((q) => q.id === active.id);
      const newIndex = survey.questions.findIndex((q) => q.id === over.id);

      const newQuestions = arrayMove(survey.questions, oldIndex, newIndex);

      // Update order numbers
      newQuestions.forEach((q, index) => {
        q.order = index + 1;
      });

      saveSnapshot();
      setSurvey((prev) => ({
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const moveQuestionUpDown = (questionId: string, direction: "up" | "down") => {
    const currentIndex = survey.questions.findIndex((q) => q.id === questionId);
    if (
      (direction === "up" && currentIndex > 0) ||
      (direction === "down" && currentIndex < survey.questions.length - 1)
    ) {
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const newQuestions = arrayMove(survey.questions, currentIndex, targetIndex);

      // Update order numbers
      newQuestions.forEach((q, index) => {
        q.order = index + 1;
      });

      saveSnapshot();
      setSurvey((prev) => ({
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const handleSave = async (options?: { skipNavigate?: boolean }): Promise<string> => {
    if (survey.id !== "new" && !isSurveyLoaded) {
      throw new Error("Survey is still loading. Please try again.");
    }

    setIsSaving(true);
    setStatus("saving");
    let savedSurveyId = survey.id;

    try {
      const trimmedTitle = survey.title?.trim() || "";

      if (trimmedTitle) {
        const existing = await surveysApi.getSurveys({
          projectId: selectedProject?.id,
          searchTerm: trimmedTitle,
          page: 1,
          pageSize: 10,
        });

        const hasDuplicate = existing.items?.some((s) => {
          const existingTitle = (s.title || "").trim().toLowerCase();
          const currentTitle = trimmedTitle.toLowerCase();
          return existingTitle === currentTitle && s.id !== survey.id;
        });

        if (hasDuplicate) {
          setStatus("error");
          throw new Error("A survey with this title already exists in this project.");
        }
      }

      if (survey.id === "new") {
        const newSurvey = await surveysApi.createSurvey({
          title: trimmedTitle,
          description: survey.description,
          projectId: selectedProject?.id,
          settings: {
            allowAnonymous: survey.settings.allowAnonymous,
            collectEmails: survey.settings.collectEmails,
            shuffleQuestions: survey.settings.shuffleQuestions,
            oneResponsePerPerson: survey.settings.oneResponsePerPerson,
            showProgress: true,
            allowSaveAndContinue: false,
            requireLogin: false,
          },
          expectedResponses: 0,
          isTemplate: false,
        });

        savedSurveyId = newSurvey.id;
        setSurveyProjectId(newSurvey.projectId || selectedProject?.id);

        for (const question of survey.questions) {
          const questionTitle = question.title?.trim() || "";
          if (!questionTitle) {
            continue;
          }

          const validOptions = question.options?.filter((opt) => opt.text?.trim()) || [];
          await questionsApi.createQuestion(savedSurveyId, {
            ...mapLocalQuestionToApiPayload({ ...question, title: questionTitle }),
            options: validOptions.map((opt, optIndex) => ({
              text: opt.text.trim(),
              order: optIndex,
            })),
          });
        }
      } else {
        savedSurveyId = survey.id;

        let currentProjectId = surveyProjectId;
        let currentSurveyData: ApiTypes.SurveyDto | null = null;
        try {
          currentSurveyData = await surveysApi.getSurvey(survey.id);
          if (currentProjectId === undefined) {
            currentProjectId = currentSurveyData.projectId;
            setSurveyProjectId(currentProjectId);
          }
          if (!currentProjectId && selectedProject?.id) {
            currentProjectId = selectedProject.id;
          }
        } catch {
          currentProjectId = currentProjectId ?? selectedProject?.id;
        }

        const updatePayload: ApiTypes.UpdateSurveyDto = {
          title: survey.title,
          description: survey.description,
          settings: {
            ...(currentSurveyData?.settings ?? {}),
            allowAnonymous: survey.settings.allowAnonymous,
            collectEmails: survey.settings.collectEmails,
            shuffleQuestions: survey.settings.shuffleQuestions,
            oneResponsePerPerson: survey.settings.oneResponsePerPerson,
          },
          expectedResponses: currentSurveyData?.expectedResponses ?? 0,
          rewardPerResponse: currentSurveyData?.rewardPerResponse,
        };

        if (currentProjectId !== undefined && currentProjectId !== null) {
          updatePayload.projectId = currentProjectId;
        }

        const updatedSurvey = await surveysApi.updateSurvey(survey.id, updatePayload);
        if (updatedSurvey.projectId !== undefined) {
          setSurveyProjectId(updatedSurvey.projectId);
        }

        const existingQuestions = await questionsApi.getQuestions(survey.id);
        const existingQuestionIds = new Set(existingQuestions.map((q) => q.id.toLowerCase()));

        const localPersistedQuestionIds = new Set(
          survey.questions
            .filter((q) => isPersistedQuestionId(q.id))
            .map((q) => q.id.toLowerCase())
        );

        const questionsToDelete = isSurveyLoaded
          ? existingQuestions.filter((q) => !localPersistedQuestionIds.has(q.id.toLowerCase()))
          : [];

        for (const questionToDelete of questionsToDelete) {
          try {
            await questionsApi.deleteQuestion(survey.id, questionToDelete.id);
          } catch (error) {
            console.error("Error deleting question:", error);
            throw new Error("Failed to remove a deleted question from the server. Please try again.");
          }
        }

        for (const question of survey.questions) {
          const questionTitle = question.title?.trim() || "";
          if (!questionTitle) {
            continue;
          }

          const isExisting = existingQuestionIds.has(question.id.toLowerCase());
          const apiPayload = mapLocalQuestionToApiPayload({ ...question, title: questionTitle });
          const validOptions = question.options?.filter((opt) => opt.text?.trim()) || [];

          if (isExisting) {
            await questionsApi.updateQuestion(survey.id, question.id, {
              ...apiPayload,
              options: validOptions.map((opt, optIndex) => {
                const optionPayload: { text: string; order: number; id?: string } = {
                  text: opt.text.trim(),
                  order: optIndex,
                };
                if (isPersistedOptionId(opt.id)) {
                  optionPayload.id = opt.id;
                }
                return optionPayload;
              }),
            });
          } else {
            const newQuestion = await questionsApi.createQuestion(survey.id, {
              ...apiPayload,
              options: validOptions.map((opt, optIndex) => ({
                text: opt.text.trim(),
                order: optIndex,
              })),
            });
            existingQuestionIds.add(newQuestion.id.toLowerCase());
          }
        }
      }

      const apiQuestions = await questionsApi.getQuestions(savedSurveyId);
      const mappedQuestions = mapApiQuestionsToLocal(apiQuestions);
      const unsavedDrafts = survey.questions.filter((q) => !q.title?.trim());
      const syncedSurvey: Survey = {
        ...survey,
        id: savedSurveyId,
        questions: [...mappedQuestions, ...unsavedDrafts],
        updatedAt: new Date().toISOString(),
      };

      setSurvey(syncedSurvey);

      const now = Date.now();
      setLastSavedAt(now);
      setStatus("saved");

      const currentSnapshot = createSurveySnapshot(syncedSurvey);
      setLastSavedSurvey(currentSnapshot);
      clearDraftForSurvey(savedSurveyId, survey.id !== savedSurveyId ? survey.id : undefined);
      setIsSurveyLoaded(true);

      if (!options?.skipNavigate && survey.id === "new" && savedSurveyId !== "new") {
        navigate(`/survey/questionnaires/${savedSurveyId}`, { replace: true });
      }

      return savedSurveyId;
    } catch (error) {
      console.error("Error saving survey:", error);
      setStatus("error");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!survey.title?.trim()) {
      showSnackbar("Survey title is required before publishing.", "error");
      return;
    }

    const hasTitledQuestion = survey.questions.some((q) => q.title?.trim());
    if (!hasTitledQuestion) {
      showSnackbar("Add at least one question with a title before publishing.", "error");
      return;
    }

    setIsPublishing(true);
    try {
      const savedSurveyId = await handleSave({ skipNavigate: true });
      const publishedSurvey = await surveysApi.publishSurvey(savedSurveyId);
      setApiSurveyStatus(publishedSurvey.status);
      setSurvey((prev) => ({
        ...prev,
        status: mapApiStatusToLocal(publishedSurvey.status),
        id: savedSurveyId,
      }));
      if (survey.id === "new" && savedSurveyId !== "new") {
        navigate(`/survey/questionnaires/${savedSurveyId}`, { replace: true });
      }
      showSnackbar("Survey published successfully.", "success");
    } catch (error) {
      console.error("Error publishing survey:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to publish survey. Please try again.",
        "error"
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveClick = async () => {
    try {
      await handleSave();
      showSnackbar("Survey saved successfully.", "success");
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save survey. Please try again.",
        "error"
      );
    }
  };

  const handleActivateQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    const isOnQuestionCard = target.closest("[data-question-card]");

    if (!isOnQuestionCard) {
      setActiveQuestionId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 px-6 h-screen rounded-l-xl flex flex-col">
      {/* Top toolbar */}
      <div className="py-3 flex justify-between items-center flex-shrink-0 border-b border-transparent dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={handleNavigateAway}
            className="cursor-pointer hover:opacity-70 transition-opacity">
            <Back />
          </button>
          <p className="font-semibold text-lg dark:text-gray-100">{survey.title || "Untitled Survey"}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-2 bg-[#FAFAFA] dark:bg-gray-800 dark:text-gray-200 rounded-lg py-2 px-3 disabled:opacity-40"
            disabled={undoStack.length === 0}>
            <Undo />
            <p className="text-[14px]">Undo</p>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            className="flex items-center gap-2 bg-[#FAFAFA] dark:bg-gray-800 dark:text-gray-200 rounded-lg py-2 px-3 disabled:opacity-40"
            disabled={redoStack.length === 0}>
            <Redo />
            <p className="text-[14px]">Redo</p>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#FAFAFA] dark:bg-gray-800 dark:text-gray-200 rounded-lg py-2 px-3 cursor-pointer"
            onClick={() => setIsPreviewSurvey(true)}>
            <Preview />
            <p className="text-[14px]">Preview</p>
          </button>
          <div
            className="flex items-center gap-2 bg-[#FAFAFA] dark:bg-gray-800 dark:text-gray-200 rounded-lg py-2 px-3 cursor-pointer"
            onClick={() => setIsShareModalOpen(true)}>
            <Share />
            <p className="text-[14px]">Share</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSaving || isPublishing || !survey.title?.trim() || Boolean(loadError)}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-3 py-1 rounded-lg text-white font-semibold text-sm transition-colors">
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="bg-[#FE5102] hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed px-3 py-1 rounded-lg text-white font-semibold text-sm transition-colors"
              disabled={isSaving || isPublishing || !survey.title?.trim() || Boolean(loadError)}
              onClick={handlePublish}>
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
          <div>
            <Profile />
          </div>
        </div>
      </div>
      {/* Scrollable form area */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex-1 bg-[#EFEFEF] dark:bg-gray-800 rounded-lg overflow-y-auto">
          {loadError ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Could not load survey</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{loadError}</p>
              <button
                type="button"
                onClick={() => navigate("/projects/dashboard")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700">
                Back to dashboard
              </button>
            </div>
          ) : (
          <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <input
                type="text"
                value={survey.title}
                onChange={(e) => {
                  saveSnapshot();
                  const value = e.target.value;
                  setSurvey((prev) => ({ ...prev, title: value }));
                }}
                className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none w-full"
                placeholder="Survey Title"
              />
              <input
                type="text"
                value={survey.description}
                onChange={(e) => {
                  saveSnapshot();
                  const value = e.target.value;
                  setSurvey((prev) => ({ ...prev, description: value }));
                }}
                className="text-gray-600 dark:text-gray-400 bg-transparent border-none outline-none w-full mt-2"
                placeholder="Type description here"
                maxLength={100}
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "wraps",
                  overflow: "hidden",
                }}
              />
            </div>

            {/* Questions */}
            <SortableContext
              items={survey.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {survey.questions.map((question, index) => (
                  <QuestionBox
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                    onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                    onDelete={() => deleteQuestion(question.id)}
                    onDuplicate={() => duplicateQuestion(question.id)}
                    onMoveUp={index > 0 ? () => moveQuestionUpDown(question.id, "up") : undefined}
                    onMoveDown={
                      index < survey.questions.length - 1
                        ? () => moveQuestionUpDown(question.id, "down")
                        : undefined
                    }
                    isPreview={isPreviewMode}
                    isActive={activeQuestionId === question.id}
                    onActivate={() => handleActivateQuestion(question.id)}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Add Question Button */}
            {!isPreviewMode && survey.questions.length > 0 && (
              <div className="flex justify-center mt-6">
                <div onClick={() => addQuestion()} className="cursor-pointer">
                  <AddQuestion />
                </div>
              </div>
            )}

            {/* Empty State */}
            {survey.questions.length === 0 && !isPreviewMode && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500 dark:text-gray-400 h-[50vh]">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No questions yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first question to get started</p>
                <div onClick={() => addQuestion()} className="cursor-pointer">
                  <AddQuestion />
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </DndContext>
      <div className="flex py-4 justify-between items-center">
        <p className="text-[#292929] dark:text-gray-200">
          Total Questions: <span className="font-bold">{survey.questions.length}</span>
        </p>
        <div className="cursor-pointer">
          <QuestionMark />
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)}
        surveyId={survey.id}
        surveyOwnerId={surveyOwnerId}
        surveyOwnerName={surveyOwnerName}
        surveyStatus={apiSurveyStatus}
        onSurveyStatusChange={(status) => {
          setApiSurveyStatus(status);
          setSurvey((prev) => ({ ...prev, status: mapApiStatusToLocal(status) }));
        }}
      />

      {isPreviewSurvey && (
        <PreviewSurvey
          questions={survey.questions}
          onClose={() => setIsPreviewSurvey(false)}
        />
      )}

      {pendingRestore && (
        <DraftRestoreModal
          savedAt={pendingRestore.savedAt}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
        />
      )}

    </div>
  );
};

export default Questionnaires;
