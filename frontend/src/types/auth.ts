export interface User {
  id: string;
  email: string;
  name?: string;
  githubToken?: string;
  createdAt: Date;
}

export interface AuthFormData {
  email: string;
  password: string;
  githubToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  githubToken: string;
}

