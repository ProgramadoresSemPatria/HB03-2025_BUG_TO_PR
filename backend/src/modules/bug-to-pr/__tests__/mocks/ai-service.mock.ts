import { IAIService } from '../../contract/ai-contract';
import { PatchInfo } from '../../dto/bug-to-pr-dto';

export class AIServiceMock implements IAIService {
  private mockPatchInfo: PatchInfo | null = null;
  private shouldThrow = false;

  async analyzeErrorAndGeneratePatch(
    stackTrace: string,
    fileContent: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): Promise<PatchInfo> {
    if (this.shouldThrow) {
      throw new Error('AI service failed');
    }

    if (!this.mockPatchInfo) {
      return {
        patch: `@@ -${lineNumber},1 +${lineNumber},3 @@\n-old line\n+new line 1\n+new line 2`,
        description: `Fixed ${errorMessage}`,
        bugSummary: `Bug: ${errorMessage}`,
        aiSummary: 'AI fixed the bug',
      };
    }

    return this.mockPatchInfo;
  }

  setMockPatchInfo(patchInfo: PatchInfo): void {
    this.mockPatchInfo = patchInfo;
  }

  setShouldThrow(value: boolean): void {
    this.shouldThrow = value;
  }

  clear(): void {
    this.mockPatchInfo = null;
    this.shouldThrow = false;
  }
}

