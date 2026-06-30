import { type JSX } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import { DarkModeProvider } from "./contexts/DarkModeContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";

import Header from "./components/global/Header";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonial";
import PSession from "./components/PSession";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Verification";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GoogleCallback from "./pages/GoogleCallback";
import ForgotPassword from "./pages/ForgotPassword";
import Participants from "./pages/Participants";
import ResetPassword from "./pages/ResetPassword";
import ResetSuccess from "./pages/ResetSuccess";

import DashboardLayout from "./layouts/DashboardLayout";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import Templates from "./pages/Templates";

import SurveyLayout from "./layouts/SurveyLayout";
import SurveyAnalytics from "./pages/SurveyAnalytics";
import Demographics from "./pages/Demographics";
import Questionnaires from "./pages/Questionnaires";
import { ProjectsProvider } from "./contexts/ProjectsContext";

import ParticipantsLayout from "./layouts/ParticipantsLayout";
import Surveys from "./pages/Surveys";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import Notifications from "./pages/Notifications";

import PreviewSurvey from "./components/survey/TakeSurvey"
import TakeSurvey from "./components/participants/TakeSurvey";

function DefaultLayout(): JSX.Element {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-[#0B0B0B] transition-colors duration-200">
  <Header />
  <main className="w-full max-w-full overflow-x-hidden">
    <Outlet />
  </main>
  <div className="w-full max-w-full overflow-x-hidden">
    <Testimonials />
    <PSession />
    <Footer />
  </div>
</div>
  );
}

function AuthLayout(): JSX.Element {
  return (
    <div className="min-h-screen transition-colors">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <SnackbarProvider>
      <DarkModeProvider>
        <AuthProvider>
          <LoadingProvider>
            <ProjectsProvider>
              <Routes>
                <Route path="/" element={<DefaultLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="solutions" element={<Solutions />} />
                  <Route path="pricing" element={<Pricing />} />
                  <Route path="contact" element={<Contact />} />
                </Route>

                <Route path="/" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="auth/google/callback" element={<GoogleCallback />} />
                  <Route path="register" element={<Signup />} />
                  <Route path="participant" element={<Participants />} />
                  <Route path="verification" element={<Verify />} />
                  <Route path="forgotpassword" element={<ForgotPassword />} />
                  <Route path="/resetpassword" element={<ResetPassword />} />
                  <Route path="/reset-success" element={<ResetSuccess />} />
                </Route>

                <Route element={<DashboardLayout />}>
                  <Route path="/projects/dashboard" element={<Projects />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/templates" element={<Templates />} />
                </Route>

                <Route element={<SurveyLayout />}>
                  <Route path="/survey/questionnaires" element={<Questionnaires />} />
                  <Route path="/survey/questionnaires/:surveyId" element={<Questionnaires />} />
                  <Route path="/survey/demographics" element={<Demographics />} />
                  <Route path="/survey/analytics" element={<SurveyAnalytics />} />
                  <Route path="/survey/preview" element={<PreviewSurvey />} />
                </Route>

                <Route element={<ParticipantsLayout />}>
                  <Route path="/surveys/allsurveys" element={<Surveys />} />
                  <Route path="/surveys/profile" element={<Profile />} />
                  <Route path="/surveys/rewards" element={<Rewards />} />
                  <Route path="/surveys/notifications" element={<Notifications />} />
                  <Route path="/surveys/takesurvey" element={<TakeSurvey />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProjectsProvider>
          </LoadingProvider>
        </AuthProvider>
      </DarkModeProvider>
    </SnackbarProvider>
  );
}

export default App;
