import { IAIStrategy } from './ai-strategy.contract';
import { PatchInfo } from '../dto/bug-to-pr-dto';

export class MockStrategy implements IAIStrategy {
  async generatePatch(
    stackTrace: string,
    fileContent: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): Promise<PatchInfo> {
    const lines = fileContent.split('\n');
    const targetLineIndex = lineNumber - 1;
    
    if (targetLineIndex < 0 || targetLineIndex >= lines.length) {
      throw new Error(`Line ${lineNumber} is out of bounds`);
    }

    const targetLine = lines[targetLineIndex];
    
    let patch: string;
    let fixDescription: string;
    
    if (errorMessage.includes('Cannot read property') || errorMessage.includes('of undefined') || errorMessage.includes('of null')) {
      const propertyMatch = errorMessage.match(/property '(\w+)'/);
      const property = propertyMatch ? propertyMatch[1] : 'value';
      const variableMatch = targetLine.match(/(\w+)\./);
      const variable = variableMatch ? variableMatch[1] : 'data';
      
      patch = this.generateNullCheckPatch(lines, targetLineIndex, variable, property);
      fixDescription = `Added null/undefined check for ${variable} before accessing ${property} property`;
    } else {
      patch = this.generateGenericPatch(lines, targetLineIndex, targetLine);
      fixDescription = `Added error handling for ${errorMessage}`;
    }

    return {
      patch,
      description: `${fixDescription}. The error occurs at line ${lineNumber} in ${filePath}.`,
      bugSummary: `Fix: ${errorMessage} in ${filePath} at line ${lineNumber}`,
      aiSummary: `Fixed ${errorMessage} by adding proper null checks and error handling.`,
    };
  }

  private generateNullCheckPatch(
    lines: string[],
    targetLineIndex: number,
    variable: string,
    property: string,
  ): string {
    const targetLine = lines[targetLineIndex];
    const indent = targetLine.match(/^(\s*)/)?.[1] || '';
    
    const checkLine = `${indent}if (!${variable}) {`;
    const returnLine = `${indent}  return null;`;
    const closingBrace = `${indent}}`;
    
    const startLine = Math.max(1, targetLineIndex);
    const oldCount = 1;
    const newCount = 4;
    
    return `@@ -${startLine},${oldCount} +${startLine},${newCount} @@
-${targetLine}
+${checkLine}
+${returnLine}
+${closingBrace}
+${targetLine}`;
  }

  private generateGenericPatch(
    lines: string[],
    targetLineIndex: number,
    targetLine: string,
  ): string {
    const indent = targetLine.match(/^(\s*)/)?.[1] || '';
    const tryLine = `${indent}try {`;
    const catchLine = `${indent}} catch (error) {`;
    const errorHandle = `${indent}  console.error('Error:', error);`;
    const catchReturn = `${indent}  return null;`;
    const catchClose = `${indent}}`;
    
    const startLine = Math.max(1, targetLineIndex);
    const oldCount = 1;
    const newCount = 6;
    
    return `@@ -${startLine},${oldCount} +${startLine},${newCount} @@
-${targetLine}
+${tryLine}
+${targetLine}
+${catchLine}
+${errorHandle}
+${catchReturn}
+${catchClose}`;
  }
}

