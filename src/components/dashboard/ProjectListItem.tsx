import React, { useState } from "react";
import Correct from "../../assets/icons/correct.png";
import Menu from "../../assets/icons/menu.png";
import { useProjects } from "../../contexts/ProjectsContext";
import { createPortal } from "react-dom";
import DeleteProject from "./DeleteProject";
import * as ApiTypes from "../../types/api";

interface ProjectListItemProps {
  project: ApiTypes.ProjectDto;
  selectedProjectId: string | null;
  isMinimized: boolean;
  onRenameRequest: (id: string, name: string) => void;
  editingProjectId: string | null;
  setEditingProjectId: (id: string | null) => void;
  editedName: string;
  setEditedName: (name: string) => void;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  selectedProjectId,
  editingProjectId,
  setEditingProjectId,
  editedName,
  setEditedName,
}) => {
  const { selectProject, renameProject } = useProjects();
  const [openProjectMenu, setOpenProjectMenu] = useState<string | null>(null);
  const [projectMenuPos, setProjectMenuPos] = useState<{
    [key: string]: { top: number; left: number } | null;
  }>({});
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);

  const handleSubMenuClick = (
    e: React.MouseEvent,
    projectId: string,
    button: HTMLButtonElement
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = button.getBoundingClientRect();
    setProjectMenuPos((prev) => ({
      ...prev,
      [projectId]: { top: rect.bottom + 4, left: rect.left },
    }));

    setOpenProjectMenu(openProjectMenu === projectId ? null : projectId);
  };

  const handleProjectRename = (id: string) => {
    if (editedName.trim() === "") {
      setEditingProjectId(null);
      return;
    }
    renameProject(id, editedName);
    setEditingProjectId(null);
  };

  const ProjectDropdownMenu = ({
    projectId,
    projectName,
  }: {
    projectId: string;
    projectName: string;
  }) =>
    openProjectMenu === projectId &&
    projectMenuPos[projectId] && (
      <Portal>
        <div
          style={{
            position: "fixed",
            top: projectMenuPos[projectId]!.top,
            left: projectMenuPos[projectId]!.left,
          }}
          className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999]">
          <div className="py-1">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setEditedName(projectName);
                setEditingProjectId(projectId);
                setOpenProjectMenu(null);
              }}>
              Rename
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setIsDeleteProjectModalOpen(true);
                setOpenProjectMenu(null);
              }}>
              Delete
            </button>
          </div>
        </div>
      </Portal>
    );

  return (
    <li key={project.id}>
      <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 relative">
        <div
          onClick={() => editingProjectId !== project.id && selectProject(project)}
          className={`cursor-pointer ${
            selectedProjectId === project.id
              ? "text-[#FE5102] font-medium"
              : "text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}>
          {editingProjectId === project.id ? (
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleProjectRename(project.id)}
              onBlur={() => handleProjectRename(project.id)}
              autoFocus
              className="border-b border-gray-300 dark:border-gray-600 focus:outline-none bg-transparent dark:text-gray-200"
            />
          ) : (
            project.name
          )}
        </div>

        <div className="flex gap-2 items-center">
          {selectedProjectId === project.id && <img src={Correct} alt="" width={15} />}
          <button
            onClick={(e) =>
              handleSubMenuClick(e, project.id, e.currentTarget as HTMLButtonElement)
            }
            className="text-gray-400 hover:text-gray-700">
            <img src={Menu} alt="" />
          </button>
          <ProjectDropdownMenu projectId={project.id} projectName={project.name} />
        </div>
      </div>

      <DeleteProject
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        projectId={project.id}
        projectName={project.name}
      />
    </li>
  );
};

export default ProjectListItem;
