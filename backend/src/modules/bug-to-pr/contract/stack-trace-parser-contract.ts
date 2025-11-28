import { StackTraceInfo } from '../dto/bug-to-pr-dto';

export interface IStackTraceParser {
  parse(stackTrace: string): StackTraceInfo | null;
}

