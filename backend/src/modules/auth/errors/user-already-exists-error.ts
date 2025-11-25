export class UserAlreadyExistsError extends Error {
    constructor(public statusCode: number) {
      super('User already exists');
      this.name = 'UserAlreadyExistsError';
      this.statusCode = statusCode;
    }
  }