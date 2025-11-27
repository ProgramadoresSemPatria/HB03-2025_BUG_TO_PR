"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bug,
  FileCode,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { LoadingSteps } from "@/components/loading-steps";
import { PRResult } from "@/components/pr-result";
import { AnalysisHistory } from "@/components/analysis-history";

// Types
interface PRData {
  prUrl: string;
  branch: string;
  summary: string;
  filePath: string;
  lineNumber: number;
  tokensUsed: number;
}

interface AnalysisRecord {
  id: string;
  repo: string;
  branch: string;
  prUrl: string;
  status: "success" | "error";
  createdAt: Date;
  summary: string;
}

type ViewState = "form" | "loading" | "result";

// Mock data for history
const mockHistory: AnalysisRecord[] = [
  {
    id: "1",
    repo: "acme/api-server",
    branch: "fix/null-pointer-123",
    prUrl: "https://github.com/acme/api-server/pull/42",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    summary: "Fixed NullPointerException in UserService.getUser()",
  },
  {
    id: "2",
    repo: "acme/web-client",
    branch: "fix/undefined-map-456",
    prUrl: "https://github.com/acme/web-client/pull/18",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    summary: "Fixed TypeError: Cannot read property 'map' of undefined",
  },
];

export default function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [prData, setPRData] = useState<PRData | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>(mockHistory);
  const [showHistory, setShowHistory] = useState(false);

  const [formData, setFormData] = useState({
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
    <div className="min-h-screen bg-background">
      <Header variant="app" />

      <main className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {viewState === "form" && (
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <Bug className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Generate Pull Request</CardTitle>
                      <CardDescription>
                        Paste your stack trace and let AI fix the bug
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Repository Info */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="owner" className="text-sm font-medium">
                          Owner
                        </Label>
                        <Input
                          id="owner"
                          placeholder="username"
                          value={formData.owner}
                          onChange={(e) =>
                            setFormData({ ...formData, owner: e.target.value })
                          }
                          required
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="repo" className="text-sm font-medium">
                          Repository
                        </Label>
                        <Input
                          id="repo"
                          placeholder="repository-name"
                          value={formData.repo}
                          onChange={(e) =>
                            setFormData({ ...formData, repo: e.target.value })
                          }
                          required
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branch" className="text-sm font-medium">
                          Branch
                        </Label>
                        <Input
                          id="branch"
                          placeholder="main"
                          value={formData.branch}
                          onChange={(e) =>
                            setFormData({ ...formData, branch: e.target.value })
                          }
                          required
                          className="h-10"
                        />
                      </div>
                    </div>

                    {/* Stack Trace */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="stackTrace"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                        Stack Trace
                      </Label>
                      <Textarea
                        id="stackTrace"
                        placeholder={`Paste your error stack trace here...

Example:
Error: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.tsx:24:18)
    at processChild (node_modules/react-dom/...)
    at ...`}
                        value={formData.stackTrace}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stackTrace: e.target.value,
                          })
                        }
                        required
                        className="min-h-[240px] code-textarea resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        The AI will analyze the error and generate a fix
                        automatically
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full h-12 text-base gap-2">
                      <Rocket className="h-5 w-5" />
                      Generate Pull Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
          <div
            className={`${
              showHistory ? "block" : "hidden lg:block"
            } lg:sticky lg:top-24 lg:self-start`}
          >
            <AnalysisHistory records={history} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto">
        <div className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-sm text-muted-foreground">
          Made for developers, by developers
        </div>
      </footer>
    </div>
  );
}
