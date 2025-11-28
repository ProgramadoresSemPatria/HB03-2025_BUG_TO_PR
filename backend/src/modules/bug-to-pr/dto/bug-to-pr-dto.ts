export interface GeneratePRDto {
  stackTrace: string;
  owner: string;
  repo: string;
  branch: string;
  userId?: string;
  aiProvider?: 'gemini' | 'openai';
}

export interface StackTraceInfo {
  filePath: string;
  lineNumber: number;
  columnNumber?: number;
  errorMessage: string;
  errorType: string;
}

export interface GitHubFileContent {
  content: string;
  sha: string;
  path: string;
}

export interface PatchInfo {
  patch: string;
  description: string;
  bugSummary: string;
  aiSummary?: string;
}

import { PRStatus } from '../constants';

export interface GeneratePRResponseDto {
  id: string;
  status: PRStatus;
  branch: string;
  prUrl: string | null;
  bugSummary: string;
  aiSummary: string | null;
  baseBranch: string;
  filePath: string;
  lineNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GitHubRepositoryDto {
  id: number;
  name: string;
  fullName: string;
  owner: {
    login: string;
  };
  private: boolean;
  defaultBranch: string;
  description: string | null;
  updatedAt: string;
} 

export interface GetRepositoriesDto {
  userId: string;
  type?: "all" | "owner" | "member";
  sort?: "created" | "updated" | "pushed" | "full_name";
  direction?: "asc" | "desc";
  perPage?: number;
  page?: number;
}

export interface GetHistoryDto {
  userId: string;
  status?: PRStatus;
  owner?: string;
  repo?: string;
  limit?: number;
  offset?: number;
}