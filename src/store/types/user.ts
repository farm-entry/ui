export type DomainType = string | null;
export type RolesType = 'user' | 'admin' | 'app_admin' | null;

export interface MenuOption {
  title: string;
  segment: string;
  description?: string;
  hidden: boolean;
}

export interface UserType {
  loginTime: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  domain: DomainType;
  role: RolesType;
  menuOptions: MenuOption[];
}
