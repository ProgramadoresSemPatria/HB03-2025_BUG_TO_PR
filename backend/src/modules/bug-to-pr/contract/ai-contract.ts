import { PatchInfo } from '../dto/bug-to-pr-dto';

export interface IAIService {
  analyzeErrorAndGeneratePatch(
    stackTrace: string,
    fileContent: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): Promise<PatchInfo>;
}

