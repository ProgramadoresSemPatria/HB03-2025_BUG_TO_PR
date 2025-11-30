export class GithubError extends Error {
  constructor(public statusCode: number, message?: string) {
    super(message || 'GitHub operation failed');
    this.name = 'GithubError';
    this.statusCode = statusCode;
  }

    static unauthorized() {
    return new GithubError(401, 'Invalid or expired GitHub token');
  }

  static fileNotFound(filePath: string) {
    return new GithubError(404, `File '${filePath}' not found in repository`);
  }

  static branchNotFound(branch: string) {
    return new GithubError(404, `Branch '${branch}' not found`);
  }

  static createBranchFailed(branch: string) {
    return new GithubError(400, `Failed to create branch '${branch}'`);
  }

  static createPRFailed() {
    return new GithubError(400, 'Failed to create pull request');
  }

  static updateFileFailed(filePath: string) {
    return new GithubError(400, `Failed to update file '${filePath}'`);
  }
}

