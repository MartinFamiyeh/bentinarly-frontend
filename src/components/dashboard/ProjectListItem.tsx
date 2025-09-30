import React, { useState, useRef } from "react";
import Correct from "../../assets/icons/correct.png";
import Menu from "../../assets/icons/menu.png";
import { useProjects } from "../../contexts/ProjectsContext";
import { createPortal } from "react-dom";
import DeleteProject from "./DeleteProject";

type SurveyType = {
  id: string;
  name: string;
  members: number;
  status: "draft" | "scheduled" | "live" | "paused" | "closed" | "completed";
  createdAt: number;
};

type ProjectType = {
  id: number;
  name: string;
  surveys: SurveyType[] | null;
};

interface ProjectListItemProps {
  project: ProjectType;
  selectedProjectId: number | null;
  isMinimized: boolean;
  onRenameRequest: (id: number, name: string) => void;
  editingProjectId: number | null;
  setEditingProjectId: (id: number | null) => void;
  editedName: string;
  setEditedName: (name: string) => void;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  selectedProjectId,
  isMinimized,
  onRenameRequest,
  editingProjectId,
  setEditingProjectId,
  editedName,
  setEditedName,
}) => {
  const { selectProject, renameProject, removeProject } = useProjects();
  const [openProjectMenu, setOpenProjectMenu] = useState<number | null>(null);
  const [projectMenuPos, setProjectMenuPos] = useState<{
    [key: number]: { top: number; left: number } | null;
  }>({});
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);

  const handleSubMenuClick = (
    e: React.MouseEvent,
    projectId: number,
    projectName: string,
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

  const handleProjectRename = (id: number) => {
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
    projectId: number;
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
          className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
          <div className="py-1">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setEditedName(projectName);
                setEditingProjectId(projectId);
                setOpenProjectMenu(null);
              }}>
              Rename
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
      <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-100 relative">
        <div
          onClick={() => editingProjectId !== project.id && selectProject(project)}
          className={`cursor-pointer ${
            selectedProjectId === project.id
              ? "text-[#FE5102] font-medium"
              : "text-gray-400 hover:text-gray-800"
          }`}>
          {editingProjectId === project.id ? (
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleProjectRename(project.id)}
              onBlur={() => handleProjectRename(project.id)}
              autoFocus
              className="border-b border-gray-300 focus:outline-none bg-transparent"
            />
          ) : (
            project.name
          )}
        </div>

        <div className="flex gap-2 items-center">
          {selectedProjectId === project.id && <img src={Correct} alt="" width={15} />}
          <button
            onClick={(e) =>
              handleSubMenuClick(e, project.id, project.name, e.currentTarget as HTMLButtonElement)
            }
            className="text-gray-400 hover:text-gray-700">
            <img src={Menu} />
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
