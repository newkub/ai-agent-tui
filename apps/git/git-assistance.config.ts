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
      "scope": "",
      "type": "feat",
      "description": "",
      "emoji": "",
      "maxLength": 100,
      "translate": "English",
      "bulletPoints": true
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