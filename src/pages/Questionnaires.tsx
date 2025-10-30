import React, { useState, useEffect } from "react";
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
import type { Question, Survey } from "../types/question";
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

import ShareModal from "../components/survey/ShareModal";
import PreviewSurvey from "../components/survey/PreviewSurvey";

const Questionnaires: React.FC = () => {
  const [survey, setSurvey] = useState<Survey>({
    id: "survey_1",
    title: "Survey One",
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

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isPreviewSurvey, setIsPreviewSurvey] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (survey.questions.length > 0) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [survey]);

  const addQuestion = (type: any = "single-choice") => {
    const newQuestion = createDefaultQuestion(type, survey.questions.length + 1);
    setSurvey((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...updatedQuestion, order: q.order } : q
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteQuestion = (questionId: string) => {
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

      setSurvey((prev) => ({
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save to your backend
      console.log("Saving survey:", survey);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error saving survey:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await handleSave();
      setSurvey((prev) => ({ ...prev, status: "published" }));
      console.log("Survey published!", survey);
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
          <Back />
          <p className="font-semibold text-lg">Lorem Ipsium</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3">
            <Undo />
            <p className="text-[14px]">Undo</p>
          </div>
          <div className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3">
            <Redo />
            <p className="text-[14px]">Redo</p>
          </div>
          <div
            className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3 cursor-pointer"
            onClick={() => setIsPreviewSurvey(true)}>
            <Preview />
            <p className="text-[14px]">Preview</p>
          </div>
          <div
            className="flex items-center gap-2 bg-[#FAFAFA] rounded-lg py-2 px-3 cursor-pointer"
            onClick={() => setIsShareModalOpen(true)}>
            <Share />
            <p className="text-[14px]">Share</p>
          </div>
          <div>
            <button
              className="bg-[#FE5102] px-3 py-1 rounded-lg text-white font-semibold text-sm"
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
                onChange={(e) => setSurvey((prev) => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
                placeholder="Survey Title"
              />
              <input
                type="text"
                value={survey.description}
                onChange={(e) => setSurvey((prev) => ({ ...prev, description: e.target.value }))}
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

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};

export default Questionnaires;
