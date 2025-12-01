"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ExternalLink,
  GitBranch,
  FileCode,
  Hash,
  Sparkles,
  RotateCcw,
  Plus,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type { PRData } from "@/types";

interface PRResultProps {
  data: PRData;
  onNewAnalysis: () => void;
  onReset: () => void;
}

export function PRResult({ data, onNewAnalysis, onReset }: PRResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.prUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Card className="border-success/30 bg-success/5">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 border border-success/30">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-success">
                Pull Request Created!
              </CardTitle>
              <CardDescription className="text-success/80 mt-1">
                Your bug fix has been automatically submitted
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={data.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full h-12 gap-2 text-base" size="lg">
                <ExternalLink className="h-5 w-5" />
                View Pull Request
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              className="h-12 gap-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <GitBranch className="h-4 w-4" />
              New Branch
            </div>
            <code className="text-sm font-mono text-foreground bg-muted/50 px-2 py-1 rounded">
              {data.branch}
            </code>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Analysis Summary</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.summary}
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <FileCode className="h-3.5 w-3.5" />
                File Path
              </div>
              <code className="text-xs font-mono text-foreground break-all">
                {data.filePath}
              </code>
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Hash className="h-3.5 w-3.5" />
                Line Number
              </div>
              <span className="text-sm font-medium text-foreground">
                Line {data.lineNumber}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={onNewAnalysis}
        >
          <Plus className="h-4 w-4" />
          New Analysis
        </Button>
        <Button variant="ghost" className="gap-2" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Reset Form
        </Button>
      </div>
    </div>
  );
}

