import { useProjects } from "../../contexts/ProjectsContext";
import { useSnackbar } from "../../contexts/SnackbarContext";

type DeleteProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectName: string;
};

const DeleteProject = ({ isOpen, onClose, projectId, projectName }: DeleteProjectModalProps) => {
  const { removeProject } = useProjects();
  const { showSnackbar } = useSnackbar();

  if (!isOpen) return null;

  const handleDelete = () => {
    removeProject(projectId);
    showSnackbar("Project deleted successfully.", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        <p className="font-bold text-2xl leading-none tracking-normal">Delete Project?</p>
        <p className="text-[16px] leading-none">
          Please confirm if you want to delete "<span className="font-semibold">{projectName}</span>
          ". NB: Once deleted, your action cannot be undone, you will lose all surveys within this
          project
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded text-[#696969] bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 rounded text-white bg-[#D00808] hover:bg-red-500 w-full transition-all duration-300">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
