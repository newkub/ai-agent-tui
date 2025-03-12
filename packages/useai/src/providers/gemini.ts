import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatProvider } from '../types/providers';

export const createGeminiProvider = (apiKey: string): ChatProvider => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  return {
    id: 'gemini',
    name: 'Google Gemini',
    apiKey,
    chat: async (messages) => {
      const result = await model.generateContent(messages[0].content);
      return result.response.text();
    }
  };
};
