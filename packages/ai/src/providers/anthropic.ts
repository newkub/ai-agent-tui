import type { AIProvider, ImageGenerationResult } from '../types/provider-params';
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProvider implements AIProvider {
  private anthropic: Anthropic;
  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }
    this.anthropic = new Anthropic({
      apiKey: apiKey
    });
  }

  async textgen(prompt: string): Promise<string> {
    try {
      const completion = await this.anthropic.messages.create({
        model: 'claude-2.1',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 100,
        temperature: 0.7,
      });

      if (!completion.content?.[0]?.text) {
        throw new Error('Invalid response format from Anthropic API');
      }
      return completion.content[0].text.trim();
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error('Failed to generate text');
    }
  }

  async imagegen(prompt: string): Promise<ImageGenerationResult> {
    try {
      const response = await this.anthropic.images.generate({
        model: 'claude-vision',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error('No image URL returned from Anthropic');
      }

      return {
        url: imageUrl,
        width: 1024,
        height: 1024,
        format: 'png'
      };
    } catch (error) {
      console.error('Anthropic Image Generation Error:', error);
      throw new Error('Failed to generate image');
    }
  }
}
export { Anthropic };

