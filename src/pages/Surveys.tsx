import { useState, useEffect } from "react";
import GreetingBackground from "../assets/images/greeting.jpg";
import EmptySurvey from "../assets/images/empty-survey.png";
import SurveyCard from "../components/participants/SurveyCard";
import Topbar from "../components/participants/Topbar";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useSurveysApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import * as ApiTypes from "../types/api";
// import CircularProgress from "@mui/material/CircularProgress";

const Surveys = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const surveysApi = useSurveysApi();
  const { showLoading, hideLoading } = useLoading();
  // const [isLoading, setIsLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const [activeFilter, setActiveFilter] = useState("All");
  const [surveys, setSurveys] = useState<ApiTypes.SurveyDto[]>([]);

  const [sortOrder, setSortOrder] = useState<
    "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A"
  >("Newest to Oldest");

  useEffect(() => {
    if (isDarkMode) {
      toggleDarkMode();
    }
  });

  useEffect(() => {
    const fetchSurveys = async () => {
      showLoading();
      try {
        // Fetch available surveys for participants
        const response = await surveysApi.getSurveys({});
        setSurveys(response.items || []);
      } catch (error: any) {
        console.error("Failed to fetch surveys:", error);
        showSnackbar("Failed to load surveys.", "error");
        setSurveys([]);
      } finally {
        hideLoading();
        //setIsLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const filteredSurveys = surveys
    .filter((survey) => {
      if (activeFilter === "All") return true;
      // Map filter to survey status
      // SurveyStatus is a numeric type: 1 = Draft, 2 = Published/Live, 3 = Closed, 4 = Archived
      const statusMap: Record<string, ApiTypes.SurveyStatus> = {
        available: 2, // Published/Live
        progress: 2, // In progress = still live
        completed: 3, // Closed
      };
      return survey.status === statusMap[activeFilter.toLowerCase()];
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

  // if (isLoading) {
  //   return <CircularProgress />;
  // }

  return (
    <div className="h-screen rounded-l-xl bg-white shadow-sm overflow-y-auto">
      <Topbar
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
            Good Morning {user?.firstName || "User"},
          </h2>
          <p className="text-[#FFFEFE] text-sm">
            Let’s get your research moving. Craft better surveys, find the right participants, and
            make informed decisions powered by real African data.
          </p>
        </div>

        <div className=" gap-4 grid grid-cols-4">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
          ) : (
            <div className="col-span-4 h-full flex flex-col gap-4 justify-center items-center py-10">
              <img src={EmptySurvey} alt="" className="max-w-xs" />
              <p className="text-sm text-[#696969]">You currently have no surveys</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Surveys;
