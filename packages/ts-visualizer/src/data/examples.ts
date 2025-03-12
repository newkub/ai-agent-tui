export interface ApiConfig {
    baseUrl: string;
    timeout: number;
  }
  
  export interface LoggingConfig {
    level: string;
    filePath: string;
  }
  
  export interface AiConfig {
    model: string;
    temperature: number;
    maxTokens: number;
  }
  
  export interface AgentConfig {
    appName: string;
    version: string;
    api: ApiConfig;
    logging: LoggingConfig;
    ai: AiConfig;
    ignoreFiles: string[];
  }
  
  export type DefaultConfig = AgentConfig;
  
  export const defaultConfig: DefaultConfig = {
    appName: 'AI Coding Assistant',
    version: '1.0.0',
    api: {
      baseUrl: 'http://localhost:3000',
      timeout: 5000,
    },
    logging: {
      level: 'debug',
      filePath: './logs/app.log',
    },
    ai: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
    },
    ignoreFiles: [
      'node_modules/**',
      'dist/**',
      'build/**',
      // .gitignore patterns are automatically included
    ],
  };
  