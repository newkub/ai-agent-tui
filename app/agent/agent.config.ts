import type { DefaultConfig } from './src/config/agentConfig';

export const defaultConfig: DefaultConfig = {
  "appName": "AI Coding Assistant",
  "version": "1.0.0",
  "api": {
    "baseUrl": "http://localhost:3000",
    "timeout": 5000
  },
  "logging": {
    "level": "debug",
    "filePath": "./logs/app.log"
  },
  "ai": {
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2048
  },
  "ignoreFiles": [
    "node_modules/**",
    "dist/**",
    "build/**"
  ]
};
