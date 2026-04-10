import { useCallback, useEffect, useRef, useState } from 'react';
import { tokenStorage } from '../services/tokenStorage';
import { userApi, LoginCredentials } from '../services/userApi';
import { useUserStore } from '../store/userStore';
import { useConfigStore } from '../store/configStore';

// Parse JWT expiry — returns ms until expiry, or null
function msUntilExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return null;
    return payload.exp * 1000 - Date.now();
  } catch {
    return null;
  }
}

const REFRESH_BUFFER_MS = 2 * 60 * 1000;  // refresh 2 min before expiry
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // match access token lifetime

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { setUser, resetUser } = useUserStore();
  const { fetchDomains } = useConfigStore();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Update last-activity timestamp on user interaction
  useEffect(() => {
    const onActivity = () => { lastActivityRef.current = Date.now(); };
    const events = ['mousemove', 'keydown', 'pointerdown', 'scroll'];
    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, onActivity));
  }, []);

  const scheduleProactiveRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const token = tokenStorage.getAccess();
    if (!token) return;

    const ms = msUntilExpiry(token);
    if (ms === null) return;

    const delay = Math.max(ms - REFRESH_BUFFER_MS, 0);

    refreshTimerRef.current = setTimeout(async () => {
      // Skip refresh if the user has been idle for the full token window
      if (Date.now() - lastActivityRef.current >= IDLE_TIMEOUT_MS) return;

      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) {
        tokenStorage.clear();
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) {
          tokenStorage.clear();
          setIsAuthenticated(false);
          window.location.assign('/login');
          return;
        }
        const { accessToken, refreshToken: newRefresh } = await res.json();
        tokenStorage.set(accessToken, newRefresh);
        scheduleProactiveRefresh();
      } catch {
        // Network error — don't force logout; reactive 401 handling covers it
      }
    }, delay);
  }, []);

  useEffect(() => {
    const token = tokenStorage.getAccess();
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    userApi.getMe()
      .then((user) => {
        setUser({
          ...user,
          name: user.email,
          loginTime: new Date().toISOString()
        });
        setIsAuthenticated(true);
        scheduleProactiveRefresh();
      })
      .catch(() => {
        tokenStorage.clear();
        setIsAuthenticated(false);
      });

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleProactiveRefresh]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.login(credentials);
      tokenStorage.set(response.accessToken, response.refreshToken);
      setUser({
        ...response,
        loginTime: new Date().toISOString(),
        menuOptions: [],
      });
      setIsAuthenticated(true);
      scheduleProactiveRefresh();
      fetchDomains().catch(() => { });
      return response;
    } catch (err) {
      setIsAuthenticated(false);
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await userApi.logout();
      resetUser();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, logout, isLoading, error, isAuthenticated, clearError: () => setError(null) };
}
