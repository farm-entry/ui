import React, { createContext, useCallback, useContext } from "react";
// import { useUserQuery, User, useLoginMutation, useLogoutMutation, UserDocument, UserQuery, UserQueryVariables } from "../graphql";
// import FullPageSpinner from "../../common/components/FullPageSpinner";

// type AuthUser = Pick<User, "name" | "username">;

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Username or password are incorrect.");
    this.name = "InvalidCredentialsError";
  }
}

export class NoAvailableLicenseError extends Error {
  constructor() {
    super("No license is avaiable to access NAV.");
    this.name = "NoAvailableLicenseError";
  }
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  async login() {},
  async logout() {},
});

const AuthProvider: React.FC<any> = ({ children }) => {
  const login = useCallback(async (username: string, password: string) => {
    try {
      return;
    } catch (e: any) {
      const code = (e.graphQLErrors || [])[0].message || e;
      switch (code) {
        case "INVALID_CREDENTIALS":
          throw new InvalidCredentialsError();
        case "NO_AVAILABLE_LICENSE":
          throw new NoAvailableLicenseError();
        default:
          throw e;
      }
    }
  }, []);

  const logout = useCallback(async () => {
    return Promise.resolve();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: false,
        user: null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  //   return loading ? (
  //     <h1>plz wait ...</h1>
  //   ) : (
  //     <AuthContext.Provider
  //       value={{
  //         isAuthenticated: !!data && !!data.user,
  //         user: data && data.user ? data.user : null,
  //         login,
  //         logout,
  //       }}
  //     >
  //       {children}
  //     </AuthContext.Provider>
  //   );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
