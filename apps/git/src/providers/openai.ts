import OpenAI from 'openai';

type Config = {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
};

type CompletionResponse = {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

export const openaiClient = async (diff: string, config: Config = {}): Promise<CompletionResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');

  const openai = new OpenAI({ apiKey });
  const model = config.model || 'gpt-3.5-turbo';

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'Generate a concise commit message' },
      { role: 'user', content: diff }
    ],
    max_tokens: config.maxTokens,
    temperature: config.temperature,
    top_p: config.topP
  });

  return {
    content: completion.choices[0].message.content || '',
    usage: completion.usage ? {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens
    } : undefined
  };
};
