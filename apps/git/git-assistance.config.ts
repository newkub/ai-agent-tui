import { defineConfig } from './src/types/config/defineConfig';

export default defineConfig({
  "ai": {
    "modelConfiguration": {
      "defaultModel": "deepseek-chat",
      "fallbackChain": [
        "deepseek-chat",
        "gpt-4o",
        "claude-3-sonnet"
      ],
      "models": {
        "gpt-3.5-turbo": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "gpt-4": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "gpt-4-turbo": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "gpt-4o": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "deepseek-chat": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "deepseek-coder": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "claude-3-opus": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "claude-3-sonnet": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        },
        "claude-3-haiku": {
          "apiKey": "",
          "temperature": 0.7,
          "maxTokens": 2048,
          "timeout": 10000
        }
      }
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
    },
    "providers": {
      "openai": {
        "model": "gpt-4",
        "temperature": 0.7,
        "maxTokens": 2048,
        "apiKey": ""
      },
      "deepseek": {
        "model": "deepseek-chat",
        "temperature": 0.7,
        "maxTokens": 2048,
        "apiKey": ""
      },
      "anthropic": {
        "model": "claude-3-sonnet",
        "temperature": 0.7,
        "maxTokens": 2048,
        "apiKey": ""
      }
    }
  },
  "commit": {
    "validation": {
      "message": true,
      "branchName": true,
      "allowedBranches": [
        "main",
        "develop",
        "feature/*",
        "hotfix/*"
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
      "scopePattern": "[a-z]+(-[a-z]+)*"
    },
    "automation": {
      "autoStage": true,
      "autoCommit": true,
      "autoPush": true,
      "stagingMode": "ask"
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
          "lint-staged"
        ],
        "timeout": 10000
      },
      "commitMsg": {
        "enable": true,
        "pattern": "^[A-Z]+-[0-9]+: .+",
        "commands": [],
        "errorMessage": "Commit message must follow the pattern: JIRA-123: description"
      }
    },
    "branch": {
      "protection": {
        "main": {
          "protected": true,
          "requiredStatusChecks": [
            "test",
            "lint"
          ],
          "requiredApprovals": 1,
          "allowForcePushes": false
        },
        "develop": {
          "autoMerge": "squash",
          "cleanupAfterMerge": true,
          "maxStaleDays": 30
        }
      },
      "namingConvention": {
        "feature": "feature/*",
        "hotfix": "hotfix/*"
      }
    }
  },
  "release": {
    "release": {
      "versioning": {
        "strategy": "semantic",
        "preReleaseTag": "beta"
      },
      "changelog": {
        "template": "standard",
        "includeTypes": [
          "feat",
          "fix",
          "perf"
        ],
        "excludeScopes": [
          "docs",
          "style"
        ],
        "autoGenerate": true
      },
      "notifications": {
        "slack": "",
        "email": [],
        "webhook": ""
      }
    }
  },
  "security": {
    "security": {
      "secretScanning": {
        "patterns": [
          "apiKey",
          "secret"
        ],
        "exclude": [
          "node_modules"
        ]
      },
      "encryption": {
        "enable": false,
        "keyFile": "",
        "algorithm": "aes-256-cbc"
      }
    }
  },
  "experimental": {
    "experimental": {
      "features": {
        "autoCodeReview": {
          "enabled": false,
          "description": "Automatically review code for best practices"
        },
        "autoFix": {
          "enabled": false,
          "description": "Automatically fix common code issues"
        }
      }
    }
  }
});