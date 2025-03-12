import type { AIProvider, ImageGenerationResult } from '../types/provider-params';
import OpenAI from 'openai';

export class DeepseekProvider implements AIProvider {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('Deepseek API key is required');
    }
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey
    });
  }
  

  async textgen(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 100,
        temperature: 0.7, 
      });

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from Deepseek API');
      }
      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Deepseek API Error:', error);
      throw new Error('Failed to generate text');
    }
  }

  async imagegen(prompt: string): Promise<ImageGenerationResult> {
    try {
      const response = await this.openai.images.generate({
        model: 'deepseek-art',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error('No image URL returned from Deepseek');
      }

      return {
        url: imageUrl,
        width: 1024,
        height: 1024,
        format: 'png'
      };
    } catch (error) {
      console.error('Deepseek Image Generation Error:', error);
      throw new Error('Failed to generate image');
    }
  }
}
