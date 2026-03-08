import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DomainType, MenuOption, UserType } from './types/user';

interface UserState extends UserType {
  isLoading: boolean;
  error: string | null;
  getUser: () => UserType;
  setUser: (user: Partial<UserType>) => void;
  resetUser: () => void;
  setUserDomain: (domain: DomainType) => void;
  setMenuOptions: (menuOptions: MenuOption[]) => void;
}

const EMPTY_USER: UserType = {
  email: '',
  firstName: '',
  lastName: '',
  username: '',
  role: 'user',
  domain: null,
  loginTime: '',
  menuOptions: [],
};

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    isLoading: false,
    error: null,
    getUser: () => ({
      email: get().email,
      username: get().username,
      firstName: get().firstName,
      lastName: get().lastName,
      role: get().role,
      domain: get().domain,
      loginTime: get().loginTime,
      menuOptions: get().menuOptions,
    }),
    setUser: (user) => set((state) => ({ ...state, ...user })),
    resetUser: () => set(() => ({ ...EMPTY_USER })),
    setUserDomain: (domain) => set((state) => ({ ...state, domain })),
    setMenuOptions: (menuOptions) => set((state) => ({ ...state, menuOptions })),
  }), { name: 'UserStore' })
);
