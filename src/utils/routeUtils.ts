import type { UserRole } from "../types/api";
import {
  getDefaultRouteForRole,
  PARTICIPANT_LOGIN,
  PARTICIPANT_PORTAL_ROLES,
  PARTICIPANT_SIGNUP,
  RESEARCHER_LOGIN,
  RESEARCHER_SIGNUP,
  RESEARCHER_WORKSPACE_ROLES,
} from "../constants/userRoles";

const AUTH_PATHS = [
  RESEARCHER_LOGIN,
  RESEARCHER_SIGNUP,
  PARTICIPANT_LOGIN,
  PARTICIPANT_SIGNUP,
  "/participant",
  "/verification",
  "/forgotpassword",
  "/resetpassword",
  "/reset-success",
  "/auth/google/callback",
];

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function isPathAllowedForRole(pathname: string, role: UserRole): boolean {
  if (PARTICIPANT_PORTAL_ROLES.includes(role)) {
    return (
      pathname.startsWith("/surveys/allsurveys") ||
      pathname.startsWith("/surveys/profile") ||
      pathname.startsWith("/surveys/rewards") ||
      pathname.startsWith("/surveys/notifications")
    );
  }

  if (RESEARCHER_WORKSPACE_ROLES.includes(role)) {
    return (
      pathname.startsWith("/projects/") ||
      pathname === "/analytics" ||
      pathname.startsWith("/analytics/") ||
      pathname === "/templates" ||
      pathname.startsWith("/templates/") ||
      pathname.startsWith("/survey/")
    );
  }

  return false;
}

export function getPostLoginRedirect(fromPath: string | undefined, role: UserRole): string {
  if (fromPath && !isAuthPath(fromPath) && isPathAllowedForRole(fromPath, role)) {
    return fromPath;
  }
  return getDefaultRouteForRole(role);
}
