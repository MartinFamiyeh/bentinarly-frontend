import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSurveysApi } from "../../services/apiClient";
import { useProjects } from "../../contexts/ProjectsContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import * as ApiTypes from "../../types/api";

type CreateSurveyModalProps = { isOpen: boolean; onClose: () => void };

const CreateSurvey = ({ isOpen, onClose }: CreateSurveyModalProps) => {
  const [name, setname] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const surveysApi = useSurveysApi();
  const { selectedProject } = useProjects();
  const { showSnackbar } = useSnackbar();

  // Log selectedProject when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("🔍 CreateSurvey modal opened. Selected project:", {
        id: selectedProject?.id,
        name: selectedProject?.name,
        fullProject: selectedProject,
      });
    }
  }, [isOpen, selectedProject]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      showSnackbar("Survey title cannot be empty.", "error");
      return;
    }

    if (!selectedProject) {
      showSnackbar("Please select a project first.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const surveyData = {
        title: name.trim(),
        description: "",
        projectId: selectedProject.id, // Assign to selected project
        settings: {
          allowAnonymous: true,
          collectEmails: false,
          shuffleQuestions: false,
          oneResponsePerPerson: true,
          showProgress: true,
          allowSaveAndContinue: false,
          requireLogin: false,
        },
        expectedResponses: 0,
        isTemplate: false,
      };

      console.log("📤 Creating survey with data:", {
        ...surveyData,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
      });

      const newSurvey = await surveysApi.createSurvey(surveyData);
      
      console.log("✅ Survey created:", {
        id: newSurvey.id,
        title: newSurvey.title,
        projectId: newSurvey.projectId,
      });

      showSnackbar("Survey created successfully!", "success");
      navigate(`/survey/questionnaires/${newSurvey.id}`);
      onClose();
    } catch (error: any) {
      console.error("❌ Error creating survey:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectId: selectedProject?.id,
      });
      showSnackbar(error.response?.data?.detail || "Failed to create survey.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        <p className="font-bold text-2xl leading-none tracking-normal">New Survey</p>
        <p className="font-medium text-[16px] leading-none">Give a name to your new survey</p>
        {selectedProject && (
          <p className="text-sm text-gray-600">
            Creating in: <span className="font-medium">{selectedProject.name}</span>
          </p>
        )}
        <input
          type="text"
          value={name || ""}
          onChange={(e) => setname(e.target.value)}
          placeholder="Survey Title"
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
            {isLoading ? "Creating..." : "Create Survey"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
