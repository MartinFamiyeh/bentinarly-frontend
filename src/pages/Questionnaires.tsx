import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Question, Survey } from '../types/question';
import { createDefaultQuestion } from '../utils/questionTypes';
import QuestionBox from '../components/survey/QuestionBox';
import { Plus, Eye, Save } from 'lucide-react';

const Questionnaires: React.FC = () => {
  const [survey, setSurvey] = useState<Survey>({
    id: 'survey_1',
    title: 'Survey One',
    description: '',
    questions: [createDefaultQuestion('single-choice', 1)],
    settings: {
      allowAnonymous: true,
      collectEmails: false,
      shuffleQuestions: false,
      oneResponsePerPerson: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

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

  const addQuestion = (type: any = 'single-choice') => {
    const newQuestion = createDefaultQuestion(type, survey.questions.length + 1);
    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...updatedQuestion, order: q.order } : q
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions
        .filter(q => q.id !== questionId)
        .map((q, index) => ({ ...q, order: index + 1 })),
      updatedAt: new Date().toISOString(),
    }));
  };

  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = survey.questions.find(q => q.id === questionId);
    if (questionToDuplicate) {
      const currentIndex = survey.questions.findIndex(q => q.id === questionId);
      const duplicatedQuestion = {
        ...questionToDuplicate,
        id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: currentIndex + 2, // Insert right after the original
      };
      
      setSurvey(prev => {
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
      const oldIndex = survey.questions.findIndex(q => q.id === active.id);
      const newIndex = survey.questions.findIndex(q => q.id === over.id);

      const newQuestions = arrayMove(survey.questions, oldIndex, newIndex);
      
      // Update order numbers
      newQuestions.forEach((q, index) => {
        q.order = index + 1;
      });

      setSurvey(prev => ({
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const moveQuestionUpDown = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = survey.questions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < survey.questions.length - 1)
    ) {
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const newQuestions = arrayMove(survey.questions, currentIndex, targetIndex);
      
      // Update order numbers
      newQuestions.forEach((q, index) => {
        q.order = index + 1;
      });

      setSurvey(prev => ({
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
      console.log('Saving survey:', survey);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await handleSave();
      setSurvey(prev => ({ ...prev, status: 'published' }));
      console.log('Survey published!');
    } catch (error) {
      console.error('Error publishing survey:', error);
    }
  };

  const handleActivateQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    const isOnQuestionCard = target.closest('[data-question-card]');
    
    if (!isOnQuestionCard) {
      setActiveQuestionId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={survey.title}
                onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
                placeholder="Survey Title"
              />
              <input
                type="text"
                value={survey.description}
                onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                className="text-gray-600 bg-transparent border-none outline-none w-full mt-2"
                placeholder="Type description here"
                maxLength={100}
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '200px'
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || survey.questions.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handlePublish}
                disabled={survey.questions.length === 0}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Questions */}
        <SortableContext items={survey.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {survey.questions.map((question, index) => (
              <QuestionBox
                key={question.id}
                question={question}
                questionNumber={index + 1}
                onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                onDelete={() => deleteQuestion(question.id)}
                onDuplicate={() => duplicateQuestion(question.id)}
                onMoveUp={index > 0 ? () => moveQuestionUpDown(question.id, 'up') : undefined}
                onMoveDown={index < survey.questions.length - 1 ? () => moveQuestionUpDown(question.id, 'down') : undefined}
                isPreview={isPreviewMode}
                isActive={activeQuestionId === question.id}
                onActivate={() => handleActivateQuestion(question.id)}
              />
            ))}
          </div>
        </SortableContext>

          {/* Add Question Button */}
          {!isPreviewMode && (
            <div className="flex justify-center">
              <button
                onClick={() => addQuestion()}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {survey.questions.length === 0 && !isPreviewMode && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">Add your first question to get started</p>
            <button
              onClick={() => addQuestion()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default Questionnaires;
