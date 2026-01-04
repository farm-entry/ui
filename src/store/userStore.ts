import { create } from "zustand";
import { devtools } from "zustand/middleware";
import DEFAULT_USER from "../mock/userOptions.json";
import type { DomainType, MenuOption, UserType, UserAbbreviatedType } from "./types/user";
import { authApi } from "../services/userApi";

interface UserState extends UserType {
  users: UserAbbreviatedType[];
  isLoading: boolean;
  error: string | null;
  getUser: () => UserType;
  setUser: (user: UserType) => void;
  resetUser: () => void;
  setUsername: (username: string) => void;
  setUserDomain: (domain: DomainType) => void;
  setMenuOptions: (menuOptions: MenuOption[]) => void;
  fetchAllUsers: () => Promise<void>;
  getAllUsers: () => Promise<UserAbbreviatedType[]>;
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
  username: DEFAULT_USER.userData.username,
  domain: DEFAULT_USER.userData.domain as DomainType,
  menuOptions: DEFAULT_USER.menuOptions,
  name: DEFAULT_USER.userData.username,
  loginTime: "now",
  users: [],
  isLoading: false,
  error: null,
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
  
  fetchAllUsers: async () => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      const users = await authApi.fetchAllUsers();
      set((state) => ({ ...state, users, isLoading: false }));
    } catch (error) {
      console.error("Error fetching users:", error);
      set((state) => ({
        ...state,
        error: error instanceof Error ? error.message : "Failed to fetch users",
        isLoading: false,
      }));
    }
  },

  getAllUsers: async () => {
    try {
      if (get().users.length === 0) {
        set((state) => ({ ...state, isLoading: true, error: null }));
        const users = await authApi.fetchAllUsers();
        set((state) => ({ ...state, users, isLoading: false }));
      }
      return get().users;
    } catch (error) {
      console.error("Error fetching users:", error);
      set((state) => ({
        ...state,
        error: error instanceof Error ? error.message : "Failed to fetch users",
        isLoading: false,
      }));
      return [];
    }
  },
}), { name: "UserStore" })
);
