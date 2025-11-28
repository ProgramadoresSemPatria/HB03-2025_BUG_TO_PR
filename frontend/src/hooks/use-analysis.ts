"use client";

import { useState, useCallback } from "react";
import type { PRData, AnalysisRecord, AnalysisFormData, ViewState } from "@/types";
import { analysisService } from "@/services/analysis";

interface UseAnalysisReturn {
  viewState: ViewState;
  currentStep: number;
  prData: PRData | null;
  history: AnalysisRecord[];
  isSubmitting: boolean;
  submitAnalysis: (formData: AnalysisFormData) => Promise<void>;
  reset: () => void;
  newAnalysis: () => void;
}

export function useAnalysis(initialHistory: AnalysisRecord[] = []): UseAnalysisReturn {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [prData, setPRData] = useState<PRData | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>(initialHistory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAnalysis = useCallback(async (formData: AnalysisFormData) => {
    setIsSubmitting(true);
    setViewState("loading");
    setCurrentStep(0);

    try {
      const result = await analysisService.analyze(formData, (step) => {
        setCurrentStep(step);
      });

      setPRData(result);

      const newRecord: AnalysisRecord = {
        id: Date.now().toString(),
        repo: `${formData.owner}/${formData.repo}`,
        branch: result.branch,
        prUrl: result.prUrl,
        status: "success",
        createdAt: new Date(),
        summary: result.summary,
      };
      setHistory((prev) => [newRecord, ...prev]);

      setViewState("result");
    } catch (error) {
      console.error("Analysis failed:", error);
      setViewState("form");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setViewState("form");
    setCurrentStep(0);
    setPRData(null);
  }, []);

  const newAnalysis = useCallback(() => {
    setViewState("form");
    setCurrentStep(0);
    setPRData(null);
  }, []);

  return {
    viewState,
    currentStep,
    prData,
    history,
    isSubmitting,
    submitAnalysis,
    reset,
    newAnalysis,
  };
}

