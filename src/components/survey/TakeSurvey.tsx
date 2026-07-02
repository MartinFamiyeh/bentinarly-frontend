import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SurveyPreviewPage = () => {
  const [surveyData] = useState({
    id: "survey_1",
    title: "Survey One",
    description: "",
    questions: [
      {
        id: "question_1762166934738_mvhf93usa",
        type: "single-choice",
        title: "What do we have here",
        required: false,
        order: 1,
        validation: {},
        options: [
          { id: "option_1", text: "Option 1", isOther: false },
          { id: "option_2", text: "Option 2", isOther: false },
        ],
      },
      {
        id: "question_1762166967250_xropuch5c",
        type: "multiple-choice",
        title: "What do we have here",
        required: false,
        order: 2,
        validation: {},
        options: [
          { id: "option_1", text: "Option 1", isOther: false },
          { id: "option_2", text: "Option 2", isOther: false },
        ],
      },
      {
        id: "question_1762166970776_c73yi1rze",
        type: "short-answer",
        title: "What do we have here",
        required: false,
        order: 3,
        validation: { maxLength: 100 },
      },
      {
        id: "question_1762166975119_n5w9ek5ty",
        type: "long-answer",
        title: "What do we have here",
        required: false,
        order: 4,
        validation: { maxLength: 1000 },
      },
      {
        id: "question_1762166978034_gsx12ou76",
        type: "yes-no",
        title: "What do we have here",
        required: false,
        order: 5,
        validation: {},
        options: [
          { id: "yes", text: "Yes" },
          { id: "no", text: "No" },
        ],
      },
      {
        id: "question_1762166981684_h211t90n0",
        type: "rating-scale",
        title: "What do we have here",
        required: false,
        order: 6,
        validation: {},
        ratingScale: {
          min: 1,
          max: 5,
          minLabel: "Poor",
          maxLabel: "Excellent",
          step: 1,
        },
      },
      {
        id: "question_1762166986584_xw9i5kvb8",
        type: "ranking",
        title: "What do we have here",
        required: false,
        order: 7,
        validation: {},
        options: [
          { id: "option_1", text: "Option 1", isOther: false },
          { id: "option_2", text: "Option 2", isOther: false },
        ],
      },
      {
        id: "question_1762166992205_f4xfz9ft9",
        type: "likert-scale",
        title: "What do we have here",
        required: false,
        order: 8,
        validation: {},
        likertScale: {
          min: 0,
          max: 10,
          step: 1,
          minLabel: "",
          maxLabel: "",
        },
      },
      {
        id: "question_1762166997730_33wz59742",
        type: "dropdown",
        title: "What do we have here",
        required: false,
        order: 9,
        validation: {},
        options: [
          { id: "option_1", text: "Option 1", isOther: false },
          { id: "option_2", text: "Option 2", isOther: false },
        ],
      },
      {
        id: "question_1762167003076_9dpq9k1jo",
        type: "file-upload",
        title: "What do we have here",
        required: false,
        order: 10,
        validation: {},
        fileSettings: {
          maxFiles: 1,
          allowedTypes: ["image/*", "application/pdf"],
          maxSizeMB: 10,
        },
      },
      {
        id: "question_1762167010612_yfwm9puvh",
        type: "single-grid",
        title: "What do we have here",
        required: false,
        order: 11,
        validation: {},
        matrix: {
          rows: ["Row 1", "row 2"],
          columns: ["Column 1"],
        },
      },
      {
        id: "question_1762167015130_qvbw4mtmw",
        type: "multiple-grid",
        title: "What do we have here",
        required: false,
        order: 12,
        validation: {},
        matrix: {
          rows: ["Row 1"],
          columns: ["Column 1"],
        },
      },
      {
        id: "question_1762167023848_zv2pz6hkm",
        type: "slider-scale",
        title: "What do we have here",
        required: false,
        order: 13,
        validation: {},
        slider: {
          min: 0,
          max: 10,
          step: 1,
          minLabel: "",
          maxLabel: "",
        },
      },
      {
        id: "question_1762167029554_dy3fj7d1i",
        type: "date",
        title: "What do we have here",
        required: false,
        order: 14,
        validation: {},
        dateSettings: { format: "YYYY-MM-DD" },
      },
      {
        id: "question_1762167033498_iks6m2tt7",
        type: "time",
        title: "What do we have here",
        required: false,
        order: 15,
        validation: {},
        timeSettings: { format: "HH:mm" },
      },
    ],
  });

  const renderQuestionContent = (question: any) => {
    switch (question.type) {
      case "single-choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option: any) => (
              <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={`preview_${question.id}`}
                  className="w-4 h-4 text-orange-600"
                />
                <span className="text-sm">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case "multiple-choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option: any) => (
              <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                <span className="text-sm">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case "short-answer":
        return (
          <input
            type="text"
            placeholder="Your answer"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        );

      case "long-answer":
        return (
          <textarea
            placeholder="Your answer"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        );

      case "rating-scale":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 min-w-fit">
                {question.ratingScale?.minLabel || "Poor"}
              </span>
              <div className="flex gap-2">
                {Array.from(
                  {
                    length: (question.ratingScale?.max || 5) - (question.ratingScale?.min || 1) + 1,
                  },
                  (_, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 text-2xl hover:text-orange-500 transition-colors">
                      ★
                    </button>
                  )
                )}
              </div>
              <span className="text-sm text-gray-600 min-w-fit">
                {question.ratingScale?.maxLabel || "Excellent"}
              </span>
            </div>
          </div>
        );

      case "yes-no":
        return (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name={`yesno_${question.id}`}
                className="w-4 h-4 text-orange-600"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name={`yesno_${question.id}`}
                className="w-4 h-4 text-orange-600"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        );

      case "ranking":
        return (
          <div className="space-y-2">
            {question.options?.map((option: any, index: any) => (
              <div
                key={option.id}
                className="rounded border border-gray-200 p-3 flex items-center justify-between hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 text-orange-600 w-7 h-7 flex items-center justify-center rounded-md font-medium text-sm">
                    {index + 1}
                  </div>
                  <span className="text-sm">{option.text}</span>
                </div>
                <ChevronDown className="text-gray-400" size={16} />
              </div>
            ))}
          </div>
        );

      case "likert-scale":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 min-w-fit">
                {question.likertScale?.minLabel || ""}
              </span>
              <div className="flex gap-3">
                {Array.from(
                  {
                    length:
                      (question.likertScale?.max || 10) - (question.likertScale?.min || 0) + 1,
                  },
                  (_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-gray-600">
                        {i + (question.likertScale?.min || 0)}
                      </span>
                      <input type="radio" className="w-5 h-5 text-orange-600 cursor-pointer" />
                    </div>
                  )
                )}
              </div>
              <span className="text-sm text-gray-600 min-w-fit">
                {question.likertScale?.maxLabel || ""}
              </span>
            </div>
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        );

      case "time":
        return (
          <input
            type="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        );

      case "dropdown":
        return (
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>Select an option</option>
            {question.options?.map((option: any) => (
              <option key={option.id}>{option.text}</option>
            ))}
          </select>
        );

      case "file-upload":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col justify-center items-center space-y-4 hover:border-gray-400 transition-colors">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">
              Max file size: {question.fileSettings?.maxSizeMB || 10}MB
            </p>
            <button className="border border-orange-600 text-orange-600 px-4 py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">
              Browse Files
            </button>
          </div>
        );

      case "single-grid":
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {question.matrix?.rows.map((row: any, rowIndex: any) => (
              <div key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{row}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="px-4 py-3 space-y-2">
                  {question.matrix?.columns.map((column: any, colIndex: any) => (
                    <label key={colIndex} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`matrix_${question.id}_${rowIndex}`}
                        className="w-4 h-4 text-orange-600"
                      />
                      <span className="text-sm">{column}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "multiple-grid":
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {question.matrix?.rows.map((row: any, rowIndex: any) => (
              <div key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{row}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="px-4 py-3 space-y-2">
                  {question.matrix?.columns.map((column: any, colIndex: any) => (
                    <label key={colIndex} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                      <span className="text-sm">{column}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "slider-scale":
        return (
          <div className="w-full px-2 py-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{question.slider?.min}</span>
              <span>{question.slider?.max}</span>
            </div>
            <input
              type="range"
              min={question.slider?.min}
              max={question.slider?.max}
              step={question.slider?.step}
              defaultValue={question.slider?.min}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
              style={{ accentColor: "#FE5102" }}
            />
          </div>
        );

      default:
        return <div className="text-sm text-gray-500">Preview not available</div>;
    }
  };

  return (
    <div className="h-screen bg-gray-50 py-8 px-4 overflow-y-scroll">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{surveyData.title}</h1>
          {surveyData.description && <p className="text-gray-600">{surveyData.description}</p>}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {surveyData.questions
            .sort((a, b) => a.order - b.order)
            .map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                  <label className="block text-base font-medium text-gray-900 mb-2">
                    Q{index + 1}. {question.title || "Untitled Question"}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {question.title && (
                    <p className="text-sm text-gray-600 mb-4">{question.title}</p>
                  )}
                </div>
                <div>{renderQuestionContent(question)}</div>
              </div>
            ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm">
            Submit Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyPreviewPage;
