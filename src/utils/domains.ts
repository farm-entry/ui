import type { DomainType, RolesType } from '../store/types/user';

export function getSwitchableDomains(
  role: RolesType,
  userDomains: Record<string, string[]>,
  adminDomains: Record<string, string[]>,
  currentDomain: DomainType
): string[] {
  const hasWildcard = Object.values(userDomains).flat().includes('*');
  const raw = (role === 'app_admin' || hasWildcard)
    ? Object.values(adminDomains).flat()
    : Object.values(userDomains).flat();

  return [...new Set(raw)].filter((d) => d !== currentDomain);
}
