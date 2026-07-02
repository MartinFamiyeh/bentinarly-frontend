import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProjectsApi } from "../services/apiClient";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useLoading } from "../contexts/LoadingContext";
import { useAuth } from "./AuthContext";
import * as ApiTypes from "../types/api";

type ProjectContextType = {
  projects: ApiTypes.ProjectDto[] | null;
  selectedProject: ApiTypes.ProjectDto | null;
  isLoading: boolean;
  setProjectsList: (projectsData: ApiTypes.ProjectDto[]) => void;
  addProject: (project: ApiTypes.ProjectDto) => void;
  removeProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  selectProject: (project: ApiTypes.ProjectDto | null) => void;
  refreshProjects: () => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType>({
  projects: null,
  selectedProject: null,
  isLoading: true,
  setProjectsList: () => {},
  addProject: () => {},
  removeProject: () => {},
  renameProject: () => {},
  selectProject: () => {},
  refreshProjects: async () => {},
});

export function useProjects() {
  return useContext(ProjectContext);
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ApiTypes.ProjectDto[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<ApiTypes.ProjectDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const projectsApi = useProjectsApi();
  const { showSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const isPublicTakeSurveyRoute = location.pathname === "/surveys/takesurvey";

  // Load projects from API only when user is authenticated
  useEffect(() => {
    if (isPublicTakeSurveyRoute) {
      setIsLoading(false);
      return;
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Only load projects if user is authenticated
    if (user) {
      loadProjects();
    } else {
      // User not authenticated - clear projects and stop loading
      setProjects(null);
      setSelectedProject(null);
      setIsLoading(false);
    }
  }, [user, authLoading, isPublicTakeSurveyRoute]);

  const loadProjects = async () => {
    // Don't load if user is not authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    showLoading();
    try {
      const response = await projectsApi.getProjects({ page: 1, pageSize: 100 });
      const projectsList = response.items || [];
      setProjects(projectsList);

      // If there's a selected project ID in localStorage, try to find it
      const storedProjectId = localStorage.getItem("selectedProjectId");
      if (storedProjectId && projectsList.length > 0) {
        const found = projectsList.find((p) => p.id === storedProjectId);
        if (found) {
          setSelectedProject(found);
        } else if (projectsList.length > 0) {
          // If stored project not found, select first project
          setSelectedProject(projectsList[0]);
        }
      } else if (projectsList.length > 0) {
        // No stored selection, select first project
        setSelectedProject(projectsList[0]);
      }
    } catch (error: any) {
      console.error("Failed to load projects:", error);
      // Only show error if user is authenticated (not on login page)
      if (user) {
        showSnackbar("Failed to load projects.", "error");
      }
      setProjects([]);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const refreshProjects = async () => {
    await loadProjects();
  };

  const setProjectsList = (projectsList: ApiTypes.ProjectDto[]) => {
    setProjects(projectsList);
  };

  const addProject = async (project: ApiTypes.ProjectDto) => {
    setProjects((prev) => (prev ? [...prev, project] : [project]));
    setSelectedProject(project);
    localStorage.setItem("selectedProjectId", project.id);
  };

  const removeProject = async (id: string) => {
    try {
      await projectsApi.deleteProject(id);
      setProjects((prev) => (prev ? prev.filter((project) => project.id !== id) : prev));
      if (selectedProject?.id === id) {
        const remaining = projects?.filter((p) => p.id !== id) || [];
        if (remaining.length > 0) {
          setSelectedProject(remaining[0]);
          localStorage.setItem("selectedProjectId", remaining[0].id);
        } else {
          setSelectedProject(null);
          localStorage.removeItem("selectedProjectId");
        }
      }
      showSnackbar("Project deleted successfully.", "success");
    } catch (error: any) {
      console.error("Failed to delete project:", error);
      showSnackbar("Failed to delete project.", "error");
    }
  };

  const renameProject = async (id: string, newName: string) => {
    try {
      const updated = await projectsApi.updateProject(id, { name: newName });
      setProjects((prev) =>
        prev ? prev.map((project) => (project.id === id ? updated : project)) : prev
      );
      if (selectedProject?.id === id) {
        setSelectedProject(updated);
      }
      showSnackbar("Project renamed successfully.", "success");
    } catch (error: any) {
      console.error("Failed to rename project:", error);
      showSnackbar("Failed to rename project.", "error");
    }
  };

  const selectProject = (project: ApiTypes.ProjectDto | null) => {
    setSelectedProject(project);
    if (project) {
      localStorage.setItem("selectedProjectId", project.id);
    } else {
      localStorage.removeItem("selectedProjectId");
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        isLoading,
        setProjectsList,
        addProject,
        removeProject,
        renameProject,
        selectProject,
        refreshProjects,
      }}>
      {children}
    </ProjectContext.Provider>
  );
}
