import { useState, useEffect, type FunctionComponent, type SVGProps } from "react";
import GreetingBackground from "../assets/images/greeting.jpg";
import NoSurveysIllustration from "../assets/icons/no-surveys-svg.svg";
import SurveyCard from "../components/participants/SurveyCard";
import Topbar from "../components/participants/Topbar";
import { useSurveysApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import { getParticipantStatus } from "../utils/participantSurvey";
import { getTimeOfDayGreeting } from "../utils/timeOfDayGreeting";
import * as ApiTypes from "../types/api";

const EmptySurveysIllustration = NoSurveysIllustration as unknown as FunctionComponent<
  SVGProps<SVGSVGElement>
>;

const Surveys = () => {
  const { user } = useAuth();
  const surveysApi = useSurveysApi();
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [surveys, setSurveys] = useState<ApiTypes.SurveyDto[]>([]);
  const [sortOrder, setSortOrder] = useState<
    "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A"
  >("Newest to Oldest");

  useEffect(() => {
    const fetchSurveys = async () => {
      showLoading();
      try {
        const response = await surveysApi.getSurveys({});
        setSurveys(response.items || []);
      } catch (error: unknown) {
        console.error("Failed to fetch surveys:", error);
        showSnackbar("Failed to load surveys.", "error");
        setSurveys([]);
      } finally {
        hideLoading();
      }
    };

    fetchSurveys();
  }, []);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || "User";

  const filteredSurveys = surveys
    .filter((survey) => {
      const participantStatus = getParticipantStatus(survey);
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Available" &&
          (participantStatus === "Available" || participantStatus === "Paused")) ||
        (activeFilter === "In Progress" && participantStatus === "In Progress") ||
        (activeFilter === "Completed" && participantStatus === "Completed");

      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (survey.title || "").toLowerCase().includes(query) ||
        (survey.description || "").toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
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
    <div className="h-screen rounded-l-xl bg-white dark:bg-gray-900 shadow-sm overflow-y-auto">
      <Topbar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="p-4">
        <div
          className="mb-8 rounded-xl bg-cover bg-center bg-no-repeat p-6"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${GreetingBackground})`,
          }}>
          <h2 className="text-lg font-semibold text-white">
            {getTimeOfDayGreeting()} {displayName},
          </h2>
          <p className="mt-1 text-sm text-white/95">
            Your voice shapes the future of Africa. Take a survey, share your experience, power
            local innovation, and get rewarded for your insights.
          </p>
        </div>

        {filteredSurveys.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSurveys.map((survey, index) => (
              <SurveyCard key={survey.id} survey={survey} thumbnailIndex={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <EmptySurveysIllustration className="max-w-xs" aria-hidden />
            <p className="text-sm text-[#696969] dark:text-gray-400">No surveys available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Surveys;
