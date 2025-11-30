export class PatchError extends Error {
  constructor(public statusCode: number, message?: string) {
    super(message || 'Patch operation failed');
    this.name = 'PatchError';
    this.statusCode = statusCode;
  }

  static invalidPatch() {
    return new PatchError(400, 'AI generated an invalid patch format');
  }

  static applyFailed() {
    return new PatchError(400, 'Failed to apply patch to file. The code may have changed.');
  }

  static aiGenerationFailed() {
    return new PatchError(500, 'AI failed to generate a fix. Please try again.');
  }
}

