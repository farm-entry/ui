import { tokenStorage } from './tokenStorage';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const raw = tokenStorage.getRefresh();
    if (!raw) return false;

    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: raw }),
      });
      if (!res.ok) return false;
      const { accessToken, refreshToken }: TokenPair = await res.json();
      tokenStorage.set(accessToken, refreshToken);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = tokenStorage.getAccess();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshed = await tryRefresh();
    if (!refreshed) {
      tokenStorage.clear();
      window.location.assign('/login');
      throw new Error('Session expired');
    }
    headers.Authorization = `Bearer ${tokenStorage.getAccess()}`;
    response = await fetch(url, { ...options, headers });
  }

  return response;
}
