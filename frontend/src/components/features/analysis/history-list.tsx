"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  History,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { AnalysisRecord, GetHistoryParams } from "@/types";

interface HistoryListProps {
  records: AnalysisRecord[];
  isLoading?: boolean;
  filters?: GetHistoryParams;
  onFiltersChange?: (filters: GetHistoryParams) => void;
  currentPage?: number;
  itemsPerPage?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export function HistoryList({ 
  records, 
  isLoading = false,
  filters = {},
  onFiltersChange,
  currentPage = 1,
  itemsPerPage = 10,
  totalRecords = 0,
  onPageChange,
  onItemsPerPageChange,
}: HistoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<GetHistoryParams>({
    status: filters.status,
    owner: filters.owner,
    repo: filters.repo,
  });

  const handleFilterChange = (key: keyof GetHistoryParams, value: string | number | undefined) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: GetHistoryParams = {};
    setLocalFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Boolean(
    localFilters.status || localFilters.owner || localFilters.repo
  );

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startRecord = totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      record.repo.toLowerCase().includes(query) ||
      record.branch.toLowerCase().includes(query) ||
      record.summary.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="h-5 w-5 text-primary" />
                <CardTitle>Analysis History</CardTitle>
              </div>
              <CardDescription>
                View all your bug fixes and pull requests
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              {totalRecords > 0 ? `${startRecord}-${endRecord} of ${totalRecords}` : "0"} records
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by repository, branch, or summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {Object.values(localFilters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-border/30 rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={localFilters.status || ""}
                    onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Owner
                  </label>
                  <Input
                    type="text"
                    placeholder="username"
                    value={localFilters.owner || ""}
                    onChange={(e) => handleFilterChange("owner", e.target.value || undefined)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Repository
                  </label>
                  <Input
                    type="text"
                    placeholder="repository-name"
                    value={localFilters.repo || ""}
                    onChange={(e) => handleFilterChange("repo", e.target.value || undefined)}
                    className="h-9"
                  />
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center animate-pulse">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Loading history...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">
                {searchQuery ? "No results found" : "No analysis yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Your bug fixes will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const CardWrapper = record.prUrl ? "a" : "div";
                const cardProps = record.prUrl
                  ? {
                      href: record.prUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {};

                return (
                  <CardWrapper
                    key={record.id}
                    {...cardProps}
                    className={`block p-4 rounded-lg border border-border/30 bg-card/50 transition-all group ${
                      record.prUrl
                        ? "hover:bg-accent/50 hover:border-border cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {record.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      ) : record.status === "pending" ? (
                        <Clock className="h-5 w-5 text-yellow-500 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive shrink-0" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {record.repo || "Repository"}
                      </span>
                      {record.status === "pending" && (
                        <Badge variant="secondary" className="text-xs">
                          Pending
                        </Badge>
                      )}
                      {record.status === "failed" && (
                        <Badge variant="destructive" className="text-xs">
                          Failed
                        </Badge>
                      )}
                    </div>
                    {record.prUrl && (
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {record.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 font-mono"
                    >
                      {record.branch.split("/").pop()}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimeAgo(record.createdAt)}
                    </div>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && filteredRecords.length > 0 && totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-border/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      onItemsPerPageChange?.(Number(e.target.value));
                      onPageChange?.(1);
                    }}
                    className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange?.(pageNum)}
                          className="min-w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

