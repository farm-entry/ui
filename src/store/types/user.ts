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

export interface UserAbbreviatedType {
  User_Security_ID: string;
  User_Name: string;
  License_Type: string;
  Full_Name: string;
}
