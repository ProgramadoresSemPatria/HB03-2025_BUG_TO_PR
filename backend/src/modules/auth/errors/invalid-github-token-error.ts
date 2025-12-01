export class InvalidGithubTokenError extends Error {
  constructor(public statusCode: number) {
    super('Invalid GitHub personal access token');
    this.name = 'InvalidGithubTokenError';
    this.statusCode = statusCode;
  }
}
