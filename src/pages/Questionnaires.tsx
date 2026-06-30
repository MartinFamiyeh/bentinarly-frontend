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
  const [surveyProjectId, setSurveyProjectId] = useState<string | undefined>(undefined);

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

  const mapQuestionTypeToApi = (type: Question["type"]): ApiTypes.QuestionType => {
    // Mapping from UI question type string to backend numeric QuestionType enum
    const mapping: Record<Question["type"], ApiTypes.QuestionType> = {
      "single-choice": 1,
      "multiple-choice": 2,
      "short-answer": 3,
      "long-answer": 4,
      "rating-scale": 5,
      "yes-no": 6,
      "date": 7,
      "time": 8,
      "email": 9,
      "phone": 10,
      "dropdown": 11,
      "file-upload": 12,
      "single-grid": 13,
      "ranking": 14,
      "multiple-grid": 15,
      "slider-scale": 16,
      "likert-scale": 17,
    };
    return mapping[type];
  };

  // Reverse mapping from backend numeric type to UI string type
  const mapApiTypeToQuestionType = (apiType: ApiTypes.QuestionType): QuestionType => {
    const reverseMapping: Record<ApiTypes.QuestionType, QuestionType> = {
      1: "single-choice",
      2: "multiple-choice",
      3: "short-answer",
      4: "long-answer",
      5: "rating-scale",
      6: "yes-no",
      7: "date",
      8: "time",
      9: "email",
      10: "phone",
      11: "dropdown",
      12: "file-upload",
      13: "single-grid",
      14: "ranking",
      15: "multiple-grid",
      16: "slider-scale",
      17: "likert-scale",
    };
    return reverseMapping[apiType];
  };

  const mapApiQuestionsToLocal = (questions: ApiTypes.QuestionDto[]): Question[] =>
    questions.map((q, index) => ({
      id: q.id,
      type: mapApiTypeToQuestionType(q.type),
      title: q.title || "",
      description: q.description || "",
      required: q.isRequired,
      order: q.order || index + 1,
      options:
        q.options
          ?.sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((opt) => ({
            id: opt.id,
            text: opt.text || "",
          })) || [],
    }));

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
    status: surveyData.status === 1 ? "draft" : surveyData.status === 2 ? "published" : "closed",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load survey from backend if surveyId exists
  useEffect(() => {
    const loadSurvey = async () => {
      if (surveyId && surveyId !== "new") {
        setIsSurveyLoaded(false);
        try {
          const surveyData = await surveysApi.getSurvey(surveyId, { includeQuestions: true });
          const questions = await questionsApi.getQuestions(surveyId);
          const loadedSurvey = mapLoadedSurvey(surveyData, questions);

          setSurvey(loadedSurvey);
          
          // Store owner info for ShareModal
          setSurveyOwnerId(surveyData.creatorId);
          setSurveyOwnerName(surveyData.creatorName || user?.firstName || user?.userName || "Unknown");
          // Store projectId to preserve it when updating
          setSurveyProjectId((surveyData as ApiTypes.SurveyDto & { projectId?: string }).projectId);
          
          const loadedSnapshot = createSurveySnapshot(loadedSurvey);
          setLastSavedSurvey(loadedSnapshot);
          offerDraftRestore(loadedSurvey, loadedSnapshot);
        } catch (error) {
          console.error("Error loading survey:", error);
        } finally {
          setIsSurveyLoaded(true);
        }
      } else {
        setIsSurveyLoaded(true);
      }
    };
    loadSurvey();
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

  const handleSave = async (): Promise<string> => {
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
            type: mapQuestionTypeToApi(question.type),
            title: questionTitle,
            description: question.description,
            isRequired: question.required,
            order: question.order,
            options: validOptions.map((opt, optIndex) => ({
              text: opt.text.trim(),
              order: optIndex,
            })),
          });
        }
      } else {
        savedSurveyId = survey.id;

        let currentProjectId = surveyProjectId;
        if (currentProjectId === undefined) {
          try {
            const currentSurveyData = await surveysApi.getSurvey(survey.id);
            currentProjectId = currentSurveyData.projectId;
            setSurveyProjectId(currentProjectId);

            if (!currentProjectId && selectedProject?.id) {
              currentProjectId = selectedProject.id;
            }
          } catch {
            currentProjectId = selectedProject?.id;
          }
        } else if (!currentProjectId && selectedProject?.id) {
          currentProjectId = selectedProject.id;
        }

        const updatePayload: ApiTypes.UpdateSurveyDto = {
          title: survey.title,
          description: survey.description,
          settings: {
            allowAnonymous: survey.settings.allowAnonymous,
            collectEmails: survey.settings.collectEmails,
            shuffleQuestions: survey.settings.shuffleQuestions,
            oneResponsePerPerson: survey.settings.oneResponsePerPerson,
          },
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

        const persistedLocalQuestions = survey.questions.filter((q) => isPersistedQuestionId(q.id));
        const localQuestionIds = new Set(persistedLocalQuestions.map((q) => q.id.toLowerCase()));
        const titledLocalQuestions = survey.questions.filter((q) => q.title?.trim());
        const shouldSyncDeletes =
          isSurveyLoaded &&
          (persistedLocalQuestions.length > 0 ||
            (titledLocalQuestions.length === 0 && existingQuestions.length > 0));

        const questionsToDelete = shouldSyncDeletes
          ? existingQuestions.filter((q) => !localQuestionIds.has(q.id.toLowerCase()))
          : [];

        for (const questionToDelete of questionsToDelete) {
          try {
            await questionsApi.deleteQuestion(survey.id, questionToDelete.id);
          } catch (error) {
            console.error("Error deleting question:", error);
          }
        }

        for (const question of survey.questions) {
          const questionTitle = question.title?.trim() || "";
          if (!questionTitle) {
            continue;
          }

          let effectiveQuestionId = question.id;
          let isExisting = existingQuestionIds.has(question.id.toLowerCase());

          if (!isExisting && !isPersistedQuestionId(question.id)) {
            const orderMatch = existingQuestions.find((eq) => eq.order === question.order);
            if (orderMatch) {
              effectiveQuestionId = orderMatch.id;
              isExisting = true;
            }
          }

          const validOptions = question.options?.filter((opt) => opt.text?.trim()) || [];

          if (isExisting) {
            await questionsApi.updateQuestion(survey.id, effectiveQuestionId, {
              type: mapQuestionTypeToApi(question.type),
              title: questionTitle,
              description: question.description,
              isRequired: question.required,
              order: question.order,
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
              type: mapQuestionTypeToApi(question.type),
              title: questionTitle,
              description: question.description,
              isRequired: question.required,
              order: question.order,
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

      if (survey.id === "new" && savedSurveyId !== "new") {
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
      const savedSurveyId = await handleSave();
      await surveysApi.publishSurvey(savedSurveyId);
      setSurvey((prev) => ({ ...prev, status: "published", id: savedSurveyId }));
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
    <div className="bg-white px-6 h-screen rounded-l-xl flex flex-col">
      {/* Top toolbar */}
      <div className="py-3 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={handleNavigateAway}
            className="cursor-pointer hover:opacity-70 transition-opacity">
            <Back />
          </button>
          <p className="font-semibold text-lg">{survey.title || "Untitled Survey"}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3 disabled:opacity-40"
            disabled={undoStack.length === 0}>
            <Undo />
            <p className="text-[14px]">Undo</p>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3 disabled:opacity-40"
            disabled={redoStack.length === 0}>
            <Redo />
            <p className="text-[14px]">Redo</p>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3 cursor-pointer"
            onClick={() => setIsPreviewSurvey(true)}>
            <Preview />
            <p className="text-[14px]">Preview</p>
          </button>
          <div
            className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3 cursor-pointer"
            onClick={() => setIsShareModalOpen(true)}>
            <Share />
            <p className="text-[14px]">Share</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isPublishing || !survey.title?.trim()}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-3 py-1 rounded-lg text-white font-semibold text-sm transition-colors">
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="bg-[#FE5102] hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed px-3 py-1 rounded-lg text-white font-semibold text-sm transition-colors"
              disabled={isSaving || isPublishing || !survey.title?.trim()}
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
        <div className="flex-1 bg-[#EFEFEF] rounded-lg overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <input
                type="text"
                value={survey.title}
                onChange={(e) => {
                  saveSnapshot();
                  const value = e.target.value;
                  setSurvey((prev) => ({ ...prev, title: value }));
                }}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
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
                className="text-gray-600 bg-transparent border-none outline-none w-full mt-2"
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
              <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500 h-[50vh]">
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-500 mb-4">Add your first question to get started</p>
                <div onClick={() => addQuestion()} className="cursor-pointer">
                  <AddQuestion />
                </div>
              </div>
            )}
          </div>
        </div>
      </DndContext>
      <div className="flex py-4 justify-between items-center">
        <p className="text-[#292929]">
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
