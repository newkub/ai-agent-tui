import OpenAI from 'openai';

type Message = {
  role: 'system' | 'user';
  content: string;
};

type CompletionRequest = {
  messages: Message[];
  model: string;
};

const createOpenAIInstance = (apiKey: string) => new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey
});

const createCompletionRequest = (prompt: string): CompletionRequest => ({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: prompt }
  ],
  model: 'deepseek-chat'
});

const getCompletionContent = (completion: OpenAI.Chat.Completions.ChatCompletion): string | null => {
  return completion.choices[0].message.content;
};

export const deepseekClient = async (prompt: string) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY is not defined');

  const openai = createOpenAIInstance(apiKey);
  const completion = await openai.chat.completions.create(createCompletionRequest(prompt));
  return getCompletionContent(completion);
};
