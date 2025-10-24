import { create } from "zustand";
import DEFAULT_USER from "../mock/userOptions.json";

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

interface UserState extends UserType {
    getUser: () => UserType;
    setUser: (user: UserType) => void;
    setUsername: (username: string) => void;
    setUserDomain: (domain: DomainType) => void;
    setMenuOptions: (menuOptions: MenuOption[]) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
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
        loginTime: get().loginTime
    }),

    setUser: (user: UserType) =>
        set((state) => ({ ...state, ...user })),
    setUsername: (username: string) =>
        set((state) => ({ ...state, username })),
    setUserDomain: (domain: DomainType) =>
        set((state) => ({ ...state, domain })),
    setMenuOptions: (menuOptions: MenuOption[]) =>
        set((state) => ({ ...state, menuOptions }))
}));