import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIStrategy } from './ai-strategy.contract';
import { PatchInfo } from '../dto/bug-to-pr-dto';

export class GeminiStrategy implements IAIStrategy {
  private geminiClient: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.geminiClient = new GoogleGenerativeAI(apiKey);
  }

  async generatePatch(
    stackTrace: string,
    fileContent: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): Promise<PatchInfo> {
    const model = this.geminiClient.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = this.buildPrompt(stackTrace, fileContent, filePath, lineNumber, errorMessage);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return this.parseAIResponse(text, filePath, lineNumber, errorMessage);
  }

  private buildPrompt(
    stackTrace: string,
    fileContent: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): string {
    return `You are an expert code reviewer and bug fixer. Analyze the following error and generate a unified diff patch to fix it.

**Error Information:**
- Error Message: ${errorMessage}
- File: ${filePath}
- Line Number: ${lineNumber}

**Stack Trace:**
\`\`\`
${stackTrace}
\`\`\`

**File Content:**
\`\`\`
${fileContent}
\`\`\`

**Instructions:**
1. Analyze the error and identify the root cause
2. Generate a unified diff patch (format: @@ -start,count +start,count @@) that fixes the bug
3. The patch should be minimal and focused on fixing the specific error
4. Ensure the patch is syntactically correct and follows the code style

**Response Format (JSON):**
\`\`\`json
{
  "patch": "unified diff patch here",
  "description": "Brief description of the fix",
  "bugSummary": "Short summary of the bug",
  "aiSummary": "Detailed explanation of what was fixed and why"
}
\`\`\`

Generate ONLY the JSON response, no additional text or markdown formatting.`;
  }

  private parseAIResponse(
    response: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): PatchInfo {
    try {
      let jsonText = response.trim();
      
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const parsed = JSON.parse(jsonText);

      if (!parsed.patch || !parsed.description || !parsed.bugSummary) {
        throw new Error('Invalid response format: missing required fields');
      }

      return {
        patch: parsed.patch,
        description: parsed.description,
        bugSummary: parsed.bugSummary,
        aiSummary: parsed.aiSummary || `Fixed ${errorMessage} in ${filePath} at line ${lineNumber}`,
      };
    } catch (error: any) {
      console.error('[GeminiStrategy] Failed to parse AI response:', error.message);
      console.error('[GeminiStrategy] Raw response:', response);
      
      const patchMatch = response.match(/@@[\s\S]*?(?=\n\n|\n$|$)/);
      if (patchMatch) {
        return {
          patch: patchMatch[0].trim(),
          description: `AI-generated fix for ${errorMessage}`,
          bugSummary: `Fix: ${errorMessage} in ${filePath} at line ${lineNumber}`,
          aiSummary: 'AI-generated patch (parsed from response)',
        };
      }

      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }
}

