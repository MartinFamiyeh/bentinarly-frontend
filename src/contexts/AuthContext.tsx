import { createContext, useContext, useState } from "react";

type UserType = {
  id: string;
  email: string;
  fullname: string;
  firstname: string;
  lastname: string;
  mobileNumber: string;
  role: string;
};

type AuthContextType = {
  user: UserType | null;
  signin: (userData: UserType) => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signin: () => {},
  signout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  const handleSignin = (userData: UserType) => {
    setUser(userData);
  };

  const handleSignout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signin: handleSignin,
        signout: handleSignout,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
