export type DomainType = string | null;
export type RolesType = 'user' | 'admin' | 'app_admin' | null;

export interface MenuOption {
  title: string;
  segment: string;
  description?: string;
  hidden: boolean;
}

export interface UserType {
  _id: string;
  loginTime: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  /** Currently active domain — sent with every API request. */
  domain: DomainType;
  /** All domains this user is allowed to access, keyed by parent farm. */
  domains: Record<string, string[]>;
  role: RolesType;
  isActive: boolean;
  isEmailVerified: boolean;
  menuOptions: MenuOption[];
  filters?: UserFilters;
}

export type InclusivityMode = 'INCLUDE' | 'EXCLUDE';

export interface FilterLocation {
  code: string;
  name: string;
}

export interface FilterPostingGroup {
  code: string;
  description?: string;
}

export interface FilterMenuOption {
  title: string;
  segment: string;
}

export interface FilterCategory<T> {
  mode: InclusivityMode;
  list: T[];
}

export interface UserFilters {
  locations: FilterCategory<FilterLocation>;
  postingGroups: FilterCategory<FilterPostingGroup>;
  menuOptions: FilterCategory<FilterMenuOption>;
}

export const DEFAULT_USER_FILTERS: UserFilters = {
  locations: { mode: 'INCLUDE', list: [] },
  postingGroups: { mode: 'INCLUDE', list: [] },
  menuOptions: { mode: 'INCLUDE', list: [] },
};

export interface UserPreferences {
  domainColors: Record<string, string>;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  domainColors: {},
};
