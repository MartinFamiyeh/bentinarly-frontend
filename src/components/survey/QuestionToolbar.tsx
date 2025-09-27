import React from 'react';
import type { Question } from '../../types/question';
import Required_Default from "../../assets/icons/required_default.svg";
import Required_Active from "../../assets/icons/required_active.svg";
import Logic_Default from "../../assets/icons/logic_default.svg";
import Logic_Active from "../../assets/icons/logic_active.svg";
import Comment_Default from "../../assets/icons/comment_default.svg";
import Comment_Active from "../../assets/icons/comment_active.svg";
import Hide_Default from "../../assets/icons/hide_default.svg";
import Hide_Active from "../../assets/icons/hide_active.svg";
import Duplicate_Default from "../../assets/icons/duplicate_default.svg";
import Delete_Default from "../../assets/icons/delete_default.svg";
import Arrow_Down from "../../assets/icons/arrow_down.svg"
import Arrow_Up from "../../assets/icons/arrow_up.svg"
import More from "../../assets/icons/more.svg"



interface ToolbarBtnProps {
  defaultIcon: string | React.ComponentType<any>;
  activeIcon?: string | React.ComponentType<any>;
  isActive?: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

const ToolbarBtn: React.FC<ToolbarBtnProps> = ({
  defaultIcon,
  activeIcon,
  isActive = false,
  onClick,
  label,
  disabled = false,
  className = '',
}) => {
  const IconToRender = isActive && activeIcon ? activeIcon : defaultIcon;
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={label}
    >
      {typeof IconToRender === 'string' ? (
        <img src={IconToRender} alt={label} className="w-4 h-4" style={{ imageRendering: 'crisp-edges' }} />
      ) : (
        <IconToRender className="w-4 h-4" />
      )}
    </button>
  );
};

interface QuestionToolbarProps {
  question: Question;
  onRequiredToggle: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  disabled?: boolean;
}

const QuestionToolbar: React.FC<QuestionToolbarProps> = ({
  question,
  onRequiredToggle,
  onPreview,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isExpanded,
  onToggleExpanded,
  disabled = false,
}) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete();
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Required Toggle */}
      <ToolbarBtn
        defaultIcon={Required_Default}
        activeIcon={Required_Active}
        isActive={question.required}
        onClick={onRequiredToggle}
        label={question.required ? 'Required' : 'Make Required'}
        disabled={disabled}
        className={question.required 
          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }
      />

      {/* Branching Logic */}
      <ToolbarBtn
        defaultIcon={Logic_Default}
        activeIcon={Logic_Active}
        onClick={() => {}}
        label="Add Branching Logic"
        disabled={disabled}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      />

      {/* Comments */}
      <ToolbarBtn
        defaultIcon={Comment_Default}
        activeIcon={Comment_Active}
        onClick={() => {}}
        label="Add Comments"
        disabled={disabled}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      />

      {/* Preview */}
      <ToolbarBtn
        defaultIcon={Hide_Default}
        activeIcon={Hide_Active}
        onClick={onPreview}
        label="Preview Question"
        disabled={disabled}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      />

      {/* Duplicate */}
      <ToolbarBtn
        defaultIcon={Duplicate_Default}
        onClick={onDuplicate}
        label="Duplicate Question"
        disabled={disabled}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      />

      {/* Delete */}
      <ToolbarBtn
        defaultIcon={Delete_Default}
        onClick={handleDelete}
        label="Delete Question"
        disabled={disabled}
        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
      />

      {/* More Options */}
      <ToolbarBtn
        defaultIcon={More}
        onClick={() => {}}
        label="More Options"
        disabled={disabled}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      />

      {/* Expand/Collapse */}
      <ToolbarBtn
        defaultIcon={isExpanded ? Arrow_Down : Arrow_Up}
        onClick={onToggleExpanded}
        label={isExpanded ? 'Collapse' : 'Expand'}
        disabled={disabled}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      />
    </div>
  );
};

export default QuestionToolbar;
