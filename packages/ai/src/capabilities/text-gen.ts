export interface TextGenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

export interface TextGenerationResponse {
  text: string;
}

export const generateText = async (
  options: TextGenerationOptions,
  config: { provider: string; openai?: { createCompletion: (options: { model: string; prompt: string; max_tokens: number; temperature: number; top_p: number }) => Promise<{ data: { choices: { text: string }[] } }> }; anthropic?: never }
): Promise<TextGenerationResponse> => {
  try {
    if (config.provider === 'openai' && config.openai) {
      const response = await config.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: options.prompt,
        max_tokens: options.maxTokens || 100,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1,
      });
      return {
        text: response.data.choices[0].text.trim(),
      };
    }
    throw new Error(`Text generation not supported by ${config.provider}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Text generation failed for ${config.provider}: ${error.message}`);
    }
    throw new Error(`Text generation failed for ${config.provider}: Unknown error`);
  }
};