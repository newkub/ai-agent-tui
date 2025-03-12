import { defineConfig } from './config/useAiConfig';

export default defineConfig({
  openai: {
    apiKey: "YOUR_OPENAI_API_KEY",
    baseUrl: "https://api.openai.com/v1",
    chat: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: "You are a helpful assistant."
    },
    generate: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 2048,
      stopSequences: [
        "\n"
      ]
    },
    embeddings: {
      model: "text-embedding-ada-002",
      dimensions: 1536
    },
    vision: {
      model: "gpt-4-vision-preview",
      maxTokens: 4096,
      detail: "auto"
    }
  },
  anthropic: {
    apiKey: "YOUR_ANTHROPIC_API_KEY",
    baseUrl: "https://api.anthropic.com/v1",
    chat: {
      model: "claude-2",
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: "You are a helpful assistant."
    },
    generate: {
      model: "claude-2",
      temperature: 0.7,
      maxTokens: 4096,
      stopSequences: [
        "\n"
      ]
    }
  },
  gemini: {
    apiKey: "YOUR_GEMINI_API_KEY",
    baseUrl: "https://api.gemini.ai/v1",
    chat: {
      model: "gemini-pro",
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: "You are a helpful assistant."
    },
    generate: {
      model: "gemini-pro",
      temperature: 0.7,
      maxTokens: 2048,
      stopSequences: [
        "\n"
      ]
    },
    embeddings: {
      model: "embedding-001",
      dimensions: 768
    }
  }
});
