import React, { useRef, useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import type { Question } from "../../../types/question";
import type {
  AnswerValue,
  FileAnswerValue,
  MatrixAnswerValue,
  OtherOptionAnswerValue,
} from "../../../utils/mapSurveyAnswersToSubmission";
import Folder from "../../../assets/icons/folder.svg";
import Divider from "../../../assets/icons/divider.svg";
import DragIcon from "../../../assets/icons/drag-vertical.svg";

type SurveyQuestionInputProps = {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  onFileUpload?: (file: File) => Promise<FileAnswerValue>;
  uploading?: boolean;
};

function isOtherSelected(value: AnswerValue | undefined): OtherOptionAnswerValue | null {
  if (!value || typeof value !== "object" || Array.isArray(value) || "fileUrl" in value) {
    return null;
  }
  if ("optionId" in value) {
    return value as OtherOptionAnswerValue;
  }
  return null;
}

const SurveyQuestionInput: React.FC<SurveyQuestionInputProps> = ({
  question,
  value,
  onChange,
  onFileUpload,
  uploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const maxLength =
    question.validation?.maxLength ||
    (question.type === "short-answer" ? 150 : question.type === "long-answer" ? 1000 : undefined);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !onFileUpload) {
      return;
    }
    const uploaded = await onFileUpload(file);
    onChange(uploaded);
  };

  switch (question.type) {
    case "single-choice":
      return (
        <div className="space-y-3">
          {question.options?.map((option) => {
            const otherAnswer = isOtherSelected(value);
            const isSelected =
              otherAnswer?.optionId === option.id ||
              (typeof value === "string" && value === option.id);

            return (
              <div key={option.id} className="space-y-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name={question.id}
                    checked={isSelected}
                    onChange={() =>
                      option.isOther
                        ? onChange({ optionId: option.id, otherText: otherAnswer?.otherText || "" })
                        : onChange(option.id)
                    }
                    className="h-4 w-4 accent-[#FE5102]"
                  />
                  <span className="text-sm text-[#292929]">{option.text}</span>
                </label>
                {option.isOther && isSelected && (
                  <input
                    type="text"
                    value={otherAnswer?.otherText || ""}
                    onChange={(e) =>
                      onChange({ optionId: option.id, otherText: e.target.value })
                    }
                    placeholder="Please specify"
                    className="ml-7 w-full max-w-xs rounded-md bg-[#F3F4F6] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FE5102]/30"
                  />
                )}
              </div>
            );
          })}
        </div>
      );

    case "multiple-choice":
      return (
        <div className="space-y-3">
          {question.options?.map((option) => {
            const selected = Array.isArray(value) ? value : [];
            const checked = selected.includes(option.id);
            return (
              <label key={option.id} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange(
                      checked
                        ? selected.filter((id) => id !== option.id)
                        : [...selected, option.id]
                    )
                  }
                  className="h-4 w-4 rounded accent-[#FE5102]"
                />
                <span className="text-sm text-[#292929]">{option.text}</span>
              </label>
            );
          })}
        </div>
      );

    case "short-answer":
      return (
        <div>
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md bg-[#F3F4F6] px-4 py-3 text-sm text-[#292929] outline-none focus:ring-2 focus:ring-[#FE5102]/30"
          />
          {maxLength && (
            <p className="mt-2 text-right text-xs text-[#696969]">
              {(typeof value === "string" ? value.length : 0)}/{maxLength} Characters
            </p>
          )}
        </div>
      );

    case "long-answer":
      return (
        <div>
          <textarea
            rows={4}
            value={typeof value === "string" ? value : ""}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-none rounded-md bg-[#F3F4F6] px-4 py-3 text-sm text-[#292929] outline-none focus:ring-2 focus:ring-[#FE5102]/30"
          />
          {maxLength && (
            <p className="mt-2 text-right text-xs text-[#696969]">
              {(typeof value === "string" ? value.length : 0)}/{maxLength} Characters
            </p>
          )}
        </div>
      );

    case "yes-no":
      return (
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name={question.id}
              checked={value === true}
              onChange={() => onChange(true)}
              className="h-4 w-4 accent-[#FE5102]"
            />
            <span className="text-sm text-[#292929]">Yes</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name={question.id}
              checked={value === false}
              onChange={() => onChange(false)}
              className="h-4 w-4 accent-[#FE5102]"
            />
            <span className="text-sm text-[#292929]">No</span>
          </label>
        </div>
      );

    case "rating-scale": {
      const min = question.ratingScale?.min ?? 1;
      const max = question.ratingScale?.max ?? 5;
      const current = typeof value === "number" ? value : 0;
      return (
        <div className="flex flex-wrap items-center gap-2">
          {question.ratingScale?.minLabel && (
            <span className="text-xs text-[#696969]">{question.ratingScale.minLabel}</span>
          )}
          <div className="flex gap-1">
            {Array.from({ length: max - min + 1 }, (_, i) => {
              const rating = min + i;
              const filled = rating <= current;
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange(rating)}
                  className="p-0.5"
                  aria-label={`Rate ${rating}`}>
                  <Star
                    className={`h-7 w-7 ${filled ? "fill-[#FE5102] text-[#FE5102]" : "text-[#D1D5DB]"}`}
                  />
                </button>
              );
            })}
          </div>
          {question.ratingScale?.maxLabel && (
            <span className="text-xs text-[#696969]">{question.ratingScale.maxLabel}</span>
          )}
        </div>
      );
    }

    case "likert-scale": {
      const min = question.likertScale?.min ?? 0;
      const max = question.likertScale?.max ?? 10;
      const current = typeof value === "number" ? value : null;
      return (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {question.likertScale?.minLabel && (
            <span className="text-xs text-[#696969]">{question.likertScale.minLabel}</span>
          )}
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: max - min + 1 }, (_, i) => {
              const point = min + i;
              return (
                <label key={point} className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-[#696969]">{point}</span>
                  <input
                    type="radio"
                    name={question.id}
                    checked={current === point}
                    onChange={() => onChange(point)}
                    className="h-4 w-4 accent-[#FE5102]"
                  />
                </label>
              );
            })}
          </div>
          {question.likertScale?.maxLabel && (
            <span className="text-xs text-[#696969]">{question.likertScale.maxLabel}</span>
          )}
        </div>
      );
    }

    case "dropdown":
      return (
        <div className="relative">
          <select
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-[#E5E7EB] bg-white px-4 py-3 pr-10 text-sm text-[#292929] outline-none focus:ring-2 focus:ring-[#FE5102]/30">
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#696969]" />
        </div>
      );

    case "date":
      return (
        <input
          type="date"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FE5102]/30"
        />
      );

    case "time":
      return (
        <div className="relative">
          <input
            type="time"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Select time"
            className="w-full rounded-md border border-[#E5E7EB] bg-white px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#FE5102]/30"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#696969]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M12 7v5l3 2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      );

    case "email":
      return (
        <input
          type="email"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full rounded-md bg-[#F3F4F6] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FE5102]/30"
        />
      );

    case "phone":
      return (
        <input
          type="tel"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="+233 ..."
          className="w-full rounded-md bg-[#F3F4F6] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FE5102]/30"
        />
      );

    case "file-upload": {
      const fileValue =
        value && typeof value === "object" && !Array.isArray(value) && "fileUrl" in value
          ? (value as FileAnswerValue)
          : null;

      return (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors ${
            dragOver ? "border-[#FE5102] bg-[#FFF5F0]" : "border-[#D1D5DB]"
          }`}>
          <Folder />
          <p className="text-center text-sm text-[#696969]">
            Drag your file(s) to start uploading
            <br />
            OR
          </p>
          <Divider />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-[#FE5102] px-4 py-2 text-sm font-semibold text-[#FE5102] hover:bg-[#FFF5F0] disabled:opacity-50">
            {uploading ? "Uploading..." : "Browse files"}
          </button>
          {fileValue?.fileName && (
            <p className="text-xs text-[#292929]">{fileValue.fileName}</p>
          )}
        </div>
      );
    }

    case "slider-scale": {
      const min = question.slider?.min ?? 0;
      const max = question.slider?.max ?? 10;
      const step = question.slider?.step ?? 1;
      const current = typeof value === "number" ? value : min;
      return (
        <div className="px-1 py-2">
          <div className="mb-2 flex justify-between text-sm text-[#696969]">
            <span>{min}</span>
            <span>{max}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E5E7EB] accent-[#FE5102]"
          />
        </div>
      );
    }

    case "ranking": {
      const orderedIds = Array.isArray(value) ? value : question.options?.map((o) => o.id) || [];
      const orderedOptions = orderedIds
        .map((id) => question.options?.find((o) => o.id === id))
        .filter(Boolean);

      const moveOption = (index: number, direction: "up" | "down") => {
        const next = [...orderedIds];
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= next.length) {
          return;
        }
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
      };

      return (
        <div className="space-y-2">
          {orderedOptions.map((option, index) => (
            <div
              key={option!.id}
              className="flex items-center justify-between rounded-lg border border-[#EEEEEE] p-3">
              <div className="flex items-center gap-3">
                <DragIcon />
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FE51020A] text-sm font-medium text-[#FE5102]">
                  {index + 1}
                </div>
                <span className="text-sm text-[#292929]">{option!.text}</span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveOption(index, "up")}
                  disabled={index === 0}
                  className="rounded p-1 text-[#696969] disabled:opacity-30">
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => moveOption(index, "down")}
                  disabled={index === orderedOptions.length - 1}
                  className="rounded p-1 text-[#696969] disabled:opacity-30">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "single-grid": {
      const matrixValue =
        value && typeof value === "object" && !Array.isArray(value) && !("fileUrl" in value)
          ? (value as MatrixAnswerValue)
          : {};
      return (
        <div className="overflow-hidden rounded-lg border border-[#EEEEEE]">
          {question.matrix?.rows.map((row) => (
            <div key={row} className="border-b border-[#EEEEEE] last:border-b-0">
              <div className="flex items-center justify-between bg-[#FAFAFA] px-4 py-3">
                <span className="text-sm font-medium text-[#292929]">{row}</span>
              </div>
              <div className="space-y-2 px-4 py-3">
                {question.matrix?.columns.map((column, colIndex) => (
                  <label key={colIndex} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name={`${question.id}_${rowIndex}`}
                      checked={matrixValue[row] === column}
                      onChange={() => onChange({ ...matrixValue, [row]: column })}
                      className="h-4 w-4 accent-[#FE5102]"
                    />
                    <span className="text-sm text-[#292929]">{column}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "multiple-grid": {
      const matrixValue =
        value && typeof value === "object" && !Array.isArray(value) && !("fileUrl" in value)
          ? (value as MatrixAnswerValue)
          : {};
      return (
        <div className="overflow-hidden rounded-lg border border-[#EEEEEE]">
          {question.matrix?.rows.map((row) => (
            <div key={row} className="border-b border-[#EEEEEE] last:border-b-0">
              <div className="flex items-center justify-between bg-[#FAFAFA] px-4 py-3">
                <span className="text-sm font-medium text-[#292929]">{row}</span>
              </div>
              <div className="space-y-2 px-4 py-3">
                {question.matrix?.columns.map((column, colIndex) => {
                  const rowSelections = (matrixValue[row] as string[]) || [];
                  const checked = rowSelections.includes(column);
                  return (
                    <label key={colIndex} className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? rowSelections.filter((c) => c !== column)
                            : [...rowSelections, column];
                          onChange({ ...matrixValue, [row]: next });
                        }}
                        className="h-4 w-4 rounded accent-[#FE5102]"
                      />
                      <span className="text-sm text-[#292929]">{column}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    default:
      return <p className="text-sm text-[#696969]">This question type is not supported yet.</p>;
  }
};

export default SurveyQuestionInput;
