import { IPatchService } from '../../contract/patch-contract';

export class PatchServiceMock implements IPatchService {
  private shouldValidate = true;
  private shouldThrowOnApply = false;
  private mockPatchedContent: string | null = null;

  validatePatch(patch: string): boolean {
    return this.shouldValidate;
  }

  applyPatch(content: string, patch: string): string {
    if (this.shouldThrowOnApply) {
      throw new Error('Failed to apply patch');
    }

    if (this.mockPatchedContent) {
      return this.mockPatchedContent;
    }

    return content + '\n// Patched';
  }

  setShouldValidate(value: boolean): void {
    this.shouldValidate = value;
  }

  setShouldThrowOnApply(value: boolean): void {
    this.shouldThrowOnApply = value;
  }

  setMockPatchedContent(content: string): void {
    this.mockPatchedContent = content;
  }

  clear(): void {
    this.shouldValidate = true;
    this.shouldThrowOnApply = false;
    this.mockPatchedContent = null;
  }
}

