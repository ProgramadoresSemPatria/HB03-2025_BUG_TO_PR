import { z } from 'zod';

export const generatePRSchema = z.object({
  stackTrace: z.string().min(1, 'Stack trace is required'),
  owner: z.string().min(1, 'Owner is required'),
  repo: z.string().min(1, 'Repository is required'),
  branch: z.string().min(1, 'Branch is required'),
  aiProvider: z.enum(['gemini', 'openai']).optional(),
});

