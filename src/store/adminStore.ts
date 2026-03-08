import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authApi } from '../services/userApi';
import { UserType } from './types/user';

interface AdminState {
  users: UserType[];
  domains: string[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: (domain: string) => Promise<void>;
  fetchDomains: () => Promise<void>;
  createUser: (payload: { email: string; password: string; role: string; domain: string }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  resetPassword: (userId: string, newPassword: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  devtools((set, get) => ({
    users: [],
    domains: [],
    isLoading: false,
    error: null,

    fetchUsers: async (domain) => {
      set({ isLoading: true, error: null });
      try {
        const users = await authApi.fetchUsers(domain);
        set({ users, isLoading: false });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed to fetch users', isLoading: false });
      }
    },

    fetchDomains: async () => {
      try {
        const domains = await authApi.fetchDomains();
        set({ domains });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed to fetch domains' });
      }
    },

    createUser: async (payload) => {
      const user = await authApi.createUser(payload);
      set((state) => ({ users: [...state.users, user] }));
    },

    deleteUser: async (username) => {
      await authApi.deleteUser(username);
      set((state) => ({ users: state.users.filter((u) => u.username !== username) }));
    },

    resetPassword: async (userId, newPassword) => {
      await authApi.resetPassword(userId, newPassword);
    },
  }), { name: 'AdminStore' })
);
