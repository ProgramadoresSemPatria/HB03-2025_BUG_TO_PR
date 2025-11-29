/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header, Footer } from "@/components/shared";
import { AuthGuard } from "@/components/shared/auth-guard";
import { HistoryList } from "@/components/features/analysis";
import { analysisService } from "@/services/analysis";
import type { AnalysisRecord, GetHistoryParams } from "@/types";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [filters, setFilters] = useState<GetHistoryParams>(() => {
    const status = searchParams.get("status") as GetHistoryParams["status"] | null;
    const owner = searchParams.get("owner") || undefined;
    const repo = searchParams.get("repo") || undefined;
    return {
      ...(status && { status }),
      ...(owner && { owner }),
      ...(repo && { repo }),
    };
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  });
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const limit = searchParams.get("limit");
    return limit ? parseInt(limit, 10) : 10;
  });
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.status) params.set("status", filters.status);
    if (filters.owner) params.set("owner", filters.owner);
    if (filters.repo) params.set("repo", filters.repo);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (itemsPerPage !== 10) params.set("limit", itemsPerPage.toString());
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    router.replace(newUrl, { scroll: false });
  }, [filters, currentPage, itemsPerPage, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.status, filters.owner, filters.repo]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const offset = (currentPage - 1) * itemsPerPage;
        const history = await analysisService.getHistory({
          ...filters,
          limit: itemsPerPage,
          offset,
        });
        setRecords(history);
        if (history.length < itemsPerPage) {
          setTotalRecords((currentPage - 1) * itemsPerPage + history.length);
        } else {
          setTotalRecords(currentPage * itemsPerPage + (currentPage === 1 ? itemsPerPage : 1));
        }
      } catch (error: any) {
        const errorMessage = error?.message || "Failed to load history";
        toast.error(errorMessage);
        setRecords([]);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [filters, currentPage, itemsPerPage, refreshKey]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)",
            }}
          />
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              background: "radial-gradient(ellipse 80% 80% at 100% 100%, rgba(34, 211, 238, 0.03) 0%, transparent 50%)",
            }}
          />
        </div>

        <Header variant="app" />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 relative z-10">
          <HistoryList 
            records={records} 
            isLoading={isLoading}
            filters={filters}
            onFiltersChange={setFilters}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            onRefresh={() => {
              setRefreshKey(prev => prev + 1);
            }}
            allRecords={records}
          />
        </main>

        <Footer maxWidth="max-w-6xl" variant="slate" />
      </div>
    </AuthGuard>
  );
}

