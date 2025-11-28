import type { AnalysisFormData, PRData, AnalysisRecord, GetHistoryParams } from "@/types";
import { api } from "./api";

/**
 * Analysis Service
 * 
 * Endpoints:
 * - POST /api/v1/bug-to-pr/generate - Generate PR from stack trace
 *   Headers: Authorization: Bearer <token>
 *   Body: { stackTrace, owner, repo, branch, aiProvider? }
 *   Returns: { status, branch, prUrl, bugSummary, aiSummary }
 */
class AnalysisService {
  async analyze(
    formData: AnalysisFormData,
    onStepChange?: (step: number) => void
  ): Promise<PRData> {
    const steps = [1, 2, 3, 4, 5];
    let currentStep = 0;

    const requestPromise = api.post<{
      status: string;
      branch: string;
      prUrl: string | null;
      bugSummary: string;
      aiSummary: string | null;
      filePath: string;
      lineNumber: number;
    }>("/bug-to-pr/generate", {
      stackTrace: formData.stackTrace,
      owner: formData.owner,
      repo: formData.repo,
      branch: formData.branch,
      aiProvider: formData.aiProvider,
    });

    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        onStepChange?.(currentStep + 1);
        currentStep++;
      }
    }, 1500);

    try {
      const response = await requestPromise;
      clearInterval(stepInterval);
      onStepChange?.(steps.length); 

      return {
        prUrl: response.data.prUrl || "",
        branch: response.data.branch,
        summary: response.data.bugSummary + (response.data.aiSummary ? `\n\n${response.data.aiSummary}` : ""),
        filePath: response.data.filePath, 
        lineNumber: response.data.lineNumber, 
        tokensUsed: 0, 
      };
    } catch (error) {
      clearInterval(stepInterval);
      throw error;
    }
  }

  async getHistory(params?: GetHistoryParams): Promise<AnalysisRecord[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append("status", params.status);
    if (params?.owner) queryParams.append("owner", params.owner);
    if (params?.repo) queryParams.append("repo", params.repo);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = `/bug-to-pr/history${queryString ? `?${queryString}` : ""}`;

    const response = await api.get<{
      history: Array<{
        id: string;
        status: string;
        branch: string;
        prUrl: string | null;
        bugSummary: string;
        aiSummary: string | null;
        baseBranch: string;
        filePath: string;
        lineNumber: number;
        createdAt: string;
        updatedAt: string;
      }>;
    }>(endpoint);

    return response.data.history.map((item) => {
      let owner: string | undefined;
      let repo: string | undefined;
      let repoDisplay = "Repository";
      
      if (item.prUrl) {
        const match = item.prUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
          owner = match[1];
          repo = match[2];
          repoDisplay = `${owner}/${repo}`;
        }
      }

      return {
        id: item.id,
        repo: repoDisplay,
        branch: item.branch,
        prUrl: item.prUrl || "",
        status: item.status === "success" ? "success" : item.status === "pending" ? "pending" : item.status === "failed" ? "failed" : "error",
        createdAt: new Date(item.createdAt),
        summary: item.bugSummary + (item.aiSummary ? `\n\n${item.aiSummary}` : ""),
        owner,
        baseBranch: item.baseBranch,
        filePath: item.filePath,
        lineNumber: item.lineNumber,
      };
    });
  }
}

export const analysisService = new AnalysisService();

