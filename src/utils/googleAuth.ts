const GOOGLE_AUTH_INTENT_KEY = "googleAuthIntent";

export type GoogleAuthIntent = "participant" | "researcher";

export function startGoogleLogin(intent: GoogleAuthIntent = "researcher"): void {
  sessionStorage.setItem(GOOGLE_AUTH_INTENT_KEY, intent);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5136";
  const callbackUrl = new URL(`${window.location.origin}/auth/google/callback`);
  callbackUrl.searchParams.set("intent", intent);

  const googleLoginUrl = new URL("/api/auth/google-login", apiBaseUrl);
  googleLoginUrl.searchParams.set("returnUrl", callbackUrl.toString());
  googleLoginUrl.searchParams.set("intent", intent);

  window.location.href = googleLoginUrl.toString();
}

export function readGoogleAuthIntent(search: string): GoogleAuthIntent {
  const fromUrl = new URLSearchParams(search).get("intent");
  if (fromUrl === "participant") {
    return "participant";
  }

  const storedIntent = sessionStorage.getItem(GOOGLE_AUTH_INTENT_KEY);
  if (storedIntent === "participant") {
    return "participant";
  }

  return "researcher";
}

export function clearGoogleAuthIntent(): void {
  sessionStorage.removeItem(GOOGLE_AUTH_INTENT_KEY);
}
