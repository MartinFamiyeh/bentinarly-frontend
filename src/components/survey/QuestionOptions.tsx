import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { QuestionOption, QuestionType } from '../../types/question';
import ImgSelector from '../../assets/icons/img_selector.svg';
import Close from '../../assets/icons/close.svg';
import OptionDrag from '../../assets/icons/option_drag.svg';

interface OptionItemProps {
  option: QuestionOption;
  index: number;
  options: QuestionOption[];
  onUpdate: (optionId: string, updates: Partial<QuestionOption>) => void;
  onRemove: (optionId: string) => void;
  disabled?: boolean;
  isActive?: boolean;
  questionId: string;
}

interface QuestionOptionsProps {
  options: QuestionOption[];
  questionType: QuestionType;
  onOptionsChange: (options: QuestionOption[]) => void;
  disabled?: boolean;
  isActive?: boolean;
  questionId: string;
}

const OptionItem: React.FC<OptionItemProps> = ({
  option,
  index,
  options,
  onUpdate,
  onRemove,
  disabled = false,
  isActive = false,
  questionId,
}) => {
  // @dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: option.id,
    disabled: disabled || !isActive,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleImageUpload = (optionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpdate(optionId, { image: imageUrl });
    }
  };

  const handleRemoveImage = (optionId: string) => {
    onUpdate(optionId, { image: undefined });
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 ${
        isDragging ? 'opacity-50 scale-105 shadow-2xl border-blue-500 z-50' : ''
      } ${!isActive ? 'ml-8' : ''}`}
    >
      {/* Drag Handle */}
      {isActive && (
        <div 
          className="cursor-move ml-2"
          {...attributes}
          {...listeners}
        >
          <OptionDrag />
        </div>
      )}

      {/* Option Input */}
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={option.text}
            onChange={(e) => onUpdate(option.id, { text: e.target.value })}
            placeholder={`Option ${index + 1}`}
            className="text-black w-full px-3 py-2 pr-12 placeholder-[#696969] bg-gray-50 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
            maxLength={100}
          />
          
          {option.image ? (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white w-8 h-8 rounded-md flex items-center justify-center">
              <img
                src={option.image}
                alt="Option"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(option.id)}
                disabled={disabled}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(`image-${questionId}-${option.id}`) as HTMLInputElement;
                input?.click();
              }}
              disabled={disabled}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImgSelector />
            </button>
          )}
          
          <input
            id={`image-${questionId}-${option.id}`}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(option.id, e)}
            className="hidden"
            disabled={disabled}
          />
        </div>

        {/* Remove Option Button */}
        {options.length > 1 && isActive && (
          <button
            type="button"
            onClick={() => onRemove(option.id)}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Close />
          </button>
        )}
      </div>
    </div>
  );
};

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  onOptionsChange,
  disabled = false,
  isActive = false,
  questionId,
}) => {
  const addOption = () => {
    const newOption: QuestionOption = {
      id: `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: `Option ${options.length + 1}`,
      isOther: false,
    };
    
    // Find the index of the first "Other" option
    const otherIndex = options.findIndex(option => option.isOther);
    
    if (otherIndex === -1) {
      // No "Other" option exists, add at the end
      onOptionsChange([...options, newOption]);
    } else {
      // Insert before the first "Other" option
      const newOptions = [...options];
      newOptions.splice(otherIndex, 0, newOption);
      onOptionsChange(newOptions);
    }
  };

  const addOtherOption = () => {
    const otherOption: QuestionOption = {
      id: `option_other_${Date.now()}`,
      text: 'Other',
      isOther: true,
    };
    onOptionsChange([...options, otherOption]);
  };

  const updateOption = (optionId: string, updates: Partial<QuestionOption>) => {
    const updatedOptions = options.map(option =>
      option.id === optionId ? { ...option, ...updates } : option
    );
    onOptionsChange(updatedOptions);
  };

  const removeOption = (optionId: string) => {
    if (options.length > 1) {
      onOptionsChange(options.filter(option => option.id !== optionId));
    }
  };


  const handleImageUpload = (optionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateOption(optionId, { image: imageUrl });
    }
  };

  const handleRemoveImage = (optionId: string) => {
    updateOption(optionId, { image: undefined });
  };

  return (
    <div className="space-y-3">
      <SortableContext items={options.map(o => o.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {options.map((option, index) => (
            <OptionItem
              key={option.id}
              option={option}
              index={index}
              options={options}
            onUpdate={updateOption}
            onRemove={removeOption}
            disabled={disabled}
              isActive={isActive}
              questionId={questionId}
            />
          ))}
        </div>
      </SortableContext>

      {/* Add Options */}
      {isActive && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            type="button"
            onClick={addOption}
            disabled={disabled || options.length >= 20}
            className="flex items-center gap-1 px-2 py-1 text-[#292929] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#FE5102]"
          >
            Add Option
          </button>
          
          <span>or</span>
          
          <button
            type="button"
            onClick={addOtherOption}
            disabled={disabled || options.some(opt => opt.isOther)}
            className="px-2 py-1 text-[#292929] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#FE5102]"
          >
            Add Other
          </button>
        </div>
      )}

      {options.length >= 20 && (
        <p className="text-xs text-amber-600">
          Maximum 20 options allowed
        </p>
      )}
    </div>
  );
};

export default QuestionOptions;
