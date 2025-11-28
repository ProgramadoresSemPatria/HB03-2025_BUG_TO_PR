import { IPatchService } from '../contract/patch-contract';

export class PatchService implements IPatchService {
  applyPatch(originalContent: string, patch: string): string {
    try {
      const patches = this.parseUnifiedDiff(patch);
      
      if (patches.length === 0) {
        throw new Error('Invalid patch format');
      }

      let result = originalContent;
      const lines = result.split('\n');

      for (const patchHunk of patches) {
        result = this.applyHunk(result, patchHunk);
      }

      return result;
    } catch (error: any) {
      throw new Error(`Failed to apply patch: ${error.message}`);
    }
  }

  validatePatch(patch: string): boolean {
    try {
      const patches = this.parseUnifiedDiff(patch);
      return patches.length > 0;
    } catch {
      return false;
    }
  }

  private parseUnifiedDiff(patch: string): PatchHunk[] {
    const lines = patch.split('\n');
    const hunks: PatchHunk[] = [];
    let currentHunk: PatchHunk | null = null;

    for (const line of lines) {
      const hunkHeaderMatch = line.match(/^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@/);
      
      if (hunkHeaderMatch) {
        if (currentHunk) {
          hunks.push(currentHunk);
        }
        
        currentHunk = {
          oldStart: parseInt(hunkHeaderMatch[1], 10),
          oldCount: hunkHeaderMatch[2] ? parseInt(hunkHeaderMatch[2], 10) : 1,
          newStart: parseInt(hunkHeaderMatch[3], 10),
          newCount: hunkHeaderMatch[4] ? parseInt(hunkHeaderMatch[4], 10) : 1,
          lines: [],
        };
        continue;
      }

      if (currentHunk) {
        if (line.startsWith(' ')) {
          currentHunk.lines.push({ type: 'context', content: line.substring(1) });
        } else if (line.startsWith('-')) {
          currentHunk.lines.push({ type: 'removed', content: line.substring(1) });
        } else if (line.startsWith('+')) {
          currentHunk.lines.push({ type: 'added', content: line.substring(1) });
        }
      }
    }

    if (currentHunk) {
      hunks.push(currentHunk);
    }

    return hunks;
  }

  private applyHunk(content: string, hunk: PatchHunk): string {
    const lines = content.split('\n');
    const newLines: string[] = [];
    let lineIndex = 0;
    let oldLineIndex = hunk.oldStart - 1;

    while (lineIndex < oldLineIndex && lineIndex < lines.length) {
      newLines.push(lines[lineIndex]);
      lineIndex++;
    }

    for (const patchLine of hunk.lines) {
      if (patchLine.type === 'context' || patchLine.type === 'removed') {
        if (lineIndex < lines.length) {
          if (patchLine.type === 'context') {
            newLines.push(lines[lineIndex]);
          }
          lineIndex++;
        }
        oldLineIndex++;
      } else if (patchLine.type === 'added') {
        newLines.push(patchLine.content);
      }
    }

    while (lineIndex < lines.length) {
      newLines.push(lines[lineIndex]);
      lineIndex++;
    }

    return newLines.join('\n');
  }
}

interface PatchHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: Array<{
    type: 'context' | 'added' | 'removed';
    content: string;
  }>;
}

