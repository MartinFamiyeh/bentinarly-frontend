import { useState } from "react";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";

type DeleteSurveyModalProps = { 
  isOpen: boolean; 
  onClose: () => void;
  surveyId: string;
  surveyName: string;
  onDelete: () => void;
};

const DeleteSurvey = ({ isOpen, onClose, surveyId, surveyName, onDelete }: DeleteSurveyModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onDelete();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 m-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        <p className="font-bold text-2xl leading-none tracking-normal">Delete Survey</p>
        <p className="text-[16px] leading-none">
          Are you sure you want to delete <span className="font-semibold">{surveyName}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded text-[#696969] bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 rounded text-white bg-[#D00808] hover:bg-red-700 w-full transition-all duration-300 disabled:opacity-50">
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteSurvey;
