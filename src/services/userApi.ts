import { UserType } from '../store/types/user';
import type { DomainConfig } from '../store/types/config';
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
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const err = isJson ? await res.json() : null;
      throw new Error(err?.error || `Login failed (${res.status})`);
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

  async updateMe(payload: { firstName?: string; lastName?: string; email?: string }): Promise<UserType> {
    const res = await apiFetch('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }

  // Available to all authenticated users (not just app_admin)
  async switchDomain(targetDomain: string): Promise<{ accessToken: string }> {
    const res = await apiFetch('/api/auth/switch-domain', {
      method: 'POST',
      body: JSON.stringify({ domain: targetDomain }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Domain switch failed');
    }
    return res.json();
  }

  async fetchDomains(): Promise<string[]> {
    const res = await apiFetch('/api/admin/domains');
    if (!res.ok) throw new Error('Failed to fetch domains');
    return res.json();
  }

  async fetchDomainConfigs(): Promise<DomainConfig[]> {
    const res = await apiFetch('/api/config/domains');
    if (!res.ok) throw new Error('Failed to fetch domain configs');
    return res.json();
  }

  async fetchUsers(domain?: string): Promise<UserType[]> {
    const res = await apiFetch(`/api/admin/users?domain=${domain}`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  }

  async createUser(payload: { email: string; password: string; role: string; domains: string[] }): Promise<UserType> {
    const res = await apiFetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  }

  async updateUser(userId: string, payload: Partial<Pick<UserType, 'email' | 'firstName' | 'lastName' | 'domains' | 'role'>>): Promise<UserType> {
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
