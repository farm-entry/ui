import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { tokenStorage } from '../services/tokenStorage';
import { userApi } from '../services/userApi';
import type { DomainType, MenuOption, UserFilters, UserType } from './types/user';
import { DEFAULT_USER_FILTERS } from './types/user';
import { useAdminStore } from './adminStore';
import { useConfigStore } from './configStore';
import { useEmployeeStore } from './employeeStore';
import { useFormStorageStore } from './formStorageStore';
import { useGlobalAlertStore } from './globalAlertStore';
import { useInventoryStore } from './inventoryStore';
import { useLivestockActivityStore } from './livestockActivityStore';
import { useMaintenanceStore } from './maintenanceStore';
import { usePingStore } from './pingStore';
import { useScorecardStore } from './scorecardStore';

interface UserState extends UserType {
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  getUser: () => UserType;
  setUser: (user: Partial<UserType>) => void;
  resetUser: () => void;
  setUserDomain: (domain: DomainType) => void;
  setMenuOptions: (menuOptions: MenuOption[]) => void;
  updateProfile: (payload: { firstName?: string; lastName?: string; email?: string }) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  switchDomain: (targetDomain: string) => Promise<void>;
  setFilters: (filters: UserFilters) => void;
  saveFilters: (filters: UserFilters) => Promise<void>;
  loadFilters: () => Promise<void>;
}

const EMPTY_USER: UserType = {
  email: '',
  firstName: '',
  lastName: '',
  username: '',
  role: 'user',
  domain: null,
  domains: {},
  isActive: true,
  isEmailVerified: false,
  loginTime: '',
  menuOptions: [],
};

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    isLoading: false,
    error: null,
    filters: { ...DEFAULT_USER_FILTERS },
    ...EMPTY_USER,
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
      filters: get().filters,
    }),
    setUser: (user) => set((state) => ({ ...state, ...user })),
    resetUser: () => set(() => ({ ...EMPTY_USER, filters: { ...DEFAULT_USER_FILTERS } })),
    setUserDomain: (domain) => set((state) => ({ ...state, domain })),
    setMenuOptions: (menuOptions) => set((state) => ({ ...state, menuOptions })),
    updateProfile: async (payload) => {
      const updated = await userApi.updateMe(payload);
      set((state) => ({ ...state, ...updated }));
    },
    changePassword: async (newPassword) => {
      await userApi.resetPassword(get().username, newPassword);
    },
    switchDomain: async (targetDomain: string) => {
      const { accessToken } = await userApi.switchDomain(targetDomain);
      const refresh = tokenStorage.getRefresh();

      // Reset every store except userStore itself and confirmationStore
      useAdminStore.getState().reset();
      useConfigStore.getState().reset();
      useEmployeeStore.getState().reset();
      useFormStorageStore.getState().reset();
      useGlobalAlertStore.getState().reset();
      useInventoryStore.getState().reset();
      useLivestockActivityStore.getState().reset();
      useMaintenanceStore.getState().reset();
      usePingStore.getState().reset();
      // Dynamic import to avoid circular dependency (postingGroupsStore imports userStore)
      const { usePostingGroupsStore } = await import('./postingGroupsStore');
      usePostingGroupsStore.getState().reset();
      useScorecardStore.getState().reset();

      // Update token and user state
      tokenStorage.set(accessToken, refresh ?? '');
      set((state) => ({ ...state, domain: targetDomain }));
    },
    setFilters: (filters) => set((state) => ({ ...state, filters })),
    saveFilters: async (filters) => {
      const saved = await userApi.saveFilters(filters);
      set((state) => ({ ...state, filters: saved }));
    },
    loadFilters: async () => {
      const filters = await userApi.getFilters();
      set((state) => ({ ...state, filters }));
    },
  }), { name: 'UserStore' })
);
