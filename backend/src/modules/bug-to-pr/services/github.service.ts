import { Octokit } from "@octokit/rest";
import { IGithubService } from "../contract/github-contract";
import { GitHubFileContent, GitHubRepositoryDto } from "../dto/bug-to-pr-dto";

export class GithubService implements IGithubService {
  private getOctokit(token: string): Octokit {
    return new Octokit({
      auth: token,
    });
  }

  async getFileContent(
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    token: string
  ): Promise<GitHubFileContent> {
    const octokit = this.getOctokit(token);

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branch,
      });

      if (Array.isArray(response.data)) {
        throw new Error(`Path ${filePath} is a directory, not a file`);
      }

      if (response.data.type !== "file") {
        throw new Error(`Path ${filePath} is not a file`);
      }

      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );

      return {
        content,
        sha: response.data.sha,
        path: response.data.path,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error(
          `File ${filePath} not found in ${owner}/${repo} on branch ${branch}`
        );
      }
      throw new Error(`Failed to get file content: ${error.message}`);
    }
  }

  async createBranch(
    owner: string,
    repo: string,
    baseBranch: string,
    newBranchName: string,
    token: string
  ): Promise<void> {
    const octokit = this.getOctokit(token);

    try {
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${baseBranch}`,
      });

      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranchName}`,
        sha: refData.object.sha,
      });
    } catch (error: any) {
      if (error.status === 422 && error.message.includes("already exists")) {
        return;
      }
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  async branchExists(
    owner: string,
    repo: string,
    branch: string,
    token: string
  ): Promise<boolean> {
    const octokit = this.getOctokit(token);

    try {
      await octokit.repos.getBranch({
        owner,
        repo,
        branch,
      });
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }
      throw new Error(`Failed to check if branch exists: ${error.message}`);
    }
  }

  async updateFile(
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    content: string,
    message: string,
    sha: string,
    token: string
  ): Promise<void> {
    const octokit = this.getOctokit(token);

    try {
      const encodedContent = Buffer.from(content).toString("base64");

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message,
        content: encodedContent,
        sha,
        branch,
      });
    } catch (error: any) {
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string,
    token: string
  ): Promise<string> {
    const octokit = this.getOctokit(token);

    try {
      const { data } = await octokit.pulls.create({
        owner,
        repo,
        title,
        body,
        head: headBranch,
        base: baseBranch,
      });

      return data.html_url;
    } catch (error: any) {
      throw new Error(`Failed to create pull request: ${error.message}`);
    }
  }

  async getUserRepositories(
    token: string,
    options?: {
      type?: "all" | "owner" | "member";
      sort?: "created" | "updated" | "pushed" | "full_name";
      direction?: "asc" | "desc";
      perPage?: number;
      page?: number;
    }
  ): Promise<GitHubRepositoryDto[]> {

    const octokit = this.getOctokit(token);

    try {
      const { data } = await octokit.repos.listForAuthenticatedUser({
        type: options?.type || "all",
        sort: options?.sort || "updated",
        direction: options?.direction || "desc",
        per_page: options?.perPage || 100,
        page: options?.page || 1,
      });

      const mapped = data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        owner: {
          login: repo.owner.login,
        },
        private: repo.private,
        defaultBranch: repo.default_branch,
        description: repo.description,
        updatedAt: repo.updated_at || new Date().toISOString(),
      }));

      return mapped;
    } catch (error: any) {
      console.error("[GithubService] Error calling GitHub API:", {
        message: error.message,
        status: error.status,
        response: error.response?.data,
        stack: error.stack,
      });
      throw new Error(`Failed to get user repositories: ${error.message}`);
    }
  }
}
