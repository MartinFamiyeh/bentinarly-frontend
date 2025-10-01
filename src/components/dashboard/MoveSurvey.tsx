import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { FiChevronDown, FiCheck } from "react-icons/fi";

type MoveSurveyModalProps = { isOpen: boolean; onClose: () => void };

const MoveSurvey = ({ isOpen, onClose }: MoveSurveyModalProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { projects } = useProjects();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const selectedProject = projects?.find((p) => p.id === selectedProjectId);

  const handleSubmit = () => {
    if (!selectedProjectId) {
      showSnackbar("Please select a project.", "error");
      return;
    }
    showSnackbar("Survey moved successfully.", "success");
    onClose();
  };

  const handleSelectProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsDropdownOpen(false);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 m-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        <p className="font-bold text-2xl leading-none tracking-normal">Move Survey To</p>
        <p className="text-[16px] leading-none">Choose a new project to move this survey into.</p>

        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-0 text-left flex items-center justify-between">
            <span className={selectedProject ? "text-gray-900" : "text-gray-400"}>
              {selectedProject ? selectedProject.name : "Select a project"}
            </span>
            <FiChevronDown
              className={`transition-transform duration-200 text-gray-400 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleSelectProject(project.id)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                      selectedProjectId === project.id
                        ? "bg-orange-50 text-[#FE5102] font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}>
                    <span>{project.name}</span>
                    {selectedProjectId === project.id && (
                      <FiCheck className="text-[#FE5102] w-5 h-5" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-center">No projects available</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded text-[#696969] bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded text-white bg-[#FE5102] hover:bg-orange-600 w-full transition-all duration-300">
            Move
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default MoveSurvey;
