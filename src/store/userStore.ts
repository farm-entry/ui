import { create } from "zustand";
import DEFAULT_USER from "../mock/userOptions.json";

export type DomainType = "moglerfarms" | "sondfarms";

export interface MenuOption {
    title: string;
    segment: string;
    description?: string;
    hidden: boolean;
}

interface UserState {
    username: string;
    domain: DomainType;
    menuOptions: MenuOption[];
    getUser: () => { username: string; domain: DomainType; menuOptions: MenuOption[] };
    setUser: (username: string) => void;
    setMenuOptions: (menuOptions: MenuOption[]) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    username: DEFAULT_USER.userData.username,
    domain: DEFAULT_USER.userData.domain as DomainType,
    menuOptions: DEFAULT_USER.menuOptions,

    getUser: () => ({
        username: get().username,
        domain: get().domain,
        menuOptions: get().menuOptions
    }),

    setUser: (username: string) =>
        set((state) => ({ ...state, username })),

    setMenuOptions: (menuOptions: MenuOption[]) =>
        set((state) => ({ ...state, menuOptions }))
}));