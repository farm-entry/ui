import { useCallback, useEffect, useState } from 'react';
import { tokenStorage } from '../services/tokenStorage';
import { authApi, LoginCredentials } from '../services/userApi';
import { useUserStore } from '../store/userStore';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { setUser, resetUser } = useUserStore();

  useEffect(() => {
    const token = tokenStorage.getAccess();
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    authApi.getMe()
      .then((user) => {
        setUser({
          ...user,
          name: user.email,
          loginTime: new Date().toISOString()
        });
        setIsAuthenticated(true);
      })
      .catch(() => {
        tokenStorage.clear();
        setIsAuthenticated(false);
      });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      tokenStorage.set(response.accessToken, response.refreshToken);
      setUser({
        ...response,
        loginTime: new Date().toISOString(),
        menuOptions: [],
      });
      setIsAuthenticated(true);
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
      await authApi.logout();
      resetUser();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, logout, isLoading, error, isAuthenticated, clearError: () => setError(null) };
}
