export interface ImageGenerationOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  n?: number;
}

export interface ImageGenerationResponse {
  images: string[];
}

class AIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIError';
  }
}

export const generateImage = async (
  options: ImageGenerationOptions,
  config: { provider: string; openai?: { createImage: (options: { prompt: string; n: number; size: string }) => Promise<{ data: { data: { url: string }[] } }> }; anthropic?: never }
): Promise<ImageGenerationResponse> => {
  try {
    if (config.provider === 'openai' && config.openai) {
      const response = await config.openai.createImage({
        prompt: options.prompt,
        n: options.n || 1,
        size: options.size || '1024x1024',
      });
      return {
        images: response.data.data.map((img) => img.url),
      };
    }
    throw new AIError(`Image generation not supported by ${config.provider}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AIError(`Image generation failed for ${config.provider}: ${error.message}`);
    }
    throw new AIError(`Image generation failed for ${config.provider}: Unknown error`);
  }
};