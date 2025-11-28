/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import type { GitHubRepository } from "@/types";
import { repositoriesService } from "@/services/repositories";
import { toast } from "sonner";

interface UseRepositoriesReturn {
  repositories: GitHubRepository[];
  owners: string[];
  repositoriesByOwner: Record<string, GitHubRepository[]>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRepositories(): UseRepositoriesReturn {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await repositoriesService.getRepositories({
        type: "all",
        sort: "updated",
        direction: "desc",
        perPage: 100,
      });
      setRepositories(data);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to load repositories";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const owners = useMemo(() => {
    const uniqueOwners = new Set<string>();
    repositories.forEach((repo) => {
      uniqueOwners.add(repo.owner.login);
    });
    return Array.from(uniqueOwners).sort();
  }, [repositories]);

  const repositoriesByOwner = useMemo(() => {
    const grouped: Record<string, GitHubRepository[]> = {};
    repositories.forEach((repo) => {
      const owner = repo.owner.login;
      if (!grouped[owner]) {
        grouped[owner] = [];
      }
      grouped[owner].push(repo);
    });
    Object.keys(grouped).forEach((owner) => {
      grouped[owner].sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [repositories]);

  return {
    repositories,
    owners,
    repositoriesByOwner,
    isLoading,
    error,
    refetch: fetchRepositories,
  };
}

