type Question = {
  id: string;
  type: "radio" | "text" | "checkbox";
  question: string;
  options?: string[];
  placeholder?: string;
};

export const sampleQuestions: Question[] = [
  {
    id: "role",
    type: "radio",
    question: "What best describes your role?",
    options: ["Student", "Academic", "NGO", "Business", "Government", "Input your option here"],
  },
  {
    id: "sampleSize",
    type: "text",
    question: "What sample size are you typically looking for per study?",
    placeholder: "Input sample size",
  },
  {
    id: "runSurveyPlan",
    type: "radio",
    question: "How soon do you plan to run your first survey?",
    options: ["Within a week", "This month", "Later"],
  },
];
