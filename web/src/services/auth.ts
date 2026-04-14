import { httpClient } from "@/utils/httpClient";
import { type User } from "@/contexts/AuthContext";

class AuthService {
  login = async (username: string, password: string, role: string) => {
    const response = await httpClient.post<{ user: User }>("/api/auth/login", {
      username,
      password,
      role,
    });
    return response.user;
  };

  logout = async () => {
    await httpClient.post("/auth/logout");
  };
}

const authService = new AuthService();

export default authService;
export const { login, logout } = authService;
