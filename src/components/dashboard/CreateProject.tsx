import { useState } from "react";
import { useProjects } from "../../contexts/ProjectsContext";
import { useProjectsApi } from "../../services/apiClient";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useLoading } from "../../contexts/LoadingContext";

type CreateProjectModalProps = { isOpen: boolean; onClose: () => void };

const CreateProject = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { addProject } = useProjects();
  const projectsApi = useProjectsApi();
  const { showSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      showSnackbar("Project name cannot be empty.", "error");
      return;
    }

    setLoading(true);
    showLoading();
    try {
      const newProject = await projectsApi.createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      addProject(newProject);
      showSnackbar("Project created successfully!", "success");
      setName("");
      setDescription("");
      onClose();
    } catch (error: any) {
      console.error("Failed to create project:", error);
      showSnackbar(error.response?.data?.detail || "Failed to create project.", "error");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        <p className="font-bold text-2xl leading-none tracking-normal">New Project</p>
        <p className="font-medium text-[16px] leading-none">Give a name your new project</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description (optional)"
          rows={3}
          className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded text-[#696969] bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="px-6 py-2 rounded text-white bg-[#FE5102] hover:bg-orange-600 w-full transition-all duration-300 disabled:opacity-50">
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
