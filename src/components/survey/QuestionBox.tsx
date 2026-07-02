import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Question, QuestionType } from "../../types/question";
import { QUESTION_TYPES, createDefaultQuestion } from "../../utils/questionTypes";
import QuestionTypeSelector from "./QuestionTypeSelector";
import QuestionInput from "./QuestionInput";
import QuestionOptions from "./QuestionOptions";
import QuestionToolbar from "./QuestionToolbar";
import QuestionPreview from "./QuestionPreview";
import DragIcon from "../../assets/icons/dragIcon.svg";
import CommentModal from "./CommentModal";

interface QuestionBoxProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isPreview?: boolean;
  questionNumber: number;
  isActive: boolean;
  onActivate: () => void;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isPreview = false,
  questionNumber,
  isActive,
  onActivate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isCommentModalOpen, setItsCommentModalOpen] = useState(false);
  // const questionRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (newType: QuestionType) => {
    const newQuestion = createDefaultQuestion(newType, question.order);
    onUpdate({
      ...newQuestion,
      id: question.id,
      title: question.title,
      required: question.required,
      image: question.image,
    });
  };

  const handleTitleChange = (title: string) => {
    onUpdate({ ...question, title });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ ...question, description });
  };

  const handleRequiredToggle = () => {
    onUpdate({ ...question, required: !question.required });
  };

  const handleImageChange = (image: string | null) => {
    onUpdate({ ...question, image: image || undefined });
  };

  const handleOptionsChange = (options: any) => {
    onUpdate({ ...question, options });
  };

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && question.options) {
      const oldIndex = question.options.findIndex((option) => option.id === active.id);
      const newIndex = question.options.findIndex((option) => option.id === over.id);

      const newOptions = arrayMove(question.options, oldIndex, newIndex);
      onUpdate({ ...question, options: newOptions });
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleRatingScaleChange = (ratingScale: any) => {
    onUpdate({ ...question, ratingScale });
  };

  const handleLikertScaleChange = (likertScale: any) => {
    onUpdate({ ...question, likertScale });
  };

  const handleSliderChange = (slider: any) => {
    onUpdate({ ...question, slider });
  };

  const handleDateFormatChange = (dateSettings: any) => {
    onUpdate({ ...question, dateSettings });
  };

  const handleTimeFormatChange = (timeSettings: any) => {
    onUpdate({ ...question, timeSettings });
  };

  const handleMatrixChange = (matrix: any) => {
    onUpdate({ ...question, matrix });
  };

  const handleValidationChange = (validation: any) => {
    onUpdate({ ...question, validation });
  };

  const handleCardClick = () => {
    onActivate();
  };

  // @dnd-kit sortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
    disabled: isPreview,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const questionTypeConfig = QUESTION_TYPES.find((qt) => qt.type === question.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-question-card
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-4 relative transition-all duration-200 cursor-pointer ${
        isActive ? "shadow-lg" : "shadow-sm"
      } ${isDragging ? "opacity-50 scale-105 shadow-2xl border-blue-500 z-50" : ""}`}
      onClick={handleCardClick}>
      {/* Drag Handle */}
      {isActive && (
        <div
          className="absolute top-2 left-1/2 transform -translate-x-1/2 cursor-move"
          {...attributes}
          {...listeners}>
          <DragIcon />
        </div>
      )}

      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <QuestionTypeSelector
            currentType={question.type}
            onTypeChange={handleTypeChange}
            disabled={isPreview}
          />
        </div>

        <QuestionToolbar
          question={question}
          onRequiredToggle={handleRequiredToggle}
          onPreview={() => setShowPreview(!showPreview)}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onOpenComment={() => setItsCommentModalOpen(true)}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded(!isExpanded)}
          disabled={isPreview}
        />
      </div>

      {/* Horizontal Line */}
      <div className="border-t border-[#E5E7EB] dark:border-gray-700 mb-3 -mx-6"></div>

      {/* Question Content */}
      <div className="space-y-4">
        <QuestionInput
          questionNumber={questionNumber}
          title={question.title}
          description={question.description}
          image={question.image}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onImageChange={handleImageChange}
          disabled={isPreview}
          questionId={question.id}
        />

        {/* Question Type Specific Inputs */}
        {isExpanded && questionTypeConfig?.hasOptions && question.options && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleOptionDragEnd}>
            <QuestionOptions
              options={question.options}
              questionType={question.type}
              onOptionsChange={handleOptionsChange}
              disabled={isPreview}
              isActive={isActive}
              questionId={question.id}
            />
          </DndContext>
        )}

        {isExpanded && questionTypeConfig?.hasRating && question.ratingScale && (
          <div className="ml-8">
            <select
              value={question.ratingScale.max}
              onChange={(e) =>
                handleRatingScaleChange({
                  min: 1,
                  max: parseInt(e.target.value),
                })
              }
              className="text-black dark:text-gray-100 px-3 py-3 pr-12 border bg-[#F9F9F9] dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPreview}>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5} selected>
                5 Stars
              </option>
              <option value={6}>6 Stars</option>
              <option value={7}>7 Stars</option>
              <option value={8}>8 Stars</option>
              <option value={9}>9 Stars</option>
              <option value={10}>10 Stars</option>
            </select>
          </div>
        )}

        {isExpanded && questionTypeConfig?.hasRating && question.likertScale && (
          <div className="ml-8 space-y-3">
            <div className="flex gap-4 items-center">
              <select
                value={question.likertScale.min}
                onChange={(e) =>
                  handleLikertScaleChange({
                    ...question.likertScale,
                    min: parseInt(e.target.value),
                  })
                }
                className="text-black dark:text-gray-100 px-3 py-3 pr-12 border bg-[#F9F9F9] dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPreview}>
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
              <p>to</p>
              <select
                value={question.likertScale.max}
                onChange={(e) =>
                  handleLikertScaleChange({
                    ...question.likertScale,
                    max: parseInt(e.target.value),
                  })
                }
                className="text-black dark:text-gray-100 px-3 py-3 pr-12 border bg-[#F9F9F9] dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPreview}>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select>
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={question.likertScale?.minLabel}
                onChange={(e) =>
                  handleLikertScaleChange({
                    ...question.likertScale,
                    minLabel: e.target.value,
                  })
                }
                placeholder="Label for min (optional)"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
              />
              <p>to</p>
              <input
                type="text"
                value={question.likertScale?.maxLabel}
                onChange={(e) =>
                  handleLikertScaleChange({
                    ...question.likertScale,
                    maxLabel: e.target.value,
                  })
                }
                placeholder="Label for max (optional)"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
              />
            </div>
          </div>
        )}

        {isExpanded && questionTypeConfig?.hasRating && question.slider && (
          <div className="ml-8 space-y-3">
            <div className="flex gap-4 items-center">
              <input
                type="number"
                value={question.slider?.min}
                onChange={(e) =>
                  handleSliderChange({
                    ...question.slider,
                    min: e.target.value,
                  })
                }
                placeholder="Minimun value"
                className="w-[10rem] px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
              />
              <p>,</p>
              <input
                type="number"
                value={question.slider?.max}
                onChange={(e) =>
                  handleSliderChange({
                    ...question.slider,
                    max: e.target.value,
                  })
                }
                placeholder="Maximum Value"
                className="w-[10rem] px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
              />
              <p>, increase step by</p>
              <input
                type="number"
                value={question.slider?.step}
                onChange={(e) =>
                  handleSliderChange({
                    ...question.slider,
                    step: e.target.value,
                  })
                }
                placeholder="Maximum Value"
                className="w-[5rem] px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
              />
            </div>
          </div>
        )}

        {isExpanded && question.type === "date" && (
          <div className="ml-8">
            <select
              value={question.dateSettings?.format || "YYYY-MM-DD"}
              onChange={(e) =>
                handleDateFormatChange({
                  format: e.target.value,
                })
              }
              className="text-black dark:text-gray-100 px-3 py-3 pr-12 border bg-[#F9F9F9] dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPreview}>
              <option value="dmy" selected>
                Day, Month, Year
              </option>
              <option value="my">Month, Year</option>
              <option value="md">Month, Day</option>
              <option value="y">Year</option>
              <option value="range">Date Range</option>
            </select>
          </div>
        )}

        {isExpanded && question.type === "time" && (
          <div className="ml-8">
            <select
              value={question.timeSettings?.format}
              onChange={(e) =>
                handleTimeFormatChange({
                  format: e.target.value,
                })
              }
              className="text-black dark:text-gray-100 px-3 py-3 pr-12 border bg-[#F9F9F9] dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPreview}>
              <option value="12" selected>
                12 hours
              </option>
              <option value="24">24 hours</option>
            </select>
          </div>
        )}

        {isExpanded && questionTypeConfig?.hasMatrix && question.matrix && (
          <div className="space-y-3">
            <div className="flex gap-4">
              {/* Rows Section */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Rows</label>
                <div className="space-y-2">
                  {question.matrix.rows.map((row, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={row}
                        onChange={(e) => {
                          const newRows = [...question.matrix!.rows];
                          newRows[index] = e.target.value;
                          handleMatrixChange({
                            ...question.matrix,
                            rows: newRows,
                          });
                        }}
                        placeholder={`Row ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
                        disabled={isPreview}
                      />
                      {!isPreview && question.matrix!.rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newRows = question.matrix?.rows.filter((_, i) => i !== index);
                            handleMatrixChange({
                              ...question.matrix,
                              rows: newRows,
                            });
                          }}
                          className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Remove row">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {!isPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        handleMatrixChange({
                          ...question.matrix,
                          rows: [...question.matrix!.rows, ""],
                        });
                      }}
                      className="text-sm font-semibold hover:text-gray-600 dark:hover:text-gray-300 dark:text-gray-200">
                      Add Row
                    </button>
                  )}
                </div>
              </div>

              {/* Columns Section */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Columns</label>
                <div className="space-y-2">
                  {question.matrix.columns.map((column, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={column}
                        onChange={(e) => {
                          const newColumns = [...question.matrix!.columns];
                          newColumns[index] = e.target.value;
                          handleMatrixChange({
                            ...question.matrix,
                            columns: newColumns,
                          });
                        }}
                        placeholder={`Column ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
                        disabled={isPreview}
                      />
                      {!isPreview && question.matrix!.columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newColumns = question?.matrix?.columns?.filter(
                              (_, i) => i !== index
                            );
                            handleMatrixChange({
                              ...question.matrix,
                              columns: newColumns,
                            });
                          }}
                          className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Remove column">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {!isPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        handleMatrixChange({
                          ...question.matrix,
                          columns: [...question.matrix!.columns, ""],
                        });
                      }}
                      className="text-sm font-semibold hover:text-gray-600 dark:hover:text-gray-300 dark:text-gray-200">
                      Add column
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Settings */}
        {isExpanded && (question.type === "short-answer" || question.type === "long-answer") && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Validation</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Min Length</label>
                <input
                  type="number"
                  value={question.validation?.minLength || ""}
                  onChange={(e) =>
                    handleValidationChange({
                      ...question.validation,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
                  disabled={isPreview}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max Length</label>
                <input
                  type="number"
                  value={question.validation?.maxLength || ""}
                  onChange={(e) =>
                    handleValidationChange({
                      ...question.validation,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm"
                  disabled={isPreview}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <QuestionPreview
          question={question}
          questionNumber={questionNumber}
          onClose={() => setShowPreview(false)}
        />
      )}

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setItsCommentModalOpen(false)}
        onDelete={() => {}}
        onResolve={() => {}}
      />
    </div>
  );
};

export default QuestionBox;
