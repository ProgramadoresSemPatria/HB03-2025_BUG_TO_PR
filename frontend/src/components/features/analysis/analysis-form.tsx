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
import { Bug, FileCode, Rocket, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { generatePRSchema } from "@/validators/analysis.validator";
import { useRepositories } from "@/hooks/use-repositories";
import type { AnalysisFormData } from "@/types";

interface AnalysisFormProps {
  formData: AnalysisFormData;
  onFormDataChange: (data: AnalysisFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

interface FieldErrors {
  owner?: string;
  repo?: string;
  branch?: string;
  stackTrace?: string;
}

export function AnalysisForm({
  formData,
  onFormDataChange,
  onSubmit,
  isSubmitting = false,
}: AnalysisFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { owners, repositoriesByOwner, isLoading: isLoadingRepos } = useRepositories();

  const validateField = (field: keyof AnalysisFormData, value: string | undefined) => {
    const result = generatePRSchema.safeParse({
      ...formData,
      [field]: value,
    });

    if (!result.success) {
      const fieldError = result.error.issues.find((e) => e.path.includes(field));
      return fieldError?.message;
    }
    return undefined;
  };

  const handleBlur = (field: keyof AnalysisFormData) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: keyof AnalysisFormData, value: string | undefined) => {
    onFormDataChange({ ...formData, [field]: value });
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleInputChange = (field: keyof AnalysisFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(field, e.target.value);
  };

  const handleTextareaChange = (field: keyof AnalysisFormData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(field, e.target.value);
  };

  const handleOwnerChange = (owner: string) => {
    const newFormData = { ...formData, owner, repo: "", branch: "main" };
    onFormDataChange(newFormData);
    
    if (touched.owner) {
      const error = validateField("owner", owner);
      setErrors({ ...errors, owner: error, repo: undefined });
    }
  };

  const handleRepoChange = (repoName: string) => {
    const selectedRepo = repositoriesByOwner[formData.owner]?.find(
      (r) => r.name === repoName
    );
    
    const newFormData = {
      ...formData,
      repo: repoName,
      branch: selectedRepo?.defaultBranch || "main",
    };
    onFormDataChange(newFormData);
    
    if (touched.repo) {
      const error = validateField("repo", repoName);
      setErrors({ ...errors, repo: error });
    }
  };

  const availableRepos = formData.owner
    ? repositoriesByOwner[formData.owner] || []
    : [];

  return (
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
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner" className="text-sm font-medium">
                Owner
              </Label>
              {isLoadingRepos ? (
                <div className="h-10 flex items-center justify-center border border-input rounded-md bg-muted/30">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <select
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => handleOwnerChange(e.target.value)}
                  onBlur={() => handleBlur("owner")}
                  required
                  className={`h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 ${
                    errors.owner ? "border-destructive" : ""
                  }`}
                  disabled={isSubmitting || isLoadingRepos}
                  aria-invalid={!!errors.owner}
                >
                  <option value="" className="bg-background text-foreground">
                    Select Owner
                  </option>
                  {owners.map((owner) => (
                    <option key={owner} value={owner} className="bg-background text-foreground">
                      {owner}
                    </option>
                  ))}
                </select>
              )}
              {errors.owner && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.owner}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo" className="text-sm font-medium">
                Repository
              </Label>
              {isLoadingRepos ? (
                <div className="h-10 flex items-center justify-center border border-input rounded-md bg-muted/30">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <select
                  id="repo"
                  value={formData.repo}
                  onChange={(e) => handleRepoChange(e.target.value)}
                  onBlur={() => handleBlur("repo")}
                  required
                  disabled={!formData.owner || isSubmitting || isLoadingRepos}
                  className={`h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 ${
                    errors.repo ? "border-destructive" : ""
                  }`}
                  aria-invalid={!!errors.repo}
                >
                  <option value="" className="bg-background text-foreground">
                    {formData.owner ? "Select Repository" : "Select Owner first"}
                  </option>
                  {availableRepos.map((repo) => (
                    <option
                      key={repo.id}
                      value={repo.name}
                      className="bg-background text-foreground"
                    >
                      {repo.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.repo && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.repo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-sm font-medium">
                Branch
              </Label>
              <Input
                id="branch"
                placeholder="main"
                value={formData.branch}
                onChange={handleInputChange("branch")}
                onBlur={() => handleBlur("branch")}
                required
                className={`h-10 ${errors.branch ? "border-destructive" : ""}`}
                disabled={isSubmitting}
                aria-invalid={!!errors.branch}
              />
              {errors.branch && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.branch}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="aiProvider"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              LLM Provider
            </Label>
            <select
              id="aiProvider"
              value={formData.aiProvider || ''}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  aiProvider: e.target.value ? (e.target.value as 'gemini' | 'openai') : undefined,
                })
              }
              className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              disabled={isSubmitting}
            >
              <option value="" className="bg-background text-foreground">Select LLM Provider (Optional)</option>
              <option value="gemini" className="bg-background text-foreground">Gemini</option>
              <option value="openai" className="bg-background text-foreground">OpenAI</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Choose the AI provider to analyze the stack trace. Leave empty for default.
            </p>
          </div>

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
              onChange={handleTextareaChange("stackTrace")}
              onBlur={() => handleBlur("stackTrace")}
              required
              className={`min-h-[240px] code-textarea resize-none ${errors.stackTrace ? "border-destructive" : ""}`}
              disabled={isSubmitting}
              aria-invalid={!!errors.stackTrace}
            />
            {errors.stackTrace ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.stackTrace}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                The AI will analyze the error and generate a fix automatically
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base gap-2"
            disabled={isSubmitting}
          >
            <Rocket className="h-5 w-5" />
            Generate Pull Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

