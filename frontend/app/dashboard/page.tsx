"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Header, Footer } from "@/components/shared";
import {
  AnalysisForm,
  LoadingSteps,
  PRResult,
  AnalysisHistory,
} from "@/components/features/analysis";
import { MOCK_HISTORY } from "@/constants";
import type { PRData, AnalysisRecord, AnalysisFormData, ViewState } from "@/types";

export default function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [prData, setPRData] = useState<PRData | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>(MOCK_HISTORY);

  const [formData, setFormData] = useState<AnalysisFormData>({
    owner: "",
    repo: "",
    branch: "main",
    stackTrace: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.stackTrace.trim()) {
      toast.error("Please paste a stack trace");
      return;
    }

    setViewState("loading");
    setCurrentStep(0);

    // Simulate the process with steps
    const steps = [
      { delay: 1500, step: 1 },
      { delay: 2000, step: 2 },
      { delay: 2500, step: 3 },
      { delay: 1500, step: 4 },
      { delay: 2000, step: 5 },
    ];

    for (const { delay, step } of steps) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      setCurrentStep(step);
    }

    // Simulate result
    const mockResult: PRData = {
      prUrl: `https://github.com/${formData.owner}/${formData.repo}/pull/42`,
      branch: `fix/bug-${Date.now().toString(36)}`,
      summary:
        "Fixed NullPointerException caused by uninitialized variable in the authentication flow. The error occurred when processing user sessions without valid tokens.",
      filePath: "src/services/AuthService.java",
      lineNumber: 127,
      tokensUsed: 1847,
    };

    setPRData(mockResult);

    // Add to history
    const newRecord: AnalysisRecord = {
      id: Date.now().toString(),
      repo: `${formData.owner}/${formData.repo}`,
      branch: mockResult.branch,
      prUrl: mockResult.prUrl,
      status: "success",
      createdAt: new Date(),
      summary: mockResult.summary,
    };
    setHistory((prev) => [newRecord, ...prev]);

    setViewState("result");
    toast.success("Pull Request created successfully!");
  };

  const handleReset = () => {
    setViewState("form");
    setCurrentStep(0);
    setPRData(null);
    setFormData({
      owner: "",
      repo: "",
      branch: "main",
      stackTrace: "",
    });
  };

  const handleNewAnalysis = () => {
    setViewState("form");
    setCurrentStep(0);
    setPRData(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="app" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {viewState === "form" && (
              <AnalysisForm
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleSubmit}
              />
            )}

            {viewState === "loading" && (
              <LoadingSteps
                currentStep={currentStep}
                repoInfo={`${formData.owner}/${formData.repo}`}
              />
            )}

            {viewState === "result" && prData && (
              <PRResult
                data={prData}
                onNewAnalysis={handleNewAnalysis}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Sidebar - History */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <AnalysisHistory records={history} />
          </div>
        </div>
      </main>

      <Footer maxWidth="max-w-6xl" />
    </div>
  );
}
