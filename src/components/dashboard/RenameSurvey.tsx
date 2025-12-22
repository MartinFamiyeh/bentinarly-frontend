import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useSurveysApi } from "../../services/apiClient";
import * as ApiTypes from "../../types/api";

type RenameSurveyModalProps = { 
  isOpen: boolean; 
  onClose: () => void;
  surveyId: string;
  currentName: string;
  onRenameComplete?: (updatedSurvey: ApiTypes.SurveyDto) => void;
};

const RenameSurvey = ({ isOpen, onClose, surveyId, currentName, onRenameComplete }: RenameSurveyModalProps) => {
  const [name, setname] = useState<string>(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const surveysApi = useSurveysApi();

  useEffect(() => {
    if (isOpen) {
      setname(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || name === currentName) {
      onClose();
      return;
    }
    
    setIsLoading(true);
    try {
      const updatedSurvey = await surveysApi.updateSurvey(surveyId, {
        title: name.trim(),
      });
      showSnackbar("Survey renamed successfully.", "success");
      if (onRenameComplete) {
        onRenameComplete(updatedSurvey);
      }
      onClose();
    } catch (error: any) {
      showSnackbar(error.response?.data?.detail || "Failed to rename survey.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 m-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        <p className="font-bold text-2xl leading-none tracking-normal">Rename Survey</p>
        <p className="text-[16px] leading-none">
          Give <span className="font-semibold">{currentName}</span> a new name. A clear title/name helps
          you stay organized and makes it easier to find later.
        </p>
        <input
          type="text"
          value={name || ""}
          onChange={(e) => setname(e.target.value)}
          placeholder="Food Campaign"
          className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded text-[#696969] bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !name.trim()}
            className="px-6 py-2 rounded text-white bg-[#FE5102] hover:bg-orange-600 w-full transition-all duration-300 disabled:opacity-50">
            {isLoading ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RenameSurvey;
