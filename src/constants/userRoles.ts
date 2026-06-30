import type { UserRole } from "../types/api";

export const UserRoles = {
  Admin: 1,
  Researcher: 2,
  Participant: 3,
  Support: 4,
  Finance: 5,
} as const satisfies Record<string, UserRole>;

export const RESEARCHER_WORKSPACE_ROLES: UserRole[] = [
  UserRoles.Admin,
  UserRoles.Researcher,
  UserRoles.Support,
  UserRoles.Finance,
];

export const PARTICIPANT_PORTAL_ROLES: UserRole[] = [UserRoles.Participant];

export const RESEARCHER_HOME = "/projects/dashboard";
export const PARTICIPANT_HOME = "/surveys/allsurveys";

export function getDefaultRouteForRole(role: UserRole): string {
  if (PARTICIPANT_PORTAL_ROLES.includes(role)) {
    return PARTICIPANT_HOME;
  }
  return RESEARCHER_HOME;
}
