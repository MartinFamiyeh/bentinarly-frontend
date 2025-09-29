import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "projects-context";

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

type ProjectContextType = {
  projects: ProjectType[] | null;
  selectedProject: ProjectType | null;
  setProjectsList: (projectsData: ProjectType[]) => void;
  addProject: (project: ProjectType) => void;
  removeProject: (id: number) => void;
  renameProject: (id: number, name: string) => void;
  selectProject: (project: ProjectType) => void;
};

const ProjectContext = createContext<ProjectContextType>({
  projects: null,
  selectedProject: null,
  setProjectsList: () => {},
  addProject: () => {},
  removeProject: () => {},
  renameProject: () => {},
  selectProject: () => {},
});

export function useProjects() {
  return useContext(ProjectContext);
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed.projects ?? null);
        setSelectedProject(parsed.selectedProject ?? null);
      } catch (error) {
        console.error("Failed to parse stored projects data", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, selectedProject }));
  }, [projects, selectedProject]);

  const setProjectsList = (projectsList: ProjectType[]) => {
    setProjects(projectsList);
  };

  const addProject = (project: ProjectType) => {
    setProjects((prev) => (prev ? [...prev, project] : [project]));
  };

  const removeProject = (id: number) => {
    setProjects((prev) => (prev ? prev.filter((project) => project.id !== id) : prev));
  };

  const renameProject = (id: number, newName: string) => {
    setProjects((prev) =>
      prev
        ? prev.map((project) => (project.id === id ? { ...project, name: newName } : project))
        : prev
    );
  };

  const selectProject = (project: ProjectType) => {
    setSelectedProject(project);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setProjectsList,
        addProject,
        removeProject,
        renameProject,
        selectProject,
      }}>
      {children}
    </ProjectContext.Provider>
  );
}
