import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GreetingBackground from "../assets/images/greeting.jpg";
import EmptySurvey from "../assets/images/empty-survey.png";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
import SurveyCard from "../components/dashboard/SurveyCard";
import ProjectsTopBar from "../components/dashboard/ProjectsTopBar";
import { sampleQuestions } from "../data/questions";
import { useLoading } from "../contexts/LoadingContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useSurveysApi } from "../services/apiClient";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectsContext";
import type { SurveyDto, SurveyStatus } from "../types/api";

const Projects = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();
  const { selectedProject } = useProjects();
  const surveysApi = useSurveysApi();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [surveys, setSurveys] = useState<SurveyDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState<
    "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A"
  >("Newest to Oldest");
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (isDarkMode) {
      toggleDarkMode();
    }
  });

  useEffect(() => {
    setIsQuestionnaireModalOpen(true);
  }, []);

  // Fetch surveys from backend
  const loadSurveysRef = useRef<(() => Promise<void>) | null>(null);
  
  useEffect(() => {
    const loadSurveys = async () => {
      showLoading();
      try {
        // Map filter values from ProjectsTopBar to API status values
        const statusMap: Record<string, SurveyStatus | undefined> = {
          "All": undefined,
          "Draft": 1,
          "Scheduled": undefined, // Scheduled might not be a status, or needs backend support
          "Live": 2, // Assuming "Live" means "Published"
          "Paused": undefined, // Paused might not be a status, or needs backend support
          "Closed": 3,
          "Completed": 3, // Assuming "Completed" means "Closed"
        };

        const requestParams = {
          // When a project is selected, filter by that project; otherwise, show all surveys
          projectId: selectedProject?.id,
          status: statusMap[activeFilter],
          page: 1,
          pageSize: 100,
          searchTerm: debouncedSearchTerm.trim() || undefined,
          sortBy:
            sortOrder === "Newest to Oldest" || sortOrder === "Oldest to Newest"
              ? "CreatedAt"
              : "Title",
          sortDescending:
            sortOrder === "Newest to Oldest" || sortOrder === "Z - A",
        };
        
        console.log("🔍 Loading surveys with params:", requestParams);
        const result = await surveysApi.getSurveys(requestParams);
        
        console.log("📊 Received surveys:", result.items?.length || 0, "items");
        console.log("📊 Survey projectIds:", result.items?.map(s => ({ id: s.id, title: s.title, projectId: s.projectId })));
        
        setSurveys(result.items || []);
      } catch (error) {
        console.error("Error loading surveys:", error);
        setSurveys([]);
      } finally {
        hideLoading();
      }
    };

    // Store the function in ref so it can be called from callbacks
    loadSurveysRef.current = loadSurveys;
    
    loadSurveys();
  }, [activeFilter, sortOrder, selectedProject?.id, debouncedSearchTerm]);

  const handleQuestionnaireSubmit = (answers: Record<string, string | string[]>) => {
    console.log("Questionnaire Answers:", answers);
    setIsQuestionnaireModalOpen(false);
  };

  // Note: Filtering by status is handled by the API, so we only need to sort here
  const filteredSurveys = surveys.sort((a, b) => {
      switch (sortOrder) {
        case "Newest to Oldest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        case "Oldest to Newest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        case "A - Z":
          return (a.title || "").localeCompare(b.title || "");

        case "Z - A":
          return (b.title || "").localeCompare(a.title || "");

        default:
          return 0;
      }
    });

  return (
    <div className="h-screen rounded-l-xl bg-white shadow-sm overflow-y-auto">
      <ProjectsTopBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="p-4">
        <div
          className="p-4 mb-8 rounded-lg bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${GreetingBackground})`,
          }}>
          <h2 className="text-lg font-semibold text-[#FFFEFE] tracking-normal leading-normal">
            Good Morning {user?.firstName || user?.userName || "User"},
          </h2>
          <p className="text-[#FFFEFE] text-sm">
            Let’s get your research moving. Craft better surveys, find the right participants, and
            make informed decisions powered by real African data.
          </p>
        </div>

        <div className="overflow-hidden space-y-2">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                onSurveyDeleted={(surveyId) => {
                  setSurveys((prev) => prev.filter((s) => s.id !== surveyId));
                }}
                onSurveyUpdated={(updatedSurvey) => {
                  setSurveys((prev) => {
                    // Check if this survey already exists in the list
                    const existingIndex = prev.findIndex((s) => s.id === updatedSurvey.id);
                    
                    if (existingIndex >= 0) {
                      // Survey exists - update it in place (e.g., rename)
                      const newList = [...prev];
                      newList[existingIndex] = updatedSurvey;
                      return newList;
                    } else {
                      // Survey doesn't exist - add it (e.g., duplicate)
                      // Add the new survey to the list - if it doesn't belong to current project,
                      // it will be filtered out on the next load
                      return [...prev, updatedSurvey];
                    }
                  });
                }}
              />
            ))
          ) : (
            <div className="h-full flex flex-col gap-4 justify-center items-center py-10">
              <img src={EmptySurvey} alt="" className="max-w-xs" />
              <p className="text-sm text-[#696969]">
                {selectedProject
                  ? `You currently have no surveys in ${selectedProject.name} with the selected filter.`
                  : "You currently have no surveys with the selected filter."}{" "}
                Click on{" "}
                <button
                  type="button"
                  onClick={() => navigate("/survey/questionnaires/new")}
                  className="text-gray-800 font-medium underline hover:text-gray-900"
                >
                  “Create Survey”
                </button>{" "}
                to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      <QuestionnaireModal
        isOpen={isQuestionnaireModalOpen}
        onClose={() => setIsQuestionnaireModalOpen(false)}
        onSubmit={handleQuestionnaireSubmit}
        questions={sampleQuestions}
        title="Help us set you up for impactful research."
      />
    </div>
  );
};

export default Projects;
