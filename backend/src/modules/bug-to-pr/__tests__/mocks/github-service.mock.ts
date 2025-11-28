import { IGithubService } from '../../contract/github-contract';
import { GitHubFileContent, GitHubRepositoryDto } from '../../dto/bug-to-pr-dto';

export class GithubServiceMock implements IGithubService {
  private fileContents: Map<string, GitHubFileContent> = new Map();
  private existingBranches: Set<string> = new Set();
  private shouldThrowOnGetFile = false;
  private shouldThrowOnCreateBranch = false;
  private shouldThrowOnUpdateFile = false;
  private shouldThrowOnCreatePR = false;
  private shouldThrowOnBranchExists = false;

  async getFileContent(
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    token: string,
  ): Promise<GitHubFileContent> {
    if (this.shouldThrowOnGetFile) {
      throw new Error('Failed to get file content');
    }

    const key = `${owner}/${repo}/${branch}/${filePath}`;
    const content = this.fileContents.get(key);

    if (!content) {
      throw new Error(`File ${filePath} not found`);
    }

    return content;
  }

  async createBranch(
    owner: string,
    repo: string,
    baseBranch: string,
    newBranchName: string,
    token: string,
  ): Promise<void> {
    if (this.shouldThrowOnCreateBranch) {
      throw new Error('Failed to create branch');
    }

    this.existingBranches.add(newBranchName);
  }

  async branchExists(
    owner: string,
    repo: string,
    branch: string,
    token: string,
  ): Promise<boolean> {
    if (this.shouldThrowOnBranchExists) {
      throw new Error('Failed to check if branch exists');
    }

    return this.existingBranches.has(branch);
  }

  async updateFile(
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    content: string,
    message: string,
    sha: string,
    token: string,
  ): Promise<void> {
    if (this.shouldThrowOnUpdateFile) {
      throw new Error('Failed to update file');
    }
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string,
    token: string,
  ): Promise<string> {
    if (this.shouldThrowOnCreatePR) {
      throw new Error('Failed to create pull request');
    }

    return `https://github.com/${owner}/${repo}/pull/1`;
  }

  async getUserRepositories(
    token: string,
    options?: {
      type?: 'all' | 'owner' | 'member';
      sort?: 'created' | 'updated' | 'pushed' | 'full_name';
      direction?: 'asc' | 'desc';
      perPage?: number;
      page?: number;
    }
  ): Promise<GitHubRepositoryDto[]> {
    return [];
  }

  setFileContent(owner: string, repo: string, branch: string, filePath: string, content: GitHubFileContent): void {
    const key = `${owner}/${repo}/${branch}/${filePath}`;
    this.fileContents.set(key, content);
  }

  addExistingBranch(branch: string): void {
    this.existingBranches.add(branch);
  }

  setShouldThrowOnGetFile(value: boolean): void {
    this.shouldThrowOnGetFile = value;
  }

  setShouldThrowOnCreateBranch(value: boolean): void {
    this.shouldThrowOnCreateBranch = value;
  }

  setShouldThrowOnUpdateFile(value: boolean): void {
    this.shouldThrowOnUpdateFile = value;
  }

  setShouldThrowOnCreatePR(value: boolean): void {
    this.shouldThrowOnCreatePR = value;
  }

  setShouldThrowOnBranchExists(value: boolean): void {
    this.shouldThrowOnBranchExists = value;
  }

  clear(): void {
    this.fileContents.clear();
    this.existingBranches.clear();
    this.shouldThrowOnGetFile = false;
    this.shouldThrowOnCreateBranch = false;
    this.shouldThrowOnUpdateFile = false;
    this.shouldThrowOnCreatePR = false;
    this.shouldThrowOnBranchExists = false;
  }
}

