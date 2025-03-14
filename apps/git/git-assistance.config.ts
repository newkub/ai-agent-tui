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
      "scope": {
        "required": true,
        "description": "Specify the scope of changes (e.g., component, page, api)"
      },
      "type": {
        "options": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
        "description": "Type of change being made"
      },
      "description": {
        "required": true,
        "maxLength": 100,
        "description": "Brief description of changes"
      },
      "emoji": {
        "enabled": true,
        "description": "Add relevant emoji to commit message"
      },
      "bulletPoints": {
        "enabled": true,
        "maxItems": 3,
        "description": "Use bullet points for detailed changes"
      },
      "translate": {
        "enabled": false,
        "description": "Translate commit message to English"
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