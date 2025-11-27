"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  History,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
} from "lucide-react";

interface AnalysisRecord {
  id: string;
  repo: string;
  branch: string;
  prUrl: string;
  status: "success" | "error";
  createdAt: Date;
  summary: string;
}

interface AnalysisHistoryProps {
  records: AnalysisRecord[];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function AnalysisHistory({ records }: AnalysisHistoryProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Recent Analysis</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Your last {records.length} bug fixes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {records.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No analysis yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your bug fixes will appear here
            </p>
          </div>
        ) : (
          records.map((record) => (
            <a
              key={record.id}
              href={record.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {record.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive shrink-0" />
                  )}
                  <span className="text-xs font-medium truncate">
                    {record.repo}
                  </span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {record.summary}
              </p>

              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-mono"
                >
                  {record.branch.split("/").pop()}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(record.createdAt)}
                </div>
              </div>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  );
}

