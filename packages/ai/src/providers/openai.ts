import type { AIProvider, ImageGenerationResult } from '../types/provider-params';
import OpenAI from 'openai';

export class OpenAIProvider implements AIProvider {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }
  async textgen(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 100,
        temperature: 0.7,
      });

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI API');
      }
      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate text');
    }
  }

  async imagegen(prompt: string): Promise<ImageGenerationResult> {
    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      return {
        url: imageUrl,
        width: 1024,
        height: 1024,
        format: 'png'
      };
    } catch (error) {
      console.error('OpenAI Image Generation Error:', error);
      throw new Error('Failed to generate image');
    }
  }
}
export { OpenAI };

