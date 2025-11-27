import type { AnalysisFormData, PRData, BugToPRPayload } from "@/types";
import { api } from "./api";

// Simulate step delays for demo
const STEP_DELAYS = [1500, 2000, 2500, 1500, 2000];

class AnalysisService {
  async analyze(
    formData: AnalysisFormData,
    onStepChange?: (step: number) => void
  ): Promise<PRData> {
    // Simulate the process with steps
    for (let i = 0; i < STEP_DELAYS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, STEP_DELAYS[i]));
      onStepChange?.(i + 1);
    }

    // TODO: Replace with actual API call
    // const payload: BugToPRPayload = {
    //   userId: "current-user-id",
    //   owner: formData.owner,
    //   repo: formData.repo,
    //   branch: formData.branch,
    //   stackTrace: formData.stackTrace,
    // };
    // const response = await api.post<PRData>("/agents/bug-to-pr", payload);
    // return response.data;

    // Mock result for now
    return {
      prUrl: `https://github.com/${formData.owner}/${formData.repo}/pull/42`,
      branch: `fix/bug-${Date.now().toString(36)}`,
      summary:
        "Fixed NullPointerException caused by uninitialized variable in the authentication flow. The error occurred when processing user sessions without valid tokens.",
      filePath: "src/services/AuthService.java",
      lineNumber: 127,
      tokensUsed: 1847,
    };
  }

  parseStackTrace(stackTrace: string): { filePath: string; lineNumber: number } | null {
    // Common patterns for different languages
    const patterns = [
      // JavaScript/TypeScript: at Function (file.ts:10:5)
      /at\s+(?:\w+\s+)?\((.+):(\d+):\d+\)/,
      // Python: File "file.py", line 10
      /File\s+"(.+)",\s+line\s+(\d+)/,
      // Java: at package.Class.method(File.java:10)
      /at\s+[\w.]+\((.+):(\d+)\)/,
      // Go: file.go:10
      /^\s*(.+\.go):(\d+)/m,
    ];

    for (const pattern of patterns) {
      const match = stackTrace.match(pattern);
      if (match) {
        return {
          filePath: match[1],
          lineNumber: parseInt(match[2], 10),
        };
      }
    }

    return null;
  }
}

export const analysisService = new AnalysisService();

