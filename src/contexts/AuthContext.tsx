import { createContext, useContext, useState, useEffect } from "react";
import { useAuthApi } from "../services/apiClient";
import type { UserDto } from "../types/api";

type AuthContextType = {
  user: UserDto | null;
  isLoading: boolean;
  signin: (userData: UserDto, token: string, refreshToken?: string) => void;
  signout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signin: () => {},
  signout: () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authApi = useAuthApi();

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error: any) {
          // Token invalid or expired, clear it silently
          // Don't show error snackbar for this - it's expected behavior
          console.log("Token validation failed, clearing stored tokens");
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const handleSignin = (userData: UserDto, token: string, refreshToken?: string) => {
    setUser(userData);
    localStorage.setItem("authToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const handleSignout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    }
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      // If refresh fails, sign out
      handleSignout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signin: handleSignin,
        signout: handleSignout,
        user,
        isLoading,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
