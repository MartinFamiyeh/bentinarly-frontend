import React, { useState } from 'react';
import ImgSelector from '../../assets/icons/img_selector.svg';

interface QuestionInputProps {
  questionNumber: number;
  title: string;
  description?: string;
  image?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onImageChange: (image: string | null) => void;
  disabled?: boolean;
  questionId: string;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  questionNumber,
  title,
  description,
  image,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  disabled = false,
  questionId,
}) => {

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server and get a URL
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Question Title */}
      <div className="flex items-start gap-3">
        <span className="text-md font-medium text-black mt-2">
          Q{questionNumber}.
        </span>
        <div className="flex-1 relative">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Type question here"
            className="text-black w-full px-3 py-3 pr-12 border bg-gray-50 border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
            maxLength={200}
          />
          {image ? (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white w-8 h-8 rounded-md flex items-center justify-center">
              <img
                src={image}
                alt="Question"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
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
                const input = document.getElementById(`question-image-input-${questionId}`) as HTMLInputElement;
                input?.click();
              }}
              disabled={disabled}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImgSelector />
            </button>
          )}
          {title.length > 150 && (
            <p className="text-xs text-amber-600 mt-1">
              {200 - title.length} characters remaining
            </p>
          )}
        </div>
      </div>


      {/* Hidden Image Upload Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id={`question-image-input-${questionId}`}
        disabled={disabled}
      />
    </div>
  );
};

export default QuestionInput;
