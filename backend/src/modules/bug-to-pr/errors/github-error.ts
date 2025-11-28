export class GithubError extends Error {
  constructor(public statusCode: number) {
    super('GitHub operation failed');
    this.name = 'GithubError';
    this.statusCode = statusCode;
  }
}

