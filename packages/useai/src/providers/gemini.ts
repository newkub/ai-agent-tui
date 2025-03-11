import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ProviderHandler } from '../types/providers';

export const createGeminiProvider = (apiKey: string): ProviderHandler => {
  const genAI = new GoogleGenerativeAI(apiKey);

  return async (prompt: string): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error in GeminiProvider:', error);
      throw error;
    }
  };
};
