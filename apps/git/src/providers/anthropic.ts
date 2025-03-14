import Anthropic from '@anthropic-ai/sdk';

type Message = {
  role: 'user';
  content: string;
};

type CompletionRequest = {
  messages: Message[];
  model: string;
  max_tokens: number;
};

const createAnthropicClient = (apiKey: string) => new Anthropic({ apiKey });

const createMessage = (prompt: string): Message => ({ role: 'user', content: prompt });

const createCompletionRequest = (model: string, maxTokens: number) => (messages: Message[]): CompletionRequest => ({
  messages,
  model,
  max_tokens: maxTokens
});

const getCompletionText = (completion: Anthropic.Message): string => {
  const firstContent = completion.content[0];
  if (firstContent.type === 'text') {
    return firstContent.text;
  }
  throw new Error('Unexpected content type');
};

export const anthropicClient = async (prompt: string) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not defined');

  const anthropic = createAnthropicClient(apiKey);
  const message = createMessage(prompt);
  const completionRequest = createCompletionRequest('claude-3-opus-20240229', 1000)([message]);
  const completion = await anthropic.messages.create(completionRequest);
  return getCompletionText(completion);
};
