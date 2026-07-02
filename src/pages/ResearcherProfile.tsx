import { useEffect } from "react";
import { useResearcherOnboarding, ONBOARDING_TITLE } from "../contexts/ResearcherOnboardingContext";
import { sampleQuestions } from "../data/questions";

const QUESTION_LABELS: Record<string, string> = Object.fromEntries(
  sampleQuestions.map((question) => [question.id, question.question])
);

function formatAnswerValue(value: string | string[] | undefined): string {
  if (value === undefined) {
    return "—";
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "—";
  }
  return value.trim() || "—";
}

const ResearcherProfile = () => {
  const { onboardingState, isComplete, openModal, refreshState } = useResearcherOnboarding();

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const answers = onboardingState.answers ?? {};

  return (
    <div className="h-screen rounded-l-xl bg-white dark:bg-gray-900 shadow-sm overflow-y-auto">
      <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-5">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tell us about your research so we can tailor your experience.
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-gray-800 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Research profile</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{ONBOARDING_TITLE}</p>
              <span
                className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  isComplete
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                {isComplete ? "Completed" : "Incomplete"}
              </span>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="rounded-lg bg-[#FF6B00] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#E55F00] transition-colors">
              {isComplete ? "Update profile" : "Complete profile"}
            </button>
          </div>
        </div>

        {isComplete && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your answers</h2>
            <dl className="mt-4 space-y-4">
              {sampleQuestions.map((question) => (
                <div key={question.id}>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    {QUESTION_LABELS[question.id] ?? question.question}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatAnswerValue(answers[question.id])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearcherProfile;
