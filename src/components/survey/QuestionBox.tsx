import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Question, QuestionType } from '../../types/question';
import { QUESTION_TYPES, createDefaultQuestion } from '../../utils/questionTypes';
import QuestionTypeSelector from './QuestionTypeSelector';
import QuestionInput from './QuestionInput';
import QuestionOptions from './QuestionOptions';
import QuestionToolbar from './QuestionToolbar';
import QuestionPreview from './QuestionPreview';
import DragIcon from '../../assets/icons/dragIcon.svg';

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
  const questionRef = useRef<HTMLDivElement>(null);

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
      const oldIndex = question.options.findIndex(option => option.id === active.id);
      const newIndex = question.options.findIndex(option => option.id === over.id);

      const newOptions = arrayMove(question.options, oldIndex, newIndex);
      onUpdate({ ...question, options: newOptions });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleRatingScaleChange = (ratingScale: any) => {
    onUpdate({ ...question, ratingScale });
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    disabled: isPreview,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const questionTypeConfig = QUESTION_TYPES.find(qt => qt.type === question.type);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      data-question-card
      className={`bg-white rounded-lg border border-gray-200 p-6 mb-4 relative transition-all duration-200 cursor-pointer ${
        isActive ? 'shadow-lg' : 'shadow-sm'
      } ${isDragging ? 'opacity-50 scale-105 shadow-2xl border-blue-500 z-50' : ''}`}
      onClick={handleCardClick}
    >
      {/* Drag Handle */}
      {isActive && (
        <div 
          className="absolute top-2 left-1/2 transform -translate-x-1/2 cursor-move"
          {...attributes}
          {...listeners}
        >
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
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded(!isExpanded)}
          disabled={isPreview}
        />
      </div>

      {/* Horizontal Line */}
      <div className="border-t border-[#E5E7EB] mb-3 -mx-6"></div>

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
            onDragEnd={handleOptionDragEnd}
          >
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
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Rating Scale
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                <input
                  type="number"
                  value={question.ratingScale.min}
                  onChange={(e) => handleRatingScaleChange({
                    ...question.ratingScale,
                    min: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={isPreview}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                <input
                  type="number"
                  value={question.ratingScale.max}
                  onChange={(e) => handleRatingScaleChange({
                    ...question.ratingScale,
                    max: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={isPreview}
                />
              </div>
            </div>
          </div>
        )}

        {isExpanded && questionTypeConfig?.hasMatrix && question.matrix && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Matrix Configuration
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rows</label>
                <textarea
                  value={question.matrix.rows.join('\n')}
                  onChange={(e) => handleMatrixChange({
                    ...question.matrix,
                    rows: e.target.value.split('\n').filter(row => row.trim())
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  disabled={isPreview}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Columns</label>
                <textarea
                  value={question.matrix.columns.join('\n')}
                  onChange={(e) => handleMatrixChange({
                    ...question.matrix,
                    columns: e.target.value.split('\n').filter(col => col.trim())
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  disabled={isPreview}
                />
              </div>
            </div>
          </div>
        )}

        {/* Validation Settings */}
        {isExpanded && (question.type === 'short-answer' || question.type === 'long-answer') && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Validation
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Length</label>
                <input
                  type="number"
                  value={question.validation?.minLength || ''}
                  onChange={(e) => handleValidationChange({
                    ...question.validation,
                    minLength: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={isPreview}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Length</label>
                <input
                  type="number"
                  value={question.validation?.maxLength || ''}
                  onChange={(e) => handleValidationChange({
                    ...question.validation,
                    maxLength: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
    </div>
  );
};

export default QuestionBox;
