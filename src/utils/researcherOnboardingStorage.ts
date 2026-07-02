import type {
  ResearcherOnboardingDto,
  SaveResearcherOnboardingRequest,
} from "../types/api";

export type ResearcherOnboardingAnswers = Record<string, string | string[]>;

export type ResearcherOnboardingState = {
  dismissed: boolean;
  completed: boolean;
  answers?: ResearcherOnboardingAnswers;
  updatedAt: string;
};

const STORAGE_PREFIX = "bentinarly:researcher-onboarding:";

export const EMPTY_ONBOARDING_STATE: ResearcherOnboardingState = {
  dismissed: false,
  completed: false,
  updatedAt: "",
};

export function areOnboardingStatesEqual(
  a: ResearcherOnboardingState,
  b: ResearcherOnboardingState
): boolean {
  return (
    a.dismissed === b.dismissed &&
    a.completed === b.completed &&
    a.updatedAt === b.updatedAt &&
    JSON.stringify(a.answers ?? null) === JSON.stringify(b.answers ?? null)
  );
}

const storageKey = (userId: string) => `${STORAGE_PREFIX}${userId}`;

function normalizeAnswers(raw?: Record<string, unknown>): ResearcherOnboardingAnswers | undefined {
  if (!raw) {
    return undefined;
  }

  const answers: ResearcherOnboardingAnswers = {};

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      answers[key] = value;
      continue;
    }

    if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
      answers[key] = value;
      continue;
    }

    if (value != null) {
      answers[key] = String(value);
    }
  }

  return Object.keys(answers).length > 0 ? answers : undefined;
}

export function stateFromDto(dto: ResearcherOnboardingDto): ResearcherOnboardingState {
  return {
    dismissed: Boolean(dto.dismissed),
    completed: Boolean(dto.completed),
    answers: normalizeAnswers(dto.answers),
    updatedAt: dto.updatedAt ?? new Date().toISOString(),
  };
}

export function requestFromState(state: ResearcherOnboardingState): SaveResearcherOnboardingRequest {
  return {
    dismissed: state.dismissed,
    completed: state.completed,
    answers: state.answers,
  };
}

export function getOnboardingState(userId: string): ResearcherOnboardingState {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      return EMPTY_ONBOARDING_STATE;
    }
    const parsed = JSON.parse(raw) as ResearcherOnboardingState;
    return {
      dismissed: Boolean(parsed.dismissed),
      completed: Boolean(parsed.completed),
      answers: parsed.answers,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return EMPTY_ONBOARDING_STATE;
  }
}

export function setOnboardingState(userId: string, state: ResearcherOnboardingState): ResearcherOnboardingState {
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
  return state;
}

export function hasLocalOnboardingProgress(state: ResearcherOnboardingState): boolean {
  return state.dismissed || state.completed;
}

export function resolveOnboardingState(
  userId: string,
  serverDto?: ResearcherOnboardingDto | null
): ResearcherOnboardingState {
  const localState = getOnboardingState(userId);

  if (serverDto) {
    const serverState = stateFromDto(serverDto);
    setOnboardingState(userId, serverState);
    return serverState;
  }

  return localState;
}

export function markOnboardingDismissed(userId: string): ResearcherOnboardingState {
  const current = getOnboardingState(userId);
  const next: ResearcherOnboardingState = {
    ...current,
    dismissed: true,
    updatedAt: new Date().toISOString(),
  };
  setOnboardingState(userId, next);
  return next;
}

export function saveOnboardingAnswers(
  userId: string,
  answers: ResearcherOnboardingAnswers
): ResearcherOnboardingState {
  const next: ResearcherOnboardingState = {
    dismissed: true,
    completed: true,
    answers,
    updatedAt: new Date().toISOString(),
  };
  setOnboardingState(userId, next);
  return next;
}
