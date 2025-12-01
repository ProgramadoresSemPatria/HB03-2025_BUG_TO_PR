export class InvalidStackTraceError extends Error {
  constructor(public statusCode: number, message?: string) {
    super(message || 'Invalid stack trace format');
    this.name = 'InvalidStackTraceError';
    this.statusCode = statusCode;
  }
  static noFileFound() {
    return new InvalidStackTraceError(
      400,
      'Could not find file path in stack trace. Please provide a complete stack trace with file references.'
    );
  }

  static unsupportedFormat() {
    return new InvalidStackTraceError(
      400,
      'Stack trace format not supported. Please provide a standard error stack trace.'
    );
  }
}

