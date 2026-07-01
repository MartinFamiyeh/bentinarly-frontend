import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SurveyPollNavbarProps = {
  currentPage: number;
  totalPages: number;
  isPaginated: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onClearForm: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
};

const SurveyPollNavbar = ({
  currentPage,
  totalPages,
  isPaginated,
  onPrevious,
  onNext,
  onClearForm,
  canGoPrevious,
  canGoNext,
}: SurveyPollNavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-[#EEEEEE] bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/surveys/allsurveys")}
            className="shrink-0 text-[#292929] hover:opacity-70"
            aria-label="Back to surveys">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <img src="/logo.svg" alt="" className="h-6 w-6 shrink-0" />
            <span className="truncate text-base font-semibold text-[#292929]">Bentinarly Poll</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-sm">
          {isPaginated && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="flex items-center gap-0.5 font-medium text-[#696969] disabled:opacity-40 enabled:text-[#FE5102]">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-[#292929]">
                {currentPage}/{totalPages}
              </span>
              <button
                type="button"
                onClick={onNext}
                disabled={!canGoNext}
                className="flex items-center gap-0.5 font-medium text-[#696969] disabled:opacity-40 enabled:text-[#FE5102]">
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onClearForm}
            className="font-semibold text-[#FE5102] hover:opacity-80">
            Clear Forms
          </button>
        </div>
      </div>
    </header>
  );
};

export default SurveyPollNavbar;
