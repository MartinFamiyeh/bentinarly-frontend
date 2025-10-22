import { useState, useEffect } from "react";
import GreetingBackground from "../assets/images/greeting.jpg";
import EmptySurvey from "../assets/images/empty-survey.png";
import SurveyCard from "../components/participants/SurveyCard";
import Topbar from "../components/participants/Topbar";
import { useDarkMode } from "../contexts/DarkModeContext";

type SurveyType = {
  id: string;
  name: string;
  description: string;
  status: "all" | "available" | "progress" | "completed";
  price: number;
  createdAt: number;
};

const Surveys = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeFilter, setActiveFilter] = useState("All");
  const [surveys, setSurveys] = useState<SurveyType[] | null | undefined>([
    {
      id: "string",
      name: "string",
      description: "string",
      status: "completed",
      price: 23.0,
      createdAt: 234,
    },
    {
      id: "wwww",
      name: "string",
      description: "string",
      status: "completed",
      price: 23.0,
      createdAt: 234,
    },
    {
      id: "wwww",
      name: "string",
      description: "string",
      status: "completed",
      price: 23.0,
      createdAt: 234,
    },
    {
      id: "wwww",
      name: "string",
      description: "string",
      status: "completed",
      price: 23.0,
      createdAt: 234,
    },
    {
      id: "wwww",
      name: "string",
      description: "string",
      status: "completed",
      price: 23.0,
      createdAt: 234,
    },
    {
      id: "wwww",
      name: "string",
      description: "string",
      status: "completed",
      price: 23.0,
      createdAt: 234,
    },
  ]);

  const [sortOrder, setSortOrder] = useState<
    "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A"
  >("Newest to Oldest");

  useEffect(() => {
    if (isDarkMode) {
      toggleDarkMode();
    }
  });

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
            Good Morning Eric Joel,
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
