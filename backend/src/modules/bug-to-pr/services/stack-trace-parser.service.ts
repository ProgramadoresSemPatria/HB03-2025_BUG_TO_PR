import { IStackTraceParser } from '../contract/stack-trace-parser-contract';
import { StackTraceInfo } from '../dto/bug-to-pr-dto';
import { normalizePath } from '../utils/normalize-path';

export class StackTraceParserService implements IStackTraceParser {
  parse(stackTrace: string): StackTraceInfo | null {
    if (!stackTrace || stackTrace.trim().length === 0) {
      return null;
    }

    const patterns = [
      /at\s+(?:\w+\.)*\w+\s+\(([^:]+):(\d+):(\d+)\)/, //Node.js
      /at\s+([^:]+):(\d+):(\d+)/, //Node.js
      /File\s+"([^"]+)",\s+line\s+(\d+)/, //Python
      /at\s+[\w.$]+\s+\(([^:]+):(\d+)\)/, //Java 
      /([^:\s]+):(\d+):(\d+)/, //Generic
      /([^:\s]+):(\d+)/, //Generic
    ];

    const lines = stackTrace.split('\n');
    
    for (const line of lines) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const filePath = match[1];
          const lineNumber = parseInt(match[2], 10);
          const columnNumber = match[3] ? parseInt(match[3], 10) : undefined;
          
          const errorLine = lines.find(l => 
            l.includes('Error:') || 
            l.includes('TypeError:') || 
            l.includes('ReferenceError:') ||
            l.includes('SyntaxError:') ||
            l.includes('Exception:')
          ) || lines[0];

          const errorMatch = errorLine.match(/(\w+Error|Exception)[:\s]*(.+)/);
          const errorType = errorMatch ? errorMatch[1] : 'Error';
          const errorMessage = errorMatch ? errorMatch[2].trim() : errorLine.trim();

          return {
            filePath: normalizePath(filePath),
            lineNumber,
            columnNumber,
            errorMessage,
            errorType,
          };
        }
      }
    }

    return null;
  }

  
}

