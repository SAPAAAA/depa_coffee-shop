import { httpClient } from "@/utils/httpClient";
import { type User } from "@/contexts/AuthContext";

class AuthService {
  login = async (username: string, password: string, role: string) => {
    const response = await httpClient.post<{ user: User }>("/api/auth/login", {
      username,
      password,
      role,
    });

    console.log("Login response:", response);
    return response.user;
  };

  logout = async () => {
    await httpClient.post("/api/auth/logout");
  };

  getMe = async (): Promise<User | null> => {
    try {
      const response = await httpClient.get<{ user: User }>("/api/auth/me");
      return response.user;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return null;
    }
  }
}

const authService = new AuthService();

export default authService;
export const { login, logout, getMe } = authService;
