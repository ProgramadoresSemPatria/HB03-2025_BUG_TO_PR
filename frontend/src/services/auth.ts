import type { User, LoginCredentials, RegisterCredentials } from "@/types";
import { api } from "./api";

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    // TODO: Replace with actual API call
    // const response = await api.post<{ user: User; token: string }>("/auth/login", credentials);
    // localStorage.setItem("auth_token", response.data.token);
    // return response.data.user;

    // Mock for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: "1",
      email: credentials.email,
      createdAt: new Date(),
    };
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    // TODO: Replace with actual API call
    // const response = await api.post<{ user: User; token: string }>("/auth/register", credentials);
    // localStorage.setItem("auth_token", response.data.token);
    // if (credentials.githubToken) {
    //   localStorage.setItem("github_token", credentials.githubToken);
    // }
    // return response.data.user;

    // Mock for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (credentials.githubToken) {
      localStorage.setItem("github_token", credentials.githubToken);
    }
    return {
      id: "1",
      email: credentials.email,
      createdAt: new Date(),
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("github_token");
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    // TODO: Replace with actual API call
    // const response = await api.get<User>("/auth/me");
    // return response.data;

    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  getGithubToken(): string | null {
    return localStorage.getItem("github_token");
  }
}

export const authService = new AuthService();

