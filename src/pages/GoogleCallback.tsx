import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { AuthResultDto } from "../types/api";
import { getPostLoginRedirect } from "../utils/routeUtils";
import { clearGoogleAuthIntent, readGoogleAuthIntent } from "../utils/googleAuth";
import { isParticipantRole } from "../utils/userRoleUtils";

const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

const readGoogleResult = (): AuthResultDto | null => {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const encodedResult = params.get("googleResult");

  if (!encodedResult) {
    return null;
  }

  return JSON.parse(decodeBase64Url(encodedResult)) as AuthResultDto;
};

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [error, setError] = useState("");
  const intent = readGoogleAuthIntent(window.location.search);
  const loginPath = intent === "participant" ? "/participant/login" : "/login";

  useEffect(() => {
    try {
      const result = readGoogleResult();

      if (!result) {
        setError("Google sign-in did not return an authentication result.");
        return;
      }

      if (!result.success || !result.user || !result.token) {
        setError(result.errors?.[0] || "Google sign-in failed. Please try again.");
        return;
      }

      const userIsParticipant = isParticipantRole(result.user.role);

      if (intent === "participant" && !userIsParticipant) {
        setError(
          "This Google account is registered as a researcher. Use researcher login instead, or sign up with a different Google account for participant access."
        );
        return;
      }

      if (intent === "researcher" && userIsParticipant) {
        setError("Participant accounts should sign in from the participant login page.");
        return;
      }

      clearGoogleAuthIntent();
      signin(result.user, result.token, result.refreshToken || undefined);
      navigate(getPostLoginRedirect(undefined, result.user.role), { replace: true });
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }, [navigate, signin, intent]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-[#292929]">Google sign-in</h1>
        {error ? (
          <>
            <p className="mt-3 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => navigate(loginPath, { replace: true })}
              className="mt-5 rounded-md bg-[#FE5102] px-4 py-2 text-sm font-medium text-white">
              Back to login
            </button>
          </>
        ) : (
          <p className="mt-3 text-sm text-gray-600">Completing your sign-in...</p>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
