import SurveyImage from "../../assets/icons/survey_file.svg";
import Menu from "../../assets/icons/more.svg";
import { formatDate } from "../../functions";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RenameSurvey from "./RenameSurvey";
import MoveSurvey from "./MoveSurvey";
import DeleteSurvey from "./DeleteSurvey";
import SurveySettings from "./SurveySettings";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useSurveysApi } from "../../services/apiClient";
import { useProjects } from "../../contexts/ProjectsContext";
import * as ApiTypes from "../../types/api";

type SurveyCardProps = {
  survey: ApiTypes.SurveyDto;
  onSurveyDeleted?: (surveyId: string) => void;
  onSurveyUpdated?: (survey: ApiTypes.SurveyDto) => void;
};

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const SurveyCard = ({ survey, onSurveyDeleted, onSurveyUpdated }: SurveyCardProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const surveysApi = useSurveysApi();
  const { selectedProject } = useProjects();
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [isRenameSurveyModalOpen, setIsRenameSurveyModalOpen] = useState(false);
  const [isMoveSurveyModalOpen, setIsMoveSurveyModalOpen] = useState(false);
  const [isDeleteSurveyModalOpen, setIsDeleteSurveyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left });
    }
    setOpen((prev) => !prev);
  };

  const handleDuplicate = async () => {
    setOpen(false);
    try {
      const newSurvey = await surveysApi.duplicateSurvey(survey.id, {
        title: `${survey.title} (Copy)`,
        projectId: selectedProject?.id,
      });
      showSnackbar("Survey duplicated successfully.", "success");
      if (onSurveyUpdated) {
        onSurveyUpdated(newSurvey);
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to duplicate survey.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await surveysApi.deleteSurvey(survey.id);
      showSnackbar("Survey deleted successfully.", "success");
      setIsDeleteSurveyModalOpen(false);
      setOpen(false);
      if (onSurveyDeleted) {
        onSurveyDeleted(survey.id);
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to delete survey.", "error");
    }
  };

  const handleClick = () => {
    navigate(`/survey/questionnaires/${survey.id}`);
  };

  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const getStatusColors = (status: ApiTypes.SurveyStatus) => {
    // SurveyStatus is a numeric type: 1 = Draft, 2 = Published/Live, 3 = Closed, 4 = Archived
    switch (status) {
      case 1: // Draft
        return { bg: "bg-[#6A6A6A0A]", text: "text-[#6A6A6A]" };
      case 2: // Published/Live
        return { bg: "bg-[#02E1090A]", text: "text-[#02E109]" };
      case 3: // Closed
        return { bg: "bg-[#FD246D0A]", text: "text-[#FD246D]" };
      case 4: // Archived
        return { bg: "bg-[#027B000A]", text: "text-[#027B00]" };
      default:
        return { bg: "bg-[#F3F4F6]", text: "text-[#4B5563]" };
    }
  };

  const { bg, text } = getStatusColors(survey.status);
  
  const getStatusLabel = (status: ApiTypes.SurveyStatus) => {
    // SurveyStatus is a numeric type: 1 = Draft, 2 = Published/Live, 3 = Closed, 4 = Archived, 5 = Paused
    const labels: Record<number, string> = {
      1: "Draft",
      2: "Published",
      3: "Closed",
      4: "Archived",
      5: "Paused",
    };
    return labels[status] || "Unknown";
  };

  const completion = `${survey.responseCount || 0}/${survey.expectedResponses || 0}`;
  const createdBy = survey.creatorName || "Unknown";
  const access = "Owner"; // TODO: Determine based on project membership

  return (
    <>
      <div 
        className="grid grid-cols-12 items-center py-4 px-6 border border-[#2929291A]/10 dark:border-gray-700 rounded-md bg-[#FFFFFF] dark:bg-gray-900 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={handleClick}
      >
        <div className="col-span-4 flex items-center gap-4">
          <SurveyImage />
          <div>
            <p className="font-medium text-sm text-[#292929] dark:text-gray-100 leading-[18px] text-nowrap w-[18rem] overflow-hidden text-ellipsis">
              {survey.title || "Untitled Survey"}
            </p>
            <p className="text-[#696969] dark:text-gray-400 text-xs">{survey.questionCount || 0} Question(s)</p>
          </div>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-[#696969] dark:text-gray-400">Completion</p>
          <p className="font-medium text-sm text-[#292929] dark:text-gray-100">{completion}</p>
        </div>
        <div className="col-span-1 flex ">
          <span className={`px-3 py-1 rounded-lg text-xs ${bg} ${text}`}>
            {getStatusLabel(survey.status)}
          </span>
        </div>
        <div className="col-span-3 ml-2">
          <p className="text-xs text-[#696969] dark:text-gray-400"> Created By</p>
          <p className="text-sm text-[#292929] dark:text-gray-100">
            <span>{createdBy}</span> | {formatDate(new Date(survey.createdAt).getTime())}
          </p>
        </div>
        <div className="col-span-1 text-gray-700">
          <p className="text-xs text-[#696969] dark:text-gray-400">Access</p>
          <p className="font-medium text-[#292929] dark:text-gray-100 text-sm">{access}</p>
        </div>
        <div className="col-span-1 text-right">
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling to parent div
              toggleMenu();
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Menu />
          </button>
        </div>
      </div>

      <RenameSurvey
        isOpen={isRenameSurveyModalOpen}
        onClose={() => setIsRenameSurveyModalOpen(false)}
        surveyId={survey.id}
        currentName={survey.title || ""}
        onRenameComplete={(updatedSurvey) => {
          if (onSurveyUpdated) {
            onSurveyUpdated(updatedSurvey);
          }
        }}
      />

      <MoveSurvey 
        isOpen={isMoveSurveyModalOpen} 
        onClose={() => setIsMoveSurveyModalOpen(false)}
        surveyId={survey.id}
        onMoveComplete={(updatedSurvey) => {
          if (onSurveyUpdated) {
            onSurveyUpdated(updatedSurvey);
          }
        }}
      />

      <DeleteSurvey
        isOpen={isDeleteSurveyModalOpen}
        onClose={() => setIsDeleteSurveyModalOpen(false)}
        surveyId={survey.id}
        surveyName={survey.title || ""}
        onDelete={handleDelete}
      />

      <SurveySettings
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        surveyId={survey.id}
        surveyStatus={survey.status}
        currentSettings={survey.settings}
        onSettingsUpdated={(updatedSurvey) => {
          if (onSurveyUpdated) {
            onSurveyUpdated(updatedSurvey);
          }
        }}
      />

      {open && (
        <Portal>
          <div
            style={{
              top: coords.top,
              left: coords.left - 200 + (buttonRef.current?.offsetWidth || 0), // align to right
            }}
            className="absolute bg-white dark:bg-gray-900 shadow-lg border dark:border-gray-700 rounded-md w-52 z-50">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-300">
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => setIsRenameSurveyModalOpen(true)}>
                Rename
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDuplicate(); }}>
                Duplicate
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setIsMoveSurveyModalOpen(true); }}>
                Move to
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setIsSettingsModalOpen(true); setOpen(false); }}>
                Settings
              </li>
              <li 
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setIsDeleteSurveyModalOpen(true); }}>
                Delete
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">Download Questionnaire</li>
            </ul>
          </div>
        </Portal>
      )}
    </>
  );
};

export default SurveyCard;
