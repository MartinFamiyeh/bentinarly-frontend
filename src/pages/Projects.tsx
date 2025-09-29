import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import SortIcon from "../assets/icons/sort.png";
import GreetingBackground from "../assets/images/greeting.jpg";
import EmptySurvey from "../assets/images/empty-survey.png";
import { PiCheckCircleFill } from "react-icons/pi";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
import SurveyCard from "../components/dashboard/SurveyCard";
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

const filters = ["All", "Draft", "Scheduled", "Live", "Paused", "Closed", "Completed"];

const Projects = () => {
  const { showLoading } = useLoading();
  const { selectProject, selectedProject, projects, setProjectsList } = useProjects();
  const [activeFilter, setActiveFilter] = useState("All");
  const [surveys, setSurveys] = useState<SurveyType[] | null | undefined>(selectedProject?.surveys);

  const [sortOrder, setSortOrder] = useState<
    "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A"
  >("Newest to Oldest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);

  useEffect(() => {
    setSurveys(selectedProject?.surveys ?? []);
  }, [selectedProject]);

  const handleSortChange = (order: typeof sortOrder) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  useEffect(() => {
    setIsQuestionnaireModalOpen(true);
  }, []);

  const handleQuestionnaireSubmit = (answers: Record<string, string | string[]>) => {
    console.log("Questionnaire Answers:", answers);
  };

  const filteredSurveys = (surveys ?? [])
    .filter((survey) => {
      if (activeFilter === "All") return true;
      return survey.status === activeFilter.toLowerCase();
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "Newest to Oldest":
          // Assuming `id` or a `createdAt` date exists, sort descending
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
    setTimeout(() => {
      setProjectsList(sampleProjects);
      selectProject(sampleProjects[0]);
      console.log("projects set", projects);
    }, 2000);
  }, []);

  return (
    <div className="h-screen rounded-l-xl bg-white shadow-sm overflow-y-auto">
      <div className="shadow-sm p-4 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-3 relative">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1 focus:outline-none"
              onClick={() => setIsProjectsDropdownOpen((prev) => !prev)}>
              <span className="font-semibold text-lg">
                {selectedProject?.name || "Select Project"}
              </span>
              <FiChevronDown
                className={`transition-transform duration-200 ${
                  isProjectsDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProjectsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className={`px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm ${
                        selectedProject?.id === project.id ? "bg-orange-50 font-medium" : ""
                      }`}
                      onClick={() => {
                        selectProject(project);
                        setIsProjectsDropdownOpen(false);
                      }}>
                      {project.name}
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
              <img src={SortIcon} alt="sort" className="h-3 w-3" />
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
