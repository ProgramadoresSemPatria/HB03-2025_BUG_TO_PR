export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: {
    login: string;
  };
  private: boolean;
  defaultBranch: string;
  description: string | null;
  updatedAt: string;
}

export interface GetRepositoriesParams {
  type?: "all" | "owner" | "member";
  sort?: "created" | "updated" | "pushed" | "full_name";
  direction?: "asc" | "desc";
  perPage?: number;
  page?: number;
}

