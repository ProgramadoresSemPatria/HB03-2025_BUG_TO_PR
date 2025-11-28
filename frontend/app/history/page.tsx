/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Header, Footer } from "@/components/shared";
import { AuthGuard } from "@/components/shared/auth-guard";
import { HistoryList } from "@/components/features/analysis";
import { analysisService } from "@/services/analysis";
import type { AnalysisRecord, GetHistoryParams } from "@/types";

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<GetHistoryParams>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

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
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.status, filters.owner, filters.repo]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <Header variant="app" />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
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
          />
        </main>

        <Footer maxWidth="max-w-6xl" />
      </div>
    </AuthGuard>
  );
}

