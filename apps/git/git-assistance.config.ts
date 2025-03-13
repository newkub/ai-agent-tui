import { defineConfig } from './src/types/defineConfig';

export default defineConfig({
  "ai": {
    "modelConfiguration": {
      "defaultModel": "deepseek-chat",
      "fallbackChain": [
        "gpt-3.5-turbo",
        "claude-3-haiku"
      ],
      "providers": [
        {
          "provider": "openai",
          "model": "gpt-4",
          "temperature": 0.7,
          "maxTokens": 2048,
          "apiKey": ""
        },
        {
          "provider": "deepseek",
          "model": "deepseek-chat",
          "temperature": 0.7,
          "maxTokens": 2048,
          "apiKey": ""
        },
        {
          "provider": "anthropic",
          "model": "claude-3-sonnet",
          "temperature": 0.7,
          "maxTokens": 2048,
          "apiKey": ""
        }
      ]
    },
    "languageConfiguration": {
      "language": "English"
    },
    "rateLimit": {
      "maxRequests": 100,
      "timeWindow": 3600,
      "alertThreshold": 80
    },
    "prompt": {
      "systemMessage": "You are a helpful assistant.",
      "responseFormat": "markdown",
      "maxRetry": 3
    }
  },
  "commit": {
    "validation": {
      "message": true,
      "branchName": true,
      "allowedBranches": [
        "main",
        "develop"
      ],
      "allowedTypes": [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore"
      ],
      "scopePattern": "[a-z]+([a-z-]+)?: .+$"
    },
    "automation": {
      "autoStage": true,
      "autoCommit": true,
      "autoPush": true,
      "stagingMode": "auto"
    },
    "message": {
      "format": "conventional",
      "maxLength": 100,
      "includeEmoji": true,
      "translate": {
        "enable": false,
        "targetLang": "English"
      },
      "emojiMap": {
        "feat": "✨",
        "fix": "🐛",
        "docs": "📚",
        "style": "💄",
        "refactor": "♻️",
        "perf": "⚡️",
        "test": "✅",
        "chore": "🔧"
      }
    }
  },
  "git": {
    "hooks": {
      "preCommit": {
        "enable": true,
        "commands": [
          "npm run lint",
          "npm run test"
        ],
        "timeout": 30000
      },
      "commitMsg": {
        "enable": true,
        "pattern": "^[a-z]+([a-z-]+)?: .+$",
        "commands": [],
        "errorMessage": "Invalid commit message format"
      }
    },
    "branch": {
      "protection": {
        "main": {
          "protected": true,
          "requiredStatusChecks": [
            "lint",
            "test"
          ],
          "requiredApprovals": 1,
          "allowForcePushes": false
        },
        "develop": {
          "autoMerge": "squash",
          "cleanupAfterMerge": true,
          "maxStaleDays": 7
        }
      },
      "namingConvention": {
        "feature": "feature/*",
        "hotfix": "hotfix/*"
      }
    }
  },
  "release": {
    "versioning": {
      "strategy": "semantic",
      "preReleaseTag": "beta"
    },
    "changelog": {
      "template": "standard",
      "includeTypes": [
        "feat",
        "fix"
      ],
      "autoGenerate": true
    },
    "notifications": {
      "slack": "https://hooks.slack.com/services/...",
      "email": [
        "team@example.com"
      ]
    }
  },
  "security": {
    "secretScanning": {
      "patterns": [
        "API_KEY",
        "SECRET_KEY"
      ],
      "exclude": [
        "test/**"
      ]
    },
    "encryption": {
      "enable": true,
      "keyFile": "encryption.key",
      "algorithm": "aes-256-cbc"
    }
  },
  "experimental": {
    "features": {
      "ai-code-review": {
        "enabled": true,
        "description": "Enable AI-powered code review"
      }
    }
  }
});