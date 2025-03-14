import { defineConfig } from './src/types/defineConfig';

export default defineConfig({
  "ai": {
    "useModel": "deepseek",
    "deepseek": "sk-6373d5e43bba46968807439a004e50e2",
    "gpt-4o": "",
    "claude-3.7-sonnet": ""
  },
  "commit": {
    "mode": "aicommit",
    "askMode" : false,
    "askStage": true,
    "askConfirm": true,
    "askPush": false, 
    "message": {
      "scope": true,
      "type": {
        "options": [
          "✨ feat",
          "🐛 fix",
          "📚 docs",
          "💄 style",
          "♻️ refactor",
          "🧪 test",
          "🔧 chore"
        ]
      },
      "description": {
        "required": true,
        "maxLength": 100
      },
      "emoji": true,
      "translate": "english",
      "instructions": {
        "enabled": true,
        "template": "Please follow these instructions when committing:\n1. Use clear and concise descriptions\n2. Include relevant issue numbers\n3. Specify testing details"
      }
    }
  },
  "hooks": {
    "preCommit": "npm run lint",
    "postCommit": ""
  },
  "release": {
    "generateChangelog": true,
    "versioning": "semantic",
    "publish": ""
  }
});