const textResponse = await ai.openai.textgen({
    prompt: 'Write a short story about a robot.',
    temperature: 0.7,
    maxTokens: 500,
    model: 'gpt-3.5-turbo'
});

const imageResponse = await ai.openai.imagegen({
    prompt: 'A futuristic cityscape.',
    size: '1024x1024',
    n: 1,
    model: 'dall-e-3',
    format: 'png'
});