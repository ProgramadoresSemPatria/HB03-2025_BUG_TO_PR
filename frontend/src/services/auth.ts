import type { User, LoginCredentials, RegisterCredentials } from "@/types";
import { api } from "./api";

/**
 * Auth Service
 * 
 * Endpoints:
 * - POST /api/v1/auth/users - Register user
 *   Body: { email, password, githubPersonalAccessToken }
 *   Returns: { id, email, githubPersonalAccessToken }
 * 
 * - POST /api/v1/auth/sessions - Login user
 *   Body: { email, password }
 *   Returns: { user: { id, email, githubPersonalAccessToken }, token }
 */
class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<{ 
      user: { id: string; email: string; githubPersonalAccessToken: string }; 
      token: string 
    }>(
      "/auth/sessions",
      credentials
    );
    
    localStorage.setItem("auth_token", response.data.token);
    
    return {
      id: response.data.user.id,
      email: response.data.user.email,
      githubToken: response.data.user.githubPersonalAccessToken,
      createdAt: new Date(),
    };
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await api.post<{ id: string; email: string; githubPersonalAccessToken: string }>(
      "/auth/users",
      {
        email: credentials.email,
        password: credentials.password,
        githubPersonalAccessToken: credentials.githubToken,
      }
    );
    
    if (credentials.githubToken) {
      localStorage.setItem("github_token", credentials.githubToken);
    }
    
    return {
      id: response.data.id,
      email: response.data.email,
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

