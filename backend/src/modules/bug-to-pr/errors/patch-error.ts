export class PatchError extends Error {
  constructor(public statusCode: number) {
    super('Patch operation failed');
    this.name = 'PatchError';
    this.statusCode = statusCode;
  }
}

