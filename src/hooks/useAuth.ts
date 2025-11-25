import { useCallback, useEffect, useState } from 'react';
import { authApi, LoginCredentials, LoginResponse } from '../services/userApi';

export interface UseLoginResult {
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean | null;
    clearError: () => void;
}

export function useAuth(): UseLoginResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse> => {
        setIsLoading(true);
        setError(null);
        console.log('Attempting login with credentials:', credentials);
        try {
            const response = await authApi.login(credentials);
            setIsAuthenticated(true);
            return response;
        } catch (err) {
            setIsAuthenticated(false);
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await authApi.logout();
            setIsAuthenticated(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Check authentication status on hook initialization
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const authenticated = await authApi.isAuthenticated();
                setIsAuthenticated(authenticated);
            } catch (err) {
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, []);

    return {
        login,
        logout,
        isLoading,
        error,
        isAuthenticated,
        clearError,
    };
}
