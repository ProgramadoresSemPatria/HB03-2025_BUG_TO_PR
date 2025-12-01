import { GitHubFileContent, GitHubRepositoryDto } from '../dto/bug-to-pr-dto';

export interface IGithubService {
  getFileContent(
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    token: string,
  ): Promise<GitHubFileContent>;
  
  createBranch(
    owner: string,
    repo: string,
    baseBranch: string,
    newBranchName: string,
    token: string,
  ): Promise<void>;
  
  branchExists(
    owner: string,
    repo: string,
    branch: string,
    token: string,
  ): Promise<boolean>;
  
  updateFile(
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    content: string,
    message: string,
    sha: string,
    token: string,
  ): Promise<void>;
  
  createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string,
    token: string,
  ): Promise<string>;

  getUserRepositories(
    token: string,
    options?: {
      type?: 'all' | 'owner' | 'member';
      sort?: 'created' | 'updated' | 'pushed' | 'full_name';
      direction?: 'asc' | 'desc';
      perPage?: number;
      page?: number;
    }
  ): Promise<GitHubRepositoryDto[]>;
}

