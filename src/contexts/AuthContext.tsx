import { createContext, useContext, useState } from "react";

type userType = {
  fullname: string;
  email: string;
};

type authContextType = {
  user: userType;
  signin: (userData: any) => void;
  signout: () => void;
};

const AuthContext = createContext<authContextType | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  return (
    <AuthContext.Provider
      value={{
        signin: (userData: userType) => setUser(userData),
        signout: () => setUser(null),
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
