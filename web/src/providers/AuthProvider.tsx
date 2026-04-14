import AuthContext, {
  type AuthContextValues,
  type User,
} from "@/contexts/AuthContext";
import { httpClient } from "@/utils/httpClient";
import { useCallback, useMemo, useState, type ReactNode } from "react";

const AuthProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(
    async (username: string, password: string, role: string) => {
      const response = await httpClient.post<{ user: User }>("/auth/login", {
        username,
        password,
        role,
      });
      setUser(response.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    await httpClient.post("/auth/logout");
    setUser(null);
  }, []);

  const values: AuthContextValues = useMemo(() => {
    return {
      user: user,
      login: login,
      logout: logout,
    };
  }, [user, login, logout]);
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
