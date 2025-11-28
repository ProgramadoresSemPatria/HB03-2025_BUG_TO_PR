import OpenAI from 'openai';
import { IAIStrategy } from './ai-strategy.contract';
import { PatchInfo } from '../dto/bug-to-pr-dto';

export class OpenAIStrategy implements IAIStrategy {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generatePatch(
    stackTrace: string,
    fileContent: string,
    filePath: string,
    lineNumber: number,
    errorMessage: string,
  ): Promise<PatchInfo> {
    const prompt = this.buildPrompt(stackTrace, fileContent, filePath, lineNumber, errorMessage);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code reviewer and bug fixer. Analyze errors and generate unified diff patches to fix bugs. Always respond with valid JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAIResponse(response, filePath, lineNumber, errorMessage);
    } catch (error: any) {
      console.error('[OpenAIStrategy] Error calling OpenAI API:', error.message);
      throw error;
    }
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
You must respond with a valid JSON object with the following structure:
{
  "patch": "unified diff patch here",
  "description": "Brief description of the fix",
  "bugSummary": "Short summary of the bug",
  "aiSummary": "Detailed explanation of what was fixed and why"
}

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
      console.error('[OpenAIStrategy] Failed to parse AI response:', error.message);
      console.error('[OpenAIStrategy] Raw response:', response);
      
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

