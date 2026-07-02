import { Outlet } from "react-router-dom";
import { ResearcherOnboardingProvider } from "../contexts/ResearcherOnboardingContext";

export default function ResearcherWorkspaceRoot() {
  return (
    <ResearcherOnboardingProvider>
      <Outlet />
    </ResearcherOnboardingProvider>
  );
}
