import AuthContext, {
  type AuthContextValues,
  type User,
} from "@/contexts/AuthContext";
import authService from "@/services/auth";
import { httpClient } from "@/utils/httpClient";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const AuthProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    };

    fetchCurrentUser();
  }, []);

  const login = useCallback(
    async (username: string, password: string, role: string) => {
      const user = await authService.login(username, password, role);
      setUser(user);
    },
    [],
  );

  const logout = useCallback(async () => {
    await httpClient.post("/api/auth/logout");
    await authService.logout();
    setUser(null);
  }, []);

  const values: AuthContextValues = useMemo(() => {
    return {
      user: user,
      setUser: setUser,
      login: login,
      logout: logout,
    };
  }, [user, login, logout]);
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
