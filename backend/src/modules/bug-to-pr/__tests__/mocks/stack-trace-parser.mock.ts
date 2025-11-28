import { IStackTraceParser } from '../../contract/stack-trace-parser-contract';
import { StackTraceInfo } from '../../dto/bug-to-pr-dto';

export class StackTraceParserMock implements IStackTraceParser {
  private mockResult: StackTraceInfo | null = null;

  parse(stackTrace: string): StackTraceInfo | null {
    return this.mockResult;
  }

  setMockResult(result: StackTraceInfo | null): void {
    this.mockResult = result;
  }

  clear(): void {
    this.mockResult = null;
  }
}

