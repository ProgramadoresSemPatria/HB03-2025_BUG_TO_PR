"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Download,
  Brain,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  Loader2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStepsProps {
  currentStep: number;
  repoInfo: string;
}

const steps = [
  {
    id: 1,
    title: "Analyzing stack trace",
    description: "Extracting file paths and line numbers...",
    icon: Search,
  },
  {
    id: 2,
    title: "Fetching repository",
    description: "Downloading source code from GitHub...",
    icon: Download,
  },
  {
    id: 3,
    title: "AI Analysis",
    description: "Generating patch with unified diff...",
    icon: Brain,
  },
  {
    id: 4,
    title: "Creating branch",
    description: "Applying fix and committing changes...",
    icon: GitBranch,
  },
  {
    id: 5,
    title: "Opening Pull Request",
    description: "Creating PR with technical description...",
    icon: GitPullRequest,
  },
];

export function LoadingSteps({ currentStep, repoInfo }: LoadingStepsProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-border/50">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {currentStep}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl">Processing{dots}</CardTitle>
        <CardDescription>
          Analyzing <span className="text-foreground font-medium">{repoInfo}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-1">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id}>
                <div
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-primary/10 border border-primary/20"
                      : isCompleted
                      ? "bg-success/5"
                      : "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                      isCompleted
                        ? "bg-success/20 text-success"
                        : isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isActive ? (
                      <StepIcon className="h-5 w-5 animate-pulse" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCompleted
                          ? "text-success"
                          : isActive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {isActive ? step.description : isCompleted ? "Completed" : "Pending"}
                    </p>
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-100" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-200" />
                    </div>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div className="ml-8 h-2 flex items-center">
                    <div
                      className={cn(
                        "w-0.5 h-full transition-colors",
                        currentStep > step.id ? "bg-success/40" : "bg-border"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

