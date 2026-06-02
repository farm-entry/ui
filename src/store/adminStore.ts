import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { userApi } from '../services/userApi';
import { UserType } from './types/user';

interface AdminState {
  users: UserType[];
  domains: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (domain: string) => Promise<void>;
  fetchDomains: () => Promise<void>;
  createUser: (payload: { username: string; email: string; password: string; role: string; domains: Record<string, string[]>; firstName?: string; lastName?: string; isActive?: boolean; isEmailVerified?: boolean }) => Promise<void>;
  updateUser: (userId: string, payload: Partial<Pick<UserType, 'email' | 'firstName' | 'lastName' | 'domains' | 'role' | 'isActive' | 'isEmailVerified'>>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  resetPassword: (userId: string, newPassword: string) => Promise<void>;
  reset: () => void;
}

const initialAdminState = {
  users: [] as UserType[],
  domains: {} as Record<string, string[]>,
  isLoading: false,
  error: null as string | null,
};

export const useAdminStore = create<AdminState>()(
  devtools((set) => ({
    ...initialAdminState,

    fetchUsers: async (domain) => {
      set({ isLoading: true, error: null });
      try {
        const users = await userApi.fetchUsers(domain);
        set({ users, isLoading: false });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed to fetch users', isLoading: false });
      }
    },

    fetchDomains: async () => {
      try {
        const domains = await userApi.fetchDomains();
        set({ domains });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed to fetch domains' });
      }
    },

    createUser: async (payload) => {
      const user = await userApi.createUser(payload);
      set((state) => ({ users: [...state.users, user] }));
    },

    updateUser: async (userId, payload) => {
      const updated = await userApi.updateUser(userId, payload);
      set((state) => ({ users: state.users.map((u) => (u.username === userId ? updated : u)) }));
    },

    deleteUser: async (username) => {
      await userApi.deleteUser(username);
      set((state) => ({ users: state.users.filter((u) => u.username !== username) }));
    },

    resetPassword: async (userId, newPassword) => {
      await userApi.resetPassword(userId, newPassword);
    },

    reset: () => set(initialAdminState),
  }), { name: 'AdminStore' })
);
