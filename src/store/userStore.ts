import { create, StateCreator } from "zustand";
import DEFAULT_USER from "../mock/userOptions.json";

export type DomainType = "moglerfarms" | "sondfarms";

export interface UserData {
    username: string;
    domain: DomainType
}

export interface MenuOption {
    title: string;
    segment: string; // Add segment property for navigation mapping
    description?: string; // Optional description field
    hidden: boolean;
}

export interface UserInfo {
    userData: UserData;
    menuOptions: MenuOption[];
}

interface UserInfoState {
    user: UserInfo;
    getUser: () => UserInfo;
    setUser: (user: UserInfo) => void;
    setMenuOptions: (menuOptions: MenuOption[]) => void;
}

type UserStore = StateCreator<UserInfoState>;

export const useUserStore = create<UserInfoState>(
    ((set: (fn: (state: UserInfoState) => UserInfoState) => void, get: () => UserInfoState) => ({
        user: DEFAULT_USER as UserInfo,

        getUser: () => get().user,

        setUser: (user: UserInfo) =>
            set((state: UserInfoState) => ({ ...state, user })),

        setMenuOptions: (menuOptions: MenuOption[]) =>
            set((state: UserInfoState) => ({ ...state, user: { ...state.user, menuOptions } })),
    })) as UserStore
);