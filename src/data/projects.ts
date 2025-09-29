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

export const sampleProjects: ProjectType[] = [
  {
    id: 1,
    name: "Customer Feedback",
    surveys: [
      {
        id: "s1",
        name: "Post-Purchase Survey",
        members: 120,
        status: "live",
        createdAt: 1695487200000,
      },
      {
        id: "s2",
        name: "Website Experience",
        members: 80,
        status: "draft",
        createdAt: 1698108000000,
      },
    ],
  },
  {
    id: 2,
    name: "Employee Engagement",
    surveys: [],
  },
  {
    id: 3,
    name: "Operation Haywire",
    surveys: [
      { id: "1", name: "Survey 1", members: 1, status: "draft", createdAt: 1695487200000 },
      {
        id: "2",
        name: "Survey to see if people like product one...",
        members: 10,
        status: "scheduled",
        createdAt: 1700700000000,
      },
      { id: "3", name: "Survey 2", members: 1, status: "live", createdAt: 1703292000000 },
      {
        id: "4",
        name: "Survey to see if people like product one...",
        members: 6,
        status: "paused",
        createdAt: 1705884000000,
      },
      {
        id: "5",
        name: "Survey to see if people like product one...",
        members: 10,
        status: "closed",
        createdAt: 1708476000000,
      },
      { id: "6", name: "Survey 3", members: 1, status: "completed", createdAt: 1711068000000 },
      { id: "7", name: "Survey 4", members: 3, status: "draft", createdAt: 1713660000000 },
      { id: "8", name: "Survey 4", members: 3, status: "completed", createdAt: 1716252000000 },
    ],
  },
];
