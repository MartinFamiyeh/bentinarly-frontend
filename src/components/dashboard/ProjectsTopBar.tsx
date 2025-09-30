import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import SortIcon from "../../assets/icons/sort.png";
import { PiCheckCircleFill } from "react-icons/pi";
import Correct from "../../assets/icons/correct.png";
import { useProjects } from "../../contexts/ProjectsContext";

type ProjectsTopBarProps = {
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
  sortOrder?: "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A";
  setSortOrder?: (order: "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A") => void;
};

const filters = ["All", "Draft", "Scheduled", "Live", "Paused", "Closed", "Completed"];

const ProjectsTopBar: React.FC<ProjectsTopBarProps> = ({
  activeFilter = "All",
  setActiveFilter = () => {},
  sortOrder = "Newest to Oldest",
  setSortOrder = () => {},
}) => {
  const { projects, selectedProject, selectProject, renameProject } = useProjects();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isEditingMainProject, setIsEditingMainProject] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSortChange = (order: typeof sortOrder) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  const handleDoubleClickMainProjectName = () => {
    if (selectedProject) {
      setIsEditingMainProject(true);
      setEditedProjectName(selectedProject.name);
      setIsProjectsDropdownOpen(false);
    }
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProjectName(e.target.value);
  };

  const handleMainProjectNameBlur = () => {
    if (selectedProject && editedProjectName.trim() !== "") {
      renameProject(selectedProject.id, editedProjectName.trim());
      // Update the selected project with the new name locally
      selectProject({ ...selectedProject, name: editedProjectName.trim() });
    }
    setIsEditingMainProject(false);
  };

  const handleProjectNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMainProjectNameBlur();
    }
    if (e.key === "Escape") {
      setIsEditingMainProject(false);
    }
  };

  useEffect(() => {
    if (isEditingMainProject && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingMainProject]);

  return (
    <div className="shadow-sm p-4 bg-white">
      <div className="flex justify-between items-center mb-3 relative">
        <div className="relative">
          <div className="flex items-center justify-between px-3 py-1">
            {isEditingMainProject ? (
              <input
                ref={inputRef}
                type="text"
                value={editedProjectName}
                onChange={handleProjectNameChange}
                onBlur={handleMainProjectNameBlur}
                onKeyDown={handleProjectNameKeyDown}
                className="font-semibold text-lg bg-transparent border-b-2 border-orange-500 focus:outline-none min-w-[200px]"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="font-semibold text-lg cursor-text select-none"
                onDoubleClick={handleDoubleClickMainProjectName}>
                {selectedProject?.name || "Select Project"}
              </span>
            )}
            <button
              className="focus:outline-none p-1 hover:bg-gray-100 rounded"
              onClick={() => setIsProjectsDropdownOpen((prev) => !prev)}>
              <FiChevronDown
                className={`transition-transform duration-200 ${
                  isProjectsDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {isProjectsDropdownOpen && (
            <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className={`px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm flex justify-between items-center ${
                      selectedProject?.id === project.id ? "bg-orange-50 font-medium" : ""
                    }`}
                    onClick={() => {
                      selectProject(project);
                      setIsProjectsDropdownOpen(false);
                    }}>
                    {project.name}
                    {selectedProject?.id === project.id && (
                      <PiCheckCircleFill className="text-orange-500" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">No projects available</div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-1 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>
      <div className="flex justify-between items-center w-full bg-white py-1">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm transition-colors ${
                activeFilter === filter
                  ? "bg-[#B148F3]/10 text-[#B148F3] font-medium"
                  : "bg-[#FAFAFA] text-[#696969] hover:bg-gray-200/40"
              }`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-1 text-sm text-[#292929] hover:text-gray-800 border-l pl-4">
           <img src={SortIcon} className="w-3 h-3"/>
            <span className="font-medium">Sort:</span> {sortOrder}
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              {["Newest to Oldest", "Oldest to Newest", "A - Z", "Z - A"].map((order) => (
                <button
                  key={order}
                  onClick={() => handleSortChange(order as typeof sortOrder)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {order}
                  {sortOrder === order && <PiCheckCircleFill className="text-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTopBar;
