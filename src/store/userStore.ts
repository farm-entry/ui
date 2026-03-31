import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { tokenStorage } from '../services/tokenStorage';
import { userApi } from '../services/userApi';
import type { DomainType, MenuOption, UserType } from './types/user';

interface UserState extends UserType {
  isLoading: boolean;
  error: string | null;
  getUser: () => UserType;
  setUser: (user: Partial<UserType>) => void;
  resetUser: () => void;
  setUserDomain: (domain: DomainType) => void;
  setMenuOptions: (menuOptions: MenuOption[]) => void;
  updateProfile: (payload: { firstName?: string; lastName?: string; email?: string }) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  switchDomain: (targetDomain: string) => Promise<void>;
}

const EMPTY_USER: UserType = {
  email: '',
  firstName: '',
  lastName: '',
  username: '',
  role: 'user',
  domain: null,
  domains: [],
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
      domains: get().domains,
      loginTime: get().loginTime,
      menuOptions: get().menuOptions,
    }),
    setUser: (user) => set((state) => ({ ...state, ...user })),
    resetUser: () => set(() => ({ ...EMPTY_USER })),
    setUserDomain: (domain) => set((state) => ({ ...state, domain })),
    setMenuOptions: (menuOptions) => set((state) => ({ ...state, menuOptions })),
    updateProfile: async (payload) => {
      const updated = await userApi.updateMe(payload);
      set((state) => ({ ...state, ...updated }));
    },
    changePassword: async (newPassword) => {
      await userApi.resetPassword(get().username, newPassword);
    },
    switchDomain: async (targetDomain) => {
      const { accessToken } = await userApi.switchDomain(targetDomain);
      const refresh = tokenStorage.getRefresh();
      tokenStorage.set(accessToken, refresh ?? '');
      set((state) => ({ ...state, domain: targetDomain }));
    },
  }), { name: 'UserStore' })
);
