export interface PRData {
  prUrl: string;
  branch: string;
  summary: string;
  filePath: string;
  lineNumber: number;
  tokensUsed: number;
}

export interface AnalysisRecord {
  id: string;
  repo: string;
  branch: string;
  prUrl: string;
  status: "success" | "error";
  createdAt: Date;
  summary: string;
}

export interface AnalysisFormData {
  owner: string;
  repo: string;
  branch: string;
  stackTrace: string;
}

export type ViewState = "form" | "loading" | "result";

export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  description: string;
  type: "feature" | "release" | "fix";
}

export interface CodeLine {
  text: string;
  type: "error" | "trace" | "step" | "success" | "link" | "empty";
  delay: number;
}

