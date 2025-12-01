import { IAIService } from '../contract/ai-contract';
import { IAIStrategy } from '../strategies/ai-strategy.contract';
import { PatchInfo } from '../dto/bug-to-pr-dto';

export class AIService implements IAIService {
  constructor(private readonly strategy: IAIStrategy) {}

  async analyzeErrorAndGeneratePatch(
    stackTrace: string,
    fileContent: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): Promise<PatchInfo> {
    return await this.strategy.generatePatch(
      stackTrace,
      fileContent,
      filePath,
      lineNumber,
      errorMessage,
    );
  }
}

