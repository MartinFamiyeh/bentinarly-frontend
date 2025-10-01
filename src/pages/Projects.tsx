import { useState, useEffect } from "react";
import GreetingBackground from "../assets/images/greeting.jpg";
import EmptySurvey from "../assets/images/empty-survey.png";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
import SurveyCard from "../components/dashboard/SurveyCard";
import ProjectsTopBar from "../components/dashboard/ProjectsTopBar";
import { useProjects } from "../contexts/ProjectsContext";
import { sampleProjects } from "../data/projects";
import { sampleQuestions } from "../data/questions";
import { useLoading } from "../contexts/LoadingContext";

type SurveyType = {
  id: string;
  name: string;
  members: number;
  status: "draft" | "scheduled" | "live" | "paused" | "closed" | "completed";
  createdAt: number;
};

const Projects = () => {
  const { showLoading, hideLoading } = useLoading();
  const { selectedProject, setProjectsList, selectProject } = useProjects();
  const [activeFilter, setActiveFilter] = useState("All");
  const [surveys, setSurveys] = useState<SurveyType[] | null | undefined>(selectedProject?.surveys);

  const [sortOrder, setSortOrder] = useState<
    "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A"
  >("Newest to Oldest");
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);

  useEffect(() => {
    setSurveys(selectedProject?.surveys ?? []);
  }, [selectedProject]);

  useEffect(() => {
    setIsQuestionnaireModalOpen(true);
  }, []);

  const handleQuestionnaireSubmit = (answers: Record<string, string | string[]>) => {
    console.log("Questionnaire Answers:", answers);
    setIsQuestionnaireModalOpen(false);
  };

  const filteredSurveys = (surveys ?? [])
    .filter((survey) => {
      if (activeFilter === "All") return true;
      return survey.status === activeFilter.toLowerCase();
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "Newest to Oldest":
          return (b.createdAt ?? 0) - (a.createdAt ?? 0);

        case "Oldest to Newest":
          return (a.createdAt ?? 0) - (b.createdAt ?? 0);

        case "A - Z":
          return a.name.localeCompare(b.name);

        case "Z - A":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

  useEffect(() => {
    showLoading();
    setTimeout(() => {
      setProjectsList(sampleProjects);

      if (sampleProjects.length > 0) {
        setProjectsList(sampleProjects);
        if (!selectedProject) {
          selectProject(sampleProjects[0]);
        }
      }
      hideLoading();
    }, 2000);
  }, []);

  return (
    <div className="h-screen rounded-l-xl bg-white shadow-sm overflow-y-auto">
      <ProjectsTopBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="p-4">
        <div
          className="p-4 mb-8 rounded-lg bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${GreetingBackground})`,
          }}>
          <h2 className="text-lg font-semibold text-[#FFFEFE] tracking-normal leading-normal">
            Good Morning Eric Joel,
          </h2>
          <p className="text-[#FFFEFE] text-sm">
            Let’s get your research moving. Craft better surveys, find the right participants, and
            make informed decisions powered by real African data.
          </p>
        </div>

        <div className="overflow-hidden space-y-2">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
          ) : (
            <div className="h-full flex flex-col gap-4 justify-center items-center py-10">
              <img src={EmptySurvey} alt="" className="max-w-xs" />
              <p className="text-sm text-[#696969]">
                You currently have no surveys in this project with the selected filter. Click on{" "}
                <span className="text-gray-800 font-medium">“Create Survey”</span> to get started.
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
