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

      if (!completion.content?.[0] || completion.content[0].type !== 'text') {
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
      // Anthropic doesn't support native image generation
      console.error('Image generation not supported by Anthropic');
      throw new Error('Image generation not supported by Anthropic');
    } catch (error) {
      console.error('Anthropic Image Generation Error:', error);
      throw new Error('Failed to generate image: Image generation not supported by Anthropic');
    }
  }
}
export { Anthropic };
