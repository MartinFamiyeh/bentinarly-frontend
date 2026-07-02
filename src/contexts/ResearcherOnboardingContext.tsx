import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
import { sampleQuestions } from "../data/questions";
import { useUsersApi } from "../services/apiClient";
import { useSnackbar } from "./SnackbarContext";
import { useAuth } from "./AuthContext";
import {
  areOnboardingStatesEqual,
  EMPTY_ONBOARDING_STATE,
  getOnboardingState,
  hasLocalOnboardingProgress,
  markOnboardingDismissed,
  requestFromState,
  resolveOnboardingState,
  saveOnboardingAnswers,
  setOnboardingState,
  type ResearcherOnboardingAnswers,
  type ResearcherOnboardingState,
} from "../utils/researcherOnboardingStorage";

const ONBOARDING_TITLE = "Help us set you up for impactful research.";

type ResearcherOnboardingContextValue = {
  isOpen: boolean;
  onboardingState: ResearcherOnboardingState;
  shouldAutoOpen: boolean;
  isComplete: boolean;
  openModal: () => void;
  closeModal: () => void;
  submitAnswers: (answers: ResearcherOnboardingAnswers) => void;
  refreshState: () => void;
};

const ResearcherOnboardingContext = createContext<ResearcherOnboardingContextValue | null>(null);

export function ResearcherOnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const usersApi = useUsersApi();
  const { showSnackbar } = useSnackbar();
  const userId = user?.id;

  const [onboardingState, setOnboardingStateValue] = useState<ResearcherOnboardingState>(() =>
    userId ? getOnboardingState(userId) : EMPTY_ONBOARDING_STATE
  );
  const [isOpen, setIsOpen] = useState(false);
  const [initialAnswers, setInitialAnswers] = useState<ResearcherOnboardingAnswers>({});
  const migratedUserIdsRef = useRef<Set<string>>(new Set());
  const usersApiRef = useRef(usersApi);
  const showSnackbarRef = useRef(showSnackbar);

  usersApiRef.current = usersApi;
  showSnackbarRef.current = showSnackbar;

  const serverOnboarding = user?.researcherOnboarding;
  const serverOnboardingKey = serverOnboarding
    ? `${serverOnboarding.dismissed}:${serverOnboarding.completed}:${serverOnboarding.updatedAt ?? ""}`
    : "none";

  const applyState = useCallback((nextState: ResearcherOnboardingState) => {
    setOnboardingStateValue((current) =>
      areOnboardingStatesEqual(current, nextState) ? current : nextState
    );
  }, []);

  const persistToServer = useCallback(async (state: ResearcherOnboardingState, targetUserId: string) => {
    setOnboardingState(targetUserId, state);

    try {
      await usersApiRef.current.saveResearcherOnboarding(requestFromState(state));
    } catch {
      showSnackbarRef.current(
        "Profile progress saved locally but could not sync to your account.",
        "warning"
      );
    }
  }, []);

  const refreshState = useCallback(() => {
    if (!userId) {
      return;
    }

    applyState(resolveOnboardingState(userId, serverOnboarding));
  }, [applyState, serverOnboarding, userId]);

  useEffect(() => {
    if (!userId) {
      applyState(EMPTY_ONBOARDING_STATE);
      return;
    }

    const nextState = resolveOnboardingState(userId, serverOnboarding);
    applyState(nextState);

    const shouldMigrateLocalState =
      !serverOnboarding &&
      hasLocalOnboardingProgress(nextState) &&
      !migratedUserIdsRef.current.has(userId);

    if (shouldMigrateLocalState) {
      migratedUserIdsRef.current.add(userId);
      void persistToServer(nextState, userId);
    }
  }, [applyState, persistToServer, serverOnboardingKey, userId]);

  const openModal = useCallback(() => {
    if (userId) {
      const state = resolveOnboardingState(userId, serverOnboarding);
      setInitialAnswers(state.answers ?? {});
      applyState(state);
    } else {
      setInitialAnswers({});
    }
    setIsOpen(true);
  }, [applyState, serverOnboarding, userId]);

  const closeModal = useCallback(() => {
    if (userId) {
      const nextState = markOnboardingDismissed(userId);
      applyState(nextState);
      void persistToServer(nextState, userId);
    }
    setIsOpen(false);
  }, [applyState, persistToServer, userId]);

  const submitAnswers = useCallback(
    (answers: ResearcherOnboardingAnswers) => {
      if (userId) {
        const nextState = saveOnboardingAnswers(userId, answers);
        applyState(nextState);
        void persistToServer(nextState, userId);
      }
      setIsOpen(false);
    },
    [applyState, persistToServer, userId]
  );

  const shouldAutoOpen = Boolean(userId && !onboardingState.dismissed);
  const isComplete = onboardingState.completed;

  const value = useMemo(
    () => ({
      isOpen,
      onboardingState,
      shouldAutoOpen,
      isComplete,
      openModal,
      closeModal,
      submitAnswers,
      refreshState,
    }),
    [
      isOpen,
      onboardingState,
      shouldAutoOpen,
      isComplete,
      openModal,
      closeModal,
      submitAnswers,
      refreshState,
    ]
  );

  return (
    <ResearcherOnboardingContext.Provider value={value}>
      {children}
      <QuestionnaireModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={submitAnswers}
        questions={sampleQuestions}
        title={ONBOARDING_TITLE}
        initialAnswers={initialAnswers}
      />
    </ResearcherOnboardingContext.Provider>
  );
}

export function useResearcherOnboarding(): ResearcherOnboardingContextValue {
  const context = useContext(ResearcherOnboardingContext);
  if (!context) {
    throw new Error("useResearcherOnboarding must be used within ResearcherOnboardingProvider");
  }
  return context;
}

export function useResearcherOnboardingOptional(): ResearcherOnboardingContextValue | null {
  return useContext(ResearcherOnboardingContext);
}

export { ONBOARDING_TITLE };
