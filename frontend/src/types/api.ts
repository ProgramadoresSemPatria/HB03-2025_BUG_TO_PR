export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface BugToPRPayload {
  userId: string;
  owner: string;
  repo: string;
  branch: string;
  stackTrace: string;
}

export interface BugToPRResponse {
  prUrl: string;
  branch: string;
  summary: string;
  filePath: string;
  lineNumber: number;
  tokensUsed: number;
}

