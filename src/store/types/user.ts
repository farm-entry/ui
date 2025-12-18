export type DomainType = "moglerfarms" | "sondfarms";

export interface MenuOption {
  title: string;
  segment: string;
  description?: string;
  hidden: boolean;
}

export interface UserType {
  name: string;
  loginTime: string;
  username: string;
  domain: DomainType;
  menuOptions: MenuOption[];
}
