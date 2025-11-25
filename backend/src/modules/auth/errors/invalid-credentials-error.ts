export class InvalidCredentialsError extends Error {
    constructor(public statusCode: number) {
      super('Invalid credentials');
      this.name = 'InvalidCredentialsError';
      this.statusCode = statusCode;
    }
  }