import { DeepseekProvider } from '../../src/providers/deepseek';

async function main() {
  try {
    console.log('Starting Deepseek text generation...');
    const ai = new DeepseekProvider();
    const prompt = 'Hello, Deepseek!'; 
    console.log('Using prompt:', prompt);
    const response = await ai.textgen(prompt);
    console.log('Deepseek Response:', response);
    console.log('Text generation completed successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
