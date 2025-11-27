"use client";

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
import { Bug, FileCode, Rocket } from "lucide-react";
import type { AnalysisFormData } from "@/types";

interface AnalysisFormProps {
  formData: AnalysisFormData;
  onFormDataChange: (data: AnalysisFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export function AnalysisForm({
  formData,
  onFormDataChange,
  onSubmit,
  isSubmitting = false,
}: AnalysisFormProps) {
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
                  onFormDataChange({ ...formData, owner: e.target.value })
                }
                required
                className="h-10"
                disabled={isSubmitting}
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
                  onFormDataChange({ ...formData, repo: e.target.value })
                }
                required
                className="h-10"
                disabled={isSubmitting}
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
                  onFormDataChange({ ...formData, branch: e.target.value })
                }
                required
                className="h-10"
                disabled={isSubmitting}
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
                onFormDataChange({
                  ...formData,
                  stackTrace: e.target.value,
                })
              }
              required
              className="min-h-[240px] code-textarea resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              The AI will analyze the error and generate a fix automatically
            </p>
          </div>

          {/* Submit Button */}
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

