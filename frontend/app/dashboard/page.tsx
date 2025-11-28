/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Header, Footer } from "@/components/shared";
import { AuthGuard } from "@/components/shared/auth-guard";
import {
  AnalysisForm,
  LoadingSteps,
  PRResult,
} from "@/components/features/analysis";
import { analysisService } from "@/services/analysis";
import { generatePRSchema } from "@/validators/analysis.validator";
import type { PRData, AnalysisFormData, ViewState } from "@/types";

export default function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [prData, setPRData] = useState<PRData | null>(null);

  const [formData, setFormData] = useState<AnalysisFormData>({
    owner: "",
    repo: "",
    branch: "main",
    stackTrace: "",
    aiProvider: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = generatePRSchema.safeParse(formData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      toast.error(firstError.message);
      return;
    }


    setViewState("loading");
    setCurrentStep(0);

    try {
      const result = await analysisService.analyze(formData, (step) => {
        setCurrentStep(step);
      });

      setPRData(result);
      setViewState("result");
      toast.success("Pull Request created successfully!");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to generate PR. Please try again.";
      toast.error(errorMessage);
      setViewState("form");
      setCurrentStep(0);
    }
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
      aiProvider: undefined,
    });
  };

  const handleNewAnalysis = () => {
    setViewState("form");
    setCurrentStep(0);
    setPRData(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <Header variant="app" />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
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
        </main>

        <Footer maxWidth="max-w-6xl" />
      </div>
    </AuthGuard>
  );
}
