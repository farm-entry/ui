import { UserType } from '../store/types/user';
import { apiFetch } from './apiFetch';
import { tokenStorage } from './tokenStorage';

export interface LoginCredentials {
  username: string;
  password: string;
  domain: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class UserApi {
  async login(credentials: LoginCredentials): Promise<TokenPair & UserType> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  }

  async logout(): Promise<void> {
    const raw = tokenStorage.getRefresh();
    if (raw) {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: raw }),
      }).catch(() => { });
    }
    tokenStorage.clear();
    window.location.assign('/login');
  }

  async getMe(): Promise<any> {
    const res = await apiFetch('/api/auth/me');
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  }

  async switchDomain(targetDomain: string): Promise<{ accessToken: string }> {
    const res = await apiFetch('/api/auth/switch-domain', {
      method: 'POST',
      body: JSON.stringify({ domain: targetDomain }),
    });
    if (!res.ok) throw new Error('Domain switch failed');
    return res.json();
  }

  async fetchDomains(): Promise<string[]> {
    const res = await apiFetch('/api/admin/domains');
    if (!res.ok) throw new Error('Failed to fetch domains');
    return res.json();
  }

  async fetchUsers(domain?: string): Promise<UserType[]> {
    const res = await apiFetch(`/api/admin/users?domain=${domain}`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  }

  async createUser(payload: { email: string; password: string; role: string; domain: string }): Promise<UserType> {
    const res = await apiFetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  }

  async updateUser(userId: string, payload: Partial<Pick<UserType, 'email' | 'firstName' | 'lastName' | 'domain' | 'role'>>): Promise<UserType> {
    const res = await apiFetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  }

  async deleteUser(userId: string): Promise<void> {
    const res = await apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete user');
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const res = await apiFetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
    if (!res.ok) throw new Error('Failed to reset password');
  }
}

export const userApi = new UserApi();
