import { create } from "zustand";
import { devtools } from "zustand/middleware";
import DEFAULT_USER from "../mock/userOptions.json";
import type { DomainType, MenuOption, UserType } from "./types/user";

interface UserState extends UserType {
  getUser: () => UserType;
  setUser: (user: UserType) => void;
  resetUser: () => void;
  setUsername: (username: string) => void;
  setUserDomain: (domain: DomainType) => void;
  setMenuOptions: (menuOptions: MenuOption[]) => void;
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
  username: DEFAULT_USER.userData.username,
  domain: DEFAULT_USER.userData.domain as DomainType,
  menuOptions: DEFAULT_USER.menuOptions,
  name: DEFAULT_USER.userData.username,
  loginTime: "now",
  getUser: () => ({
    username: get().username,
    domain: get().domain,
    menuOptions: get().menuOptions,
    name: get().name,
    loginTime: get().loginTime,
  }),
  resetUser: () => ({
    username: "",
    domain: "",
    menuOptions: "",
    name: "",
    loginTime: "",
  }),
  setUser: (user: UserType) => set((state) => ({ ...state, ...user })),
  setUsername: (username: string) => set((state) => ({ ...state, username })),
  setUserDomain: (domain: DomainType) => set((state) => ({ ...state, domain })),
  setMenuOptions: (menuOptions: MenuOption[]) =>
    set((state) => ({ ...state, menuOptions })),
}), { name: "UserStore" })
);
