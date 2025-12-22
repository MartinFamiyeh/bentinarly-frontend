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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Question, Survey, QuestionType } from "../types/question";
import { createDefaultQuestion } from "../utils/questionTypes";
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
import PreviewSurvey from "../components/survey/PreviewSurvey";
import { useProjects } from "../contexts/ProjectsContext";
import { useSurveyEditing } from "../contexts/SurveyEditingContext";
import { useAuth } from "../contexts/AuthContext";
import * as ApiTypes from "../types/api";

// Helper function to create a normalized snapshot of survey for comparison
const createSurveySnapshot = (survey: Survey): string => {
  // Create a clean copy without transient fields that don't affect backend state
  const snapshot = {
    id: survey.id,
    title: survey.title?.trim() || "",
    description: survey.description?.trim() || "",
    settings: survey.settings,
    questions: survey.questions
      .filter(q => q.title?.trim()) // Only include questions with titles
      .map(q => ({
        id: q.id,
        type: q.type,
        title: q.title?.trim() || "",
        description: q.description?.trim() || "",
        required: q.required,
        order: q.order,
        options: (q.options || [])
          .filter(opt => opt.text?.trim())
          .map(opt => ({
            id: opt.id,
            text: opt.text?.trim() || "",
          })),
      }))
      .sort((a, b) => a.order - b.order), // Sort by order for consistent comparison
  };
  return JSON.stringify(snapshot);
};


// Auto-save on route change and browser close
const useRouteBasedAutoSave = (
  survey: Survey,
  handleSave: () => Promise<void>,
  lastSavedSurvey: string | null,
  currentSurveyId: string | undefined
) => {
  const location = useLocation();
  const prevLocationRef = useRef<string>(location.pathname);
  const isSavingRef = useRef<boolean>(false);

  useEffect(() => {
    // Only set up auto-save if survey has been created and has a title
    if (survey.id === "new" || !survey.title?.trim()) {
      return;
    }

    // Check if we're on the survey editing page
    const isOnSurveyPage = location.pathname.startsWith('/survey/questionnaires/');
    const wasOnSurveyPage = prevLocationRef.current.startsWith('/survey/questionnaires/');

    // If we were on the survey page and now we're not, save the survey
    if (wasOnSurveyPage && !isOnSurveyPage && !isSavingRef.current) {
      const currentSnapshot = createSurveySnapshot(survey);
      if (lastSavedSurvey !== currentSnapshot) {
        console.log("🔄 Route changed away from survey page, auto-saving...");
        isSavingRef.current = true;
        handleSave()
          .then(() => {
            console.log("✅ Auto-saved on route change");
          })
          .catch((error) => {
            console.error("❌ Error auto-saving on route change:", error);
          })
          .finally(() => {
            isSavingRef.current = false;
          });
      }
    }

    // Update previous location
    prevLocationRef.current = location.pathname;
  }, [location.pathname, survey, handleSave, lastSavedSurvey, currentSurveyId]);

  // Handle browser/tab close
  useEffect(() => {
    if (survey.id === "new" || !survey.title?.trim()) {
      return;
    }

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // Check if there are unsaved changes
      const currentSnapshot = createSurveySnapshot(survey);
      if (lastSavedSurvey === currentSnapshot) {
        return; // No changes, allow navigation
      }

      // Attempt to save before leaving
      // Note: Modern browsers limit async operations in beforeunload
      // We'll use sendBeacon or a synchronous approach
      e.preventDefault();
      e.returnValue = ""; // Chrome requires returnValue to be set

      // Try to save using sendBeacon for better reliability
      try {
        // For beforeunload, we can't reliably await async operations
        // So we'll just show the warning and let the user decide
        // The route-based save should handle most cases
        console.log("⚠️ Browser closing with unsaved changes");
      } catch (error) {
        console.error("Error in beforeunload handler:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [survey, lastSavedSurvey]);
};

const Questionnaires: React.FC = () => {
  const { surveyId } = useParams<{ surveyId?: string }>();
  const navigate = useNavigate();
  const surveysApi = useSurveysApi();
  const questionsApi = useQuestionsApi();
  const { selectedProject } = useProjects();
  const { setStatus, setLastSavedAt } = useSurveyEditing();
  const { user } = useAuth();
  const [survey, setSurvey] = useState<Survey>({
    id: surveyId || "new",
    title: "New Survey",
    description: "",
    questions: [createDefaultQuestion("single-choice", 1)],
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
  // Get last saved snapshot from localStorage if it exists, otherwise null
  const getLastSavedSnapshotFromStorage = (surveyId: string): string | null => {
    try {
      const key = `lastSavedSurvey_${surveyId}`;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setLastSavedSnapshotToStorage = (surveyId: string, snapshot: string) => {
    try {
      const key = `lastSavedSurvey_${surveyId}`;
      localStorage.setItem(key, snapshot);
    } catch {
      // Ignore localStorage errors
    }
  };

  const [lastSavedSurvey, setLastSavedSurvey] = useState<string | null>(null); // JSON string of last saved state
  const [isSaving, setIsSaving] = useState(false);
  const [surveyOwnerId, setSurveyOwnerId] = useState<string>("");
  const [surveyOwnerName, setSurveyOwnerName] = useState<string>("");
  const [surveyProjectId, setSurveyProjectId] = useState<string | undefined>(undefined);

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
        try {
          const surveyData = await surveysApi.getSurvey(surveyId, { includeQuestions: true });
          const questions = await questionsApi.getQuestions(surveyId);

          // Convert API types to local Survey type
          setSurvey({
            id: surveyData.id,
            title: surveyData.title || "Untitled Survey",
            description: surveyData.description || "",
            questions: questions.map((q, index) => ({
              id: q.id,
              type: mapApiTypeToQuestionType(q.type),
              title: q.title || "",
              description: q.description || "",
              required: q.isRequired,
              order: q.order || index + 1,
              options: q.options
                ?.sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order to ensure correct sequence
                .map((opt) => ({
                  id: opt.id,
                  text: opt.text || "",
                })) || [],
            })),
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
          
          // Store owner info for ShareModal
          setSurveyOwnerId(surveyData.creatorId);
          setSurveyOwnerName(surveyData.creatorName || user?.firstName || user?.userName || "Unknown");
          // Store projectId to preserve it when updating
          setSurveyProjectId((surveyData as ApiTypes.SurveyDto & { projectId?: string }).projectId);
          
          // Set the saved snapshot to match loaded state (so auto-save doesn't trigger immediately)
          const loadedSurvey: Survey = {
            id: surveyData.id,
            title: surveyData.title || "Untitled Survey",
            description: surveyData.description || "",
            questions: questions.map((q, index) => ({
              id: q.id,
              type: mapApiTypeToQuestionType(q.type),
              title: q.title || "",
              description: q.description || "",
              required: q.isRequired,
              order: q.order || index + 1,
              options: q.options
                ?.sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((opt) => ({
                  id: opt.id,
                  text: opt.text || "",
                })) || [],
            })),
            settings: {
              allowAnonymous: surveyData.settings?.allowAnonymous ?? true,
              collectEmails: surveyData.settings?.collectEmails ?? false,
              shuffleQuestions: surveyData.settings?.shuffleQuestions ?? false,
              oneResponsePerPerson: surveyData.settings?.oneResponsePerPerson ?? true,
            },
            createdAt: surveyData.createdAt,
            updatedAt: surveyData.updatedAt,
            status: surveyData.status === 1 ? "draft" : surveyData.status === 2 ? "published" : "closed",
          };
          
          const loadedSnapshot = createSurveySnapshot(loadedSurvey);
          setLastSavedSurvey(loadedSnapshot);
          
          // Store snapshot in localStorage for comparison on next mount
          setLastSavedSnapshotToStorage(surveyData.id, loadedSnapshot);
        } catch (error) {
          console.error("Error loading survey:", error);
        }
      }
    };
    loadSurvey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  // Auto-save on mount if loaded survey differs from last saved snapshot
  useEffect(() => {
    if (survey.id === "new" || !survey.title?.trim() || !surveyId || surveyId === "new") {
      return;
    }

    const loadedSnapshot = createSurveySnapshot(survey);
    const previousSavedSnapshot = getLastSavedSnapshotFromStorage(survey.id);

    // Compare and save if different
    if (previousSavedSnapshot && previousSavedSnapshot !== loadedSnapshot) {
      console.log("📋 Auto-saving on mount - survey differs from last saved snapshot");
      handleSave()
        .then(() => {
          console.log("✅ Auto-saved on mount due to differences");
        })
        .catch((error) => {
          console.error("❌ Error auto-saving on mount:", error);
        });
    } else if (!previousSavedSnapshot) {
      // First time loading this survey, store the snapshot
      setLastSavedSnapshotToStorage(survey.id, loadedSnapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey.id, surveyId]); // Only run when survey.id or surveyId changes (i.e., when survey is loaded)

  // Auto-save functionality (disabled for now to avoid too many API calls)
  // useEffect(() => {
  //   const autoSave = setTimeout(() => {
  //     if (survey.questions.length > 0 && survey.id !== "new") {
  //       handleSave();
  //     }
  //   }, 2000);

  //   return () => clearTimeout(autoSave);
  // }, [survey]);

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

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("saving");
    try {
      const trimmedTitle = survey.title?.trim() || "";

      // Prevent saving if another survey in the same project already has this title
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
          // Ignore the current survey (when updating)
          return existingTitle === currentTitle && s.id !== survey.id;
        });

        if (hasDuplicate) {
          console.warn(
            "⚠️ Duplicate survey title detected in this project, skipping save:",
            trimmedTitle
          );
          setStatus("error");
          return;
        }
      }

      if (survey.id === "new") {
        // Create new survey
        const newSurvey = await surveysApi.createSurvey({
          title: trimmedTitle,
          description: survey.description,
          projectId: selectedProject?.id, // Include projectId if a project is selected
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

        // Update survey ID (stay on page; navigation handled by initial route)
        setSurvey((prev) => ({ ...prev, id: newSurvey.id }));
        // Store projectId for future updates
        setSurveyProjectId(newSurvey.projectId || selectedProject?.id);

        // Create questions (skip questions with empty titles - they're not ready yet)
        for (const question of survey.questions) {
          const trimmedTitle = question.title?.trim() || "";
          if (!trimmedTitle) {
            console.log("⏭️ Skipping question with empty title:", question.id);
            continue;
          }

          // Filter and map options, preserving array order as the order value
          const validOptions = question.options?.filter(opt => opt.text?.trim()) || [];
          await questionsApi.createQuestion(newSurvey.id, {
            type: mapQuestionTypeToApi(question.type),
            title: trimmedTitle,
            description: question.description,
            isRequired: question.required,
            order: question.order,
            options: validOptions.map((opt, optIndex) => ({
              text: opt.text.trim(),
              order: optIndex, // Use array index as order (0, 1, 2, ...)
            })),
          });
        }
      } else {
        // Update existing survey
        // Fetch current survey data to get projectId if we don't have it stored
        let currentProjectId = surveyProjectId;
        if (currentProjectId === undefined) {
          try {
            const currentSurveyData = await surveysApi.getSurvey(survey.id);
            currentProjectId = currentSurveyData.projectId;
            console.log("📋 Fetched projectId from backend:", currentProjectId);
            setSurveyProjectId(currentProjectId);
            
            // If the survey doesn't have a projectId but we have a selectedProject, use it
            if (!currentProjectId && selectedProject?.id) {
              console.log("📋 Survey has no projectId, using selectedProject:", selectedProject.id);
              currentProjectId = selectedProject.id;
            }
          } catch (error) {
            console.warn("Could not fetch current survey projectId, using selectedProject:", error);
            // Fallback to selectedProject if we can't fetch it
            currentProjectId = selectedProject?.id;
            console.log("📋 Using selectedProject?.id as fallback:", currentProjectId);
          }
        } else {
          console.log("📋 Using stored projectId:", currentProjectId);
          // If stored projectId is null/undefined but we have a selectedProject, use it
          if (!currentProjectId && selectedProject?.id) {
            console.log("📋 Stored projectId is empty, using selectedProject:", selectedProject.id);
            currentProjectId = selectedProject.id;
          }
        }
        
        console.log("💾 Updating survey with projectId:", currentProjectId, "surveyId:", survey.id);
        
        // Build update payload - only include projectId if it has a value
        // If projectId is undefined or null, omit it to prevent backend from clearing it
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
        
        // Only include projectId if it's a valid string (not undefined or null)
        // This prevents the backend from clearing the projectId if it's already set
        if (currentProjectId !== undefined && currentProjectId !== null) {
          updatePayload.projectId = currentProjectId;
          console.log("✅ Including projectId in update:", currentProjectId);
        } else {
          console.log("⚠️ Omitting projectId from update to preserve existing value");
        }
        
        const updatedSurvey = await surveysApi.updateSurvey(survey.id, updatePayload);
        
        // Update stored projectId from the response
        const responseProjectId = updatedSurvey.projectId;
        console.log("✅ Survey updated. Response projectId:", responseProjectId);
        if (responseProjectId !== undefined) {
          setSurveyProjectId(responseProjectId);
        }

        // Update questions
        const existingQuestions = await questionsApi.getQuestions(survey.id);

        // Create a map of existing question IDs for faster lookup
        const existingQuestionIds = new Set(existingQuestions.map(q => q.id.toLowerCase()));

        // Find questions that were deleted (exist in backend but not in local state)
        const localQuestionIds = new Set(survey.questions.map(q => q.id.toLowerCase()));
        const questionsToDelete = existingQuestions.filter(
          q => !localQuestionIds.has(q.id.toLowerCase())
        );

        // Delete removed questions from backend
        for (const questionToDelete of questionsToDelete) {
          console.log("🗑️ Deleting question from backend:", questionToDelete.id, questionToDelete.title);
          try {
            await questionsApi.deleteQuestion(survey.id, questionToDelete.id);
          } catch (error) {
            console.error("Error deleting question:", error);
            // Continue with other operations even if one delete fails
          }
        }

        // Update or create questions
        for (const question of survey.questions) {
          const trimmedTitle = question.title?.trim() || "";

          // Skip questions with empty titles (they're not ready to be saved)
          if (!trimmedTitle) {
            console.log("⏭️ Skipping question with empty title:", question.id);
            continue;
          }

          // Normalize IDs for comparison (handle GUID format differences)
          const questionIdNormalized = question.id.toLowerCase();
          const isExisting = existingQuestionIds.has(questionIdNormalized);

          if (isExisting) {
            // Update existing question
            console.log("🔄 Updating existing question:", question.id, question.title);
            await questionsApi.updateQuestion(survey.id, question.id, {
              type: mapQuestionTypeToApi(question.type),
              title: trimmedTitle,
              description: question.description,
              isRequired: question.required,
              order: question.order,
              options: (() => {
                // Filter out empty options and preserve array order
                const validOptions = question.options?.filter(opt => opt.text?.trim()) || [];
                return validOptions.map((opt, optIndex) => {
                  // For update, include id if it exists (from backend), otherwise omit it (new option)
                  const optionPayload: { text: string; order: number; id?: string } = {
                    text: opt.text.trim(),
                    order: optIndex, // Use array index as order (0, 1, 2, ...)
                  };
                  // Only include id if it looks like a backend GUID (not a local temp ID like "option_1")
                  if (opt.id && !opt.id.startsWith("option_") && opt.id.length > 20) {
                    optionPayload.id = opt.id;
                  }
                  return optionPayload;
                });
              })(),
            });
          } else {
            // Create new question
            console.log("➕ Creating new question:", question.id, question.title);
            const newQuestion = await questionsApi.createQuestion(survey.id, {
              type: mapQuestionTypeToApi(question.type),
              title: trimmedTitle,
              description: question.description,
              isRequired: question.required,
              order: question.order,
              options: (() => {
                // Filter out empty options and preserve array order
                const validOptions = question.options?.filter(opt => opt.text?.trim()) || [];
                return validOptions.map((opt, optIndex) => ({
                  text: opt.text.trim(),
                  order: optIndex, // Use array index as order (0, 1, 2, ...)
                }));
              })(),
            });

            // Update local question ID and option IDs with the ones returned from backend
            setSurvey((prev) => ({
              ...prev,
              questions: prev.questions.map((q) => {
                if (q.id === question.id) {
                  // Map local options to backend options by order/text to preserve IDs
                  const updatedOptions = q.options?.map((localOpt, index) => {
                    const backendOpt = newQuestion.options?.[index];
                    return backendOpt
                      ? { ...localOpt, id: backendOpt.id } // Use backend ID
                      : localOpt; // Fallback if no match
                  }) || [];

                  return {
                    ...q,
                    id: newQuestion.id,
                    options: updatedOptions,
                  };
                }
                return q;
              }),
            }));

            // Add to existing set so subsequent iterations know it exists
            existingQuestionIds.add(newQuestion.id.toLowerCase());
          }
        }
      }

      const now = Date.now();
      setLastSavedAt(now);
      setStatus("saved");
      
      // Update last saved snapshot after successful save
      const currentSnapshot = createSurveySnapshot(survey);
      setLastSavedSurvey(currentSnapshot);
      // Also store in localStorage for persistence across sessions
      if (survey.id !== "new") {
        setLastSavedSnapshotToStorage(survey.id, currentSnapshot);
      }
    } catch (error) {
      console.error("Error saving survey:", error);
      setStatus("error");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Set up route-based auto-save
  useRouteBasedAutoSave(survey, handleSave, lastSavedSurvey, surveyId);

  const handlePublish = async () => {
    try {
      if (survey.id === "new") {
        await handleSave();
      }
      await surveysApi.publishSurvey(survey.id);
      setSurvey((prev) => ({ ...prev, status: "published" }));
    } catch (error) {
      console.error("Error publishing survey:", error);
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
            onClick={() => navigate("/projects/dashboard")}
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
              disabled={isSaving || !survey.title?.trim()}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-3 py-1 rounded-lg text-white font-semibold text-sm transition-colors">
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="bg-[#FE5102] hover:bg-orange-600 px-3 py-1 rounded-lg text-white font-semibold text-sm transition-colors"
              onClick={handlePublish}>
              Publish
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

    </div>
  );
};

export default Questionnaires;
