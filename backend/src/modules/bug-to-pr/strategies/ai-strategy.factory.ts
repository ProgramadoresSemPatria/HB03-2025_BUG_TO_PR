import { IAIStrategy } from './ai-strategy.contract';
import { GeminiStrategy } from './gemini.strategy';
import { OpenAIStrategy } from './openai.strategy';
import { env } from '../../../config/env';

export type AIProvider = 'gemini' | 'openai';

export class AIStrategyFactory {
  static create(provider?: AIProvider): IAIStrategy {
    const selectedProvider = provider || env.AI_PROVIDER;

    switch (selectedProvider) {
      case 'gemini':
        if (!env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is required when using Gemini provider');
        }
        console.log('Using Gemini Strategy');
        return new GeminiStrategy(env.GEMINI_API_KEY);

      case 'openai':
        if (!env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY is required when using OpenAI provider');
        }
        console.log('Using OpenAI Strategy');
        return new OpenAIStrategy(env.OPENAI_API_KEY);

      default:
        throw new Error(`Invalid AI provider: ${selectedProvider}. Must be 'gemini' or 'openai'`);
    }
  }
}

