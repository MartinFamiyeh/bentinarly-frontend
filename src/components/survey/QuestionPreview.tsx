import React from "react";
import type { Question } from "../../types/question";
import { ChevronDown, X } from "lucide-react";
import DragIcon from "../../assets/icons/drag-vertical.svg";
import Folder from "../../assets/icons/folder.svg";
import Divider from "../../assets/icons/divider.svg";
interface QuestionPreviewProps {
  question: Question;
  questionNumber: number;
  onClose: () => void;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ question, questionNumber, onClose }) => {
  const renderQuestionContent = () => {
    switch (question.type) {
      case "single-choice":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`preview_${question.id}`}
                  className="w-4 h-4 text-blue-600"
                  disabled
                />
                <span className="text-sm">{option.text}</span>
                {option.image && (
                  <img src={option.image} alt="Option" className="w-8 h-8 object-cover rounded" />
                )}
              </label>
            ))}
          </div>
        );

      case "multiple-choice":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" disabled />
                <span className="text-sm">{option.text}</span>
                {option.image && (
                  <img src={option.image} alt="Option" className="w-8 h-8 object-cover rounded" />
                )}
              </label>
            ))}
          </div>
        );

      case "short-answer":
        return (
          <input
            type="text"
            placeholder="Your answer"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled
          />
        );

      case "long-answer":
        return (
          <textarea
            placeholder="Your answer"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled
          />
        );

      case "rating-scale":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {question.ratingScale?.minLabel || "Poor"}
              </span>
              <div className="flex gap-1">
                {Array.from(
                  {
                    length: (question.ratingScale?.max || 5) - (question.ratingScale?.min || 1) + 1,
                  },
                  (_, i) => (
                    <span
                      key={i}
                      title={`${i + (question.ratingScale?.min || 1)} / ${
                        question.ratingScale?.max || 5
                      }`}
                      className="w-5 h-5 inline-flex items-center justify-center text-gray-400 text-lg"
                      aria-hidden="true">
                      ★
                    </span>
                  )
                )}
              </div>
              <span className="text-sm text-gray-600">
                {question.ratingScale?.maxLabel || "Excellent"}
              </span>
            </div>
          </div>
        );

      case "yes-no":
        return (
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name={`yesno_${question.id}`}
                className="w-4 h-4 text-blue-600"
                disabled
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name={`yesno_${question.id}`}
                className="w-4 h-4 text-blue-600"
                disabled
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        );

      case "ranking":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div
                key={option.id}
                className="rounded border border-gray-100 p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DragIcon />
                  <div className="bg-[#FE51020A] text-[#FE5102] w-6 h-6 flex items-center justify-center rounded-md font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm">{option.text}</span>
                </div>
                <div>
                  <ChevronDown color="gray" size={15} />
                </div>
              </div>
            ))}
          </div>
        );

      case "likert-scale":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{question.ratingScale?.minLabel || ""}</span>
              <div className="flex gap-4">
                {Array.from(
                  {
                    length: (question.likertScale?.max || 5) - (question.likertScale?.min || 1) + 1,
                  },
                  (_, i) => (
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium">{i + 1}</p>
                      <input
                        type="radio"
                        key={i}
                        title={`${i + (question.likertScale?.min || 1)} / ${
                          question.likertScale?.max || 5
                        }`}
                        className="w-5 h-5 inline-flex items-center justify-center text-gray-400 text-lg"
                        aria-hidden="true"
                        disabled
                      />
                    </div>
                  )
                )}
              </div>
              <span className="text-sm text-gray-600">{question.ratingScale?.maxLabel || ""}</span>
            </div>
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled
          />
        );

      case "time":
        return (
          <input
            type="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled
          />
        );

      case "email":
        return (
          <input
            type="email"
            placeholder="your.email@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled
          />
        );

      case "phone":
        return (
          <input
            type="tel"
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled
          />
        );

      case "dropdown":
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
            <option>Select an option</option>
            {question.options?.map((option) => (
              <option key={option.id}>{option.text}</option>
            ))}
          </select>
        );

      case "file-upload":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col justify-center items-center space-y-4">
            <Folder />
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
            <Divider />
            <button className="border border-[#FE5102] text-[#FE5102] px-3 py-1 rounded-lg text-xs hover:bg-gray-100">
              Browse
            </button>
          </div>
        );

      case "single-grid":
        return (
          <div className="">
            {question.matrix?.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="border-b border-gray-200">
                <div className="px-3 py-2  flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700"> {row}</span>
                  <ChevronDown size={15} color="gray" />
                </div>
                {question.matrix?.columns.map((column, colIndex) => (
                  <div key={colIndex} className="px-3 py-2 flex items-center gap-3">
                    <input
                      type="radio"
                      name={`matrix_${question.id}_${rowIndex}`}
                      className="w-4 h-4 text-blue-600"
                      disabled
                    />
                    {column}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case "multiple-grid":
        return (
          <div className="">
            {question.matrix?.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="border-b border-gray-200">
                <div className="px-3 py-2  flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700"> {row}</span>
                  <ChevronDown size={15} color="gray" />
                </div>
                {question.matrix?.columns.map((column, colIndex) => (
                  <div key={colIndex} className="px-3 py-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      name={`matrix_${question.id}_${rowIndex}`}
                      className="w-4 h-4 text-blue-600"
                      disabled
                    />
                    <span className="text-sm">{column}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case "slider-scale":
        return (
          <div className="w-full px-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{question.slider!.min}</span>
              <span>{question.slider!.max}</span>
            </div>
            <input
              type="range"
              min={question.slider!.min}
              max={question.slider!.min}
              step={question.slider!.min}
              style={{
                accentColor: "#FE5102", // modern browsers
              }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
            />
          </div>
        );

      default:
        return <div className="text-sm text-gray-500">Preview not available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h3 className="text-sm font-medium">Question Preview</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="space-y-4">
            {/* Question Title */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Q{questionNumber}. {question.title || "Untitled Question"}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {question.description && (
                <p className="text-sm text-gray-600 mb-4">{question.description}</p>
              )}

              {question.image && (
                <img
                  src={question.image}
                  alt="Question"
                  className="max-w-full h-48 object-cover rounded-md border border-gray-200 mb-4"
                />
              )}
            </div>

            {/* Question Content */}
            <div>{renderQuestionContent()}</div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default QuestionPreview;
