import OpenAI from 'openai';

export const handleOpenAI = async (message: string): Promise<string> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    model: 'gpt-4',
  });

  return completion.choices[0].message.content || '';
};
