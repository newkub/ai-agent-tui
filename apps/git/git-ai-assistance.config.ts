import type { AicommitConfig } from "./src/git-ai-assistance.config";

export default {
  providers: {
    active: "deepseek",
    defaultModel: "deepseek-chat",
    openai: {
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 500,
      apiKey: 'process.env.OPENAI_API_KEY || ""',
    },
    deepseek: {
      model: "deepseek-chat",
      temperature: 0.7,
      maxTokens: 500,
      apiKey: 'process.env.DEEPSEEK_API_KEY || "sk-5546ae837b4d4ba9b23b29a387b8f613"',
    },
    anthropic: {
      model: "claude-3-opus",
      temperature: 0.7,
      maxTokens: 500,
      apiKey: 'process.env.ANTHROPIC_API_KEY || ""',
    },
  },
  git: {
    autoCommit: false,
    autoStage: false,
    stagingMode: "ask",
    autoPush: false,
    includeProviderInfo: false,
    signCommits: false,
  },
  commitMessage: {
    maxLength: 72,
    includeEmoji: true,
    format: "conventional",
    capitalize: true,
    addPeriod: false,
    language: "English",
    askLanguage: false,
    emojiMap: {
      feat: "✨",
      fix: "🐛",
      docs: "📚",
      style: "💎",
      refactor: "♻️",
      perf: "🚀",
      test: "🧪",
      build: "🛠️",
      ci: "⚙️",
      chore: "🧹",
      revert: "⏪",
    },
  },
  ui: {
    showDiffSummary: true,
    confirmCommit: true,
    confirmPush: true,
    colorTheme: "default",
  },
} as AicommitConfig;
