import type { UserRole } from "../types/api";
import { PARTICIPANT_PORTAL_ROLES, UserRoles } from "../constants/userRoles";

const ROLE_NAME_TO_VALUE: Record<string, UserRole> = {
  Admin: UserRoles.Admin,
  Researcher: UserRoles.Researcher,
  Participant: UserRoles.Participant,
  Support: UserRoles.Support,
  Finance: UserRoles.Finance,
};

export function normalizeUserRole(role: unknown): UserRole | null {
  if (typeof role === "number" && role >= 1 && role <= 5) {
    return role as UserRole;
  }

  if (typeof role === "string") {
    const trimmed = role.trim();
    if (ROLE_NAME_TO_VALUE[trimmed] !== undefined) {
      return ROLE_NAME_TO_VALUE[trimmed];
    }

    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 5) {
      return numeric as UserRole;
    }
  }

  return null;
}

export function isParticipantRole(role: unknown): boolean {
  const normalized = normalizeUserRole(role);
  return normalized !== null && PARTICIPANT_PORTAL_ROLES.includes(normalized);
}
