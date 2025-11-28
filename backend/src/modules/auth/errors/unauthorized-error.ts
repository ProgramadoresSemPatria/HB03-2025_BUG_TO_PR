export class UnauthorizedError extends Error {
  constructor(public statusCode: number) {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
    this.statusCode = statusCode;
  }
}

