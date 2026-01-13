import { UserAbbreviatedType } from "../store/types/user";
import { HandleError } from "./handleError";

// Types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    username: string;
    name: string;
    loginTime: string;
  };
}

export interface SessionResponse {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    name: string;
    loginTime: string;
  };
  sessionID?: string;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

class AuthApi {
  /**
   * Login user with username and password
   * The API should set a httpOnly session cookie named 'sessionId' in the response
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // This ensures cookies are sent and received
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error("Login failed: Unknown error occurred");
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<{ message: string }> {
    try {
      const response = await fetch(`/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.error || `Logout failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Logout failed: ${error.message}`);
      }
      throw new Error("Logout failed: Unknown error occurred");
    } finally {
      window.location.assign("/login");
    }
  }

  /**
   * Check current session status
   */
  async checkSession(): Promise<SessionResponse> {
    try {
      const response = await fetch(`/api/auth/session`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Session check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Session check failed: ${error.message}`);
      }
      throw new Error("Session check failed: Unknown error occurred");
    }
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (process.env.FRONTLINE_SKIP_AUTH === "true") {
      return true;
    }
    try {
      const session = await this.checkSession();
      return session.authenticated;
    } catch (error) {
      console.warn("Authentication check failed:", error);
      return false;
    }
  }

  /**
   * Get current user information from session
   */
  async getCurrentUser(): Promise<SessionResponse["user"] | null> {
    if (process.env.FRONTLINE_SKIP_AUTH === "true") {
      return {
        id: "dev-user",
        username: "developer",
        name: "Dev User",
        loginTime: new Date().toISOString()
      };
    }
    try {
      const session = await this.checkSession();
      return session.authenticated ? session.user || null : null;
    } catch (error) {
      console.warn("Failed to get current user:", error);
      return null;
    }
  }

  async fetchAllUsers(): Promise<UserAbbreviatedType[]> {
    try {
      console.log("Fetching all users from API...");

      const response = await fetch(`/api/user`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "UserApi.fetchAllUsers");
      }

      const data: UserAbbreviatedType[] = await response.json();

      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Re-throw API errors as-is
        throw error;
      }

      // Handle unexpected errors
      const apiError = new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch users",
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      console.error("Unexpected error fetching users:", error);
      throw apiError;
    }
  }
}

export const authApi = new AuthApi();