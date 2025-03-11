import Anthropic from '@anthropic-ai/sdk';

export const handleAnthropic = async (message: string): Promise<string | undefined> => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [{ role: 'user', content: message }],
  });

  if (response.content[0].type === 'text') {
    return response.content[0].text;
  }
  return undefined;
};
