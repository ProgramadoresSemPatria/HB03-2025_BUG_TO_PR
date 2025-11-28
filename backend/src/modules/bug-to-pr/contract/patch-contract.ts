export interface IPatchService {
  applyPatch(originalContent: string, patch: string): string;
  validatePatch(patch: string): boolean;
}

