"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  ExternalLink,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { HistorySkeleton, StatsSkeleton } from "./history-skeleton";
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
  onRefresh?: () => void;
  allRecords?: AnalysisRecord[];
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
  onRefresh,
  allRecords = [],
}: HistoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [localFilters, setLocalFilters] = useState<GetHistoryParams>({
    status: filters.status,
    owner: filters.owner,
    repo: filters.repo,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const stats = {
    total: allRecords.length,
    success: allRecords.filter(r => r.status === "success").length,
    pending: allRecords.filter(r => r.status === "pending").length,
    failed: allRecords.filter(r => r.status === "failed").length,
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const filteredRecords = records
    .filter((record) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        record.repo.toLowerCase().includes(query) ||
        record.branch.toLowerCase().includes(query) ||
        record.summary.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || filteredRecords.length === 0) return;

    let ctx: { revert: () => void } | null = null;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      
      ctx = gsap.context(() => {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 10,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: index * 0.03,
              ease: "power2.out",
            }
          );
        });
      }, containerRef);
    };

    loadGSAP();

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [filteredRecords.length]);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Statistics Cards */}
      {isLoading ? (
        <StatsSkeleton labels={["Total", "Success", "Pending", "Failed"]} />
      ) : stats.total > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded border border-slate-900/80 bg-[#0a0a0a]/50 backdrop-blur-sm" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)' }}>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              Total
            </div>
            <div className="text-lg text-white font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              {stats.total}
            </div>
          </div>
          <div className="p-4 rounded border border-slate-900/80 bg-[#0a0a0a]/50 backdrop-blur-sm" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)' }}>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              Success
            </div>
            <div className="text-lg text-cyan-400 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              {stats.success}
            </div>
          </div>
          <div className="p-4 rounded border border-slate-900/80 bg-[#0a0a0a]/50 backdrop-blur-sm" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)' }}>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              Pending
            </div>
            <div className="text-lg text-yellow-400 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              {stats.pending}
            </div>
          </div>
          <div className="p-4 rounded border border-slate-900/80 bg-[#0a0a0a]/50 backdrop-blur-sm" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)' }}>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              Failed
            </div>
            <div className="text-lg text-red-400 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
              {stats.failed}
            </div>
          </div>
        </div>
      ) : null}

      <Card className="border-slate-900/80 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden" style={{ 
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.5)',
      }}>
        <CardHeader className="pb-6 border-b border-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-normal tracking-tight text-white mb-1.5" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', fontWeight: 400, letterSpacing: '-0.01em' }}>
                History
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs bg-slate-900/50 border-slate-800/70 text-slate-400" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                {totalRecords > 0 ? `${startRecord}-${endRecord}/${totalRecords}` : "0"}
              </Badge>
              {onRefresh && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 bg-[#0a0a0a] border-slate-800/70 text-slate-400 hover:bg-slate-900/50 hover:text-white disabled:opacity-30"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-20 h-9 bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 font-mono text-sm"
                style={{
                  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                }}
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-800/70 bg-slate-900/50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 h-9 bg-[#0a0a0a] border-slate-800/70 text-slate-300 hover:bg-slate-900/50 hover:text-white font-mono text-xs"
                style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-cyan-500/20 border-cyan-500/30 text-cyan-400">
                    {Object.values(localFilters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="gap-2 h-9 bg-[#0a0a0a] border-slate-800/70 text-slate-300 hover:bg-slate-900/50 hover:text-white font-mono text-xs"
                style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortOrder === "newest" ? "Newest" : "Oldest"}
              </Button>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 h-9 text-slate-500 hover:text-slate-300 font-mono text-xs"
                  style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid sm:grid-cols-3 gap-4 p-4 border border-slate-900/50 rounded bg-[#0a0a0a]/50">
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                    Status
                  </label>
                  <Select
                    value={localFilters.status || ""}
                    onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                    className="w-full"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                    Owner
                  </label>
                  <Input
                    type="text"
                    placeholder="username"
                    value={localFilters.owner || ""}
                    onChange={(e) => handleFilterChange("owner", e.target.value || undefined)}
                    className="h-9 bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 font-mono text-sm"
                    style={{
                      fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                      boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                    Repository
                  </label>
                  <Input
                    type="text"
                    placeholder="repo-name"
                    value={localFilters.repo || ""}
                    onChange={(e) => handleFilterChange("repo", e.target.value || undefined)}
                    className="h-9 bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 font-mono text-sm"
                    style={{
                      fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                      boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <HistorySkeleton count={itemsPerPage} />
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-slate-400 font-mono mb-1" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                {searchQuery ? "No results" : "Empty"}
              </p>
              <p className="text-xs text-slate-600 font-mono mb-4" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                {searchQuery ? "Try different query" : "No records yet"}
              </p>
              {!searchQuery && !hasActiveFilters && (
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded hover:bg-cyan-500/10 transition-colors"
                  style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
                >
                  Create first analysis
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecords.map((record, index) => {
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
                    ref={(el: HTMLDivElement | HTMLAnchorElement | null) => { cardRefs.current[index] = el as HTMLDivElement | null; }}
                    {...cardProps}
                    className={`block p-4 rounded border border-slate-900/80 bg-[#0a0a0a]/50 transition-all group ${
                      record.prUrl
                        ? "hover:bg-slate-900/50 hover:border-slate-800/70 cursor-pointer"
                        : "cursor-default"
                    }`}
                    style={{
                      boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
                    }}
                  >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {record.status === "success" ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                      ) : record.status === "pending" ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0 animate-pulse" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                      <span className="text-sm font-normal text-white truncate font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                        {record.repo || "Repository"}
                      </span>
                      {record.status === "pending" && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-yellow-500/20 border-yellow-500/30 text-yellow-400 font-mono">
                          Pending
                        </Badge>
                      )}
                      {record.status === "failed" && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0 bg-red-500/20 border-red-500/30 text-red-400 font-mono">
                          Failed
                        </Badge>
                      )}
                    </div>
                    {record.prUrl && (
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 font-mono leading-relaxed" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                    {record.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <code className="text-xs px-2 py-0.5 bg-slate-900/50 border border-slate-800/70 text-slate-400 rounded font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                      {record.branch.split("/").pop()}
                    </code>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
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
            <div className="mt-6 pt-6 border-t border-slate-900/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                    Per page:
                  </label>
                  <Select
                    value={itemsPerPage.toString()}
                    onChange={(e) => {
                      onItemsPerPageChange?.(Number(e.target.value));
                      onPageChange?.(1);
                    }}
                    className="w-20"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-2 h-9 bg-[#0a0a0a] border-slate-800/70 text-slate-300 hover:bg-slate-900/50 hover:text-white font-mono text-xs disabled:opacity-30"
                    style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
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
                          className={`min-w-9 h-9 font-mono text-xs ${
                            currentPage === pageNum 
                              ? "bg-white text-black hover:bg-white/90" 
                              : "bg-[#0a0a0a] border-slate-800/70 text-slate-300 hover:bg-slate-900/50 hover:text-white"
                          }`}
                          style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
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
                    className="gap-2 h-9 bg-[#0a0a0a] border-slate-800/70 text-slate-300 hover:bg-slate-900/50 hover:text-white font-mono text-xs disabled:opacity-30"
                    style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
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

