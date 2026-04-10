import type { RolesType } from '../store/types/user';

/** Ordered from lowest to highest privilege. */
export const ROLE_HIERARCHY: Exclude<RolesType, null>[] = ['user', 'admin', 'app_admin'];

export const ROLE_LABELS: Record<Exclude<RolesType, null>, string> = {
  user: 'User',
  admin: 'Admin',
  app_admin: 'App Admin',
};

/** Returns the numeric rank of a role (higher = more privileged). */
export function roleRank(role: RolesType): number {
  if (!role) return -1;
  return ROLE_HIERARCHY.indexOf(role);
}

/** Returns true if `actor` has at least the same privilege level as `target`. */
export function canManageRole(actor: RolesType, target: RolesType): boolean {
  return roleRank(actor) >= roleRank(target);
}

/**
 * Returns the subset of roles that `actor` is allowed to assign.
 * An actor may only assign roles at or below their own level.
 */
export function assignableRoles(actor: RolesType): { value: Exclude<RolesType, null>; label: string }[] {
  return ROLE_HIERARCHY
    .filter((role) => roleRank(role) <= roleRank(actor))
    .map((role) => ({ value: role, label: ROLE_LABELS[role] }));
}
