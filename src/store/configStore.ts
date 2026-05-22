import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { userApi } from '../services/userApi';
import type { DomainConfig } from './types/config';

const CACHE_KEY = 'farmentry_domain_configs';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CachePayload {
  domains: DomainConfig[];
  loadedAt: number;
}

function loadFromCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachePayload = JSON.parse(raw);
    if (Date.now() - parsed.loadedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToCache(payload: CachePayload): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch { }
}

interface ConfigState {
  domains: DomainConfig[];
  loadedAt: number | null;
  fetchDomains: () => Promise<void>;
  getDomainColor: (name: string) => string | undefined;
  getDomain: (name: string) => DomainConfig | undefined;
  invalidate: () => void;
  reset: () => void;
}

const cached = loadFromCache();

export const useConfigStore = create<ConfigState>()(
  devtools(
    (set, get) => ({
      domains: cached?.domains ?? [],
      loadedAt: cached?.loadedAt ?? null,

      fetchDomains: async () => {
        const { loadedAt } = get();
        if (loadedAt && Date.now() - loadedAt < CACHE_TTL_MS) return;

        const domains = await userApi.fetchDomainConfigs();
        const loadedAtNow = Date.now();
        set({ domains, loadedAt: loadedAtNow });
        saveToCache({ domains, loadedAt: loadedAtNow });
      },

      getDomainColor: (name) => get().domains.find((d) => d.name === name)?.color,

      getDomain: (name) => get().domains.find((d) => d.name === name),

      invalidate: () => {
        localStorage.removeItem(CACHE_KEY);
        set({ domains: [], loadedAt: null });
      },

      reset: () => get().invalidate(),
    }),
    { name: 'ConfigStore' }
  )
);
