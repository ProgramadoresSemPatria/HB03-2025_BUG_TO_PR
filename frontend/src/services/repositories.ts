import { GetRepositoriesParams, GitHubRepository } from "@/types";

import { api } from "./api";

class RepositoriesService {
  async getRepositories(
    params?: GetRepositoriesParams
  ): Promise<GitHubRepository[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append("type", params.type);
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.direction) queryParams.append("direction", params.direction);
    if (params?.perPage) queryParams.append("perPage", params.perPage.toString());
    if (params?.page) queryParams.append("page", params.page.toString());

    const queryString = queryParams.toString();
    const endpoint = `/bug-to-pr/repositories${queryString ? `?${queryString}` : ""}`;

    const response = await api.get<{ repositories: GitHubRepository[] }>(endpoint);
    return response.data.repositories;
  }
}

export const repositoriesService = new RepositoriesService();

