import React from 'react';
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
  image,
  onTitleChange,
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
        <span className="text-md font-medium text-black dark:text-gray-100 mt-2">
          Q{questionNumber}.
        </span>
        <div className="flex-1 relative">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Type question here"
            className={`text-black dark:text-gray-100 w-full px-3 py-3 ${!title.trim() ? 'pr-20' : 'pr-12'} border ${!title.trim() ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'} rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={disabled}
            maxLength={200}
          />
          {/* Warning icon when title is empty */}
          {!title.trim() && (
            <div 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-amber-600"
              title="Please type a question"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
          {image ? (
            <div className={`absolute ${!title.trim() ? 'right-10' : 'right-2'} top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 w-8 h-8 rounded-md flex items-center justify-center`}>
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
            !title.trim() ? null : (
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById(`question-image-input-${questionId}`) as HTMLInputElement;
                  input?.click();
                }}
                disabled={disabled}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImgSelector />
              </button>
            )
          )}
          {title.length > 150 && (
            <p className="text-xs text-amber-600 mt-1">
              {200 - title.length} characters remaining
            </p>
          )}
          {!title.trim() && (
            <p className="text-xs text-amber-600 mt-1">
              Please type a question
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
