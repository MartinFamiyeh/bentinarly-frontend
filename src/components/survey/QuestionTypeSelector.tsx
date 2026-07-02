import React, { useState } from 'react';
import type { QuestionType } from '../../types/question';
import { QUESTION_TYPES } from '../../utils/questionTypes';
import { ChevronDown } from 'lucide-react';

interface QuestionTypeSelectorProps {
  currentType: QuestionType;
  onTypeChange: (type: QuestionType) => void;
  disabled?: boolean;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  currentType,
  onTypeChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentTypeConfig = QUESTION_TYPES.find(qt => qt.type === currentType);

  const handleTypeSelect = (type: QuestionType) => {
    onTypeChange(type);
    setIsOpen(false);
  };

  return (
    <div className="relative ">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 border border-[#696969] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentTypeConfig?.icon && (
          typeof currentTypeConfig.icon === 'string' ? (
            <img src={currentTypeConfig.icon} alt={currentTypeConfig.label} className="w-4 h-4" />
          ) : (
            <currentTypeConfig.icon className="w-4 h-4" />
          )
        )}
        <span className=" text-[#696969] dark:text-gray-400 text-sm font-normal">{currentTypeConfig?.label}</span>
        <ChevronDown className="w-4 h-4 text-black dark:text-gray-200" />
      </button>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
            <div className="py-1">
              {QUESTION_TYPES.map((typeConfig) => (
                <button
                  key={typeConfig.type}
                  onClick={() => handleTypeSelect(typeConfig.type)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {typeof typeConfig.icon === 'string' ? (
                    <img src={typeConfig.icon} alt={typeConfig.label} className="w-4 h-4" />
                  ) : (
                    <typeConfig.icon className="w-4 h-4" />
                  )}
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {typeConfig.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {typeConfig.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionTypeSelector;
