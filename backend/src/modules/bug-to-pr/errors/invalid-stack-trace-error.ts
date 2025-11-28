export class InvalidStackTraceError extends Error {
  constructor(public statusCode: number) {
    super('Invalid stack trace format');
    this.name = 'InvalidStackTraceError';
    this.statusCode = statusCode;
  }
}

