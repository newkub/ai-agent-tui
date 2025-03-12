# Git AI Commit

[![experiment](https://img.shields.io/badge/status-experiment-red)]()

A powerful command-line tool that generates meaningful git commit messages using AI, with a beautiful interactive experience powered by Clack.

## Features

| Feature | Description |
|---------|-------------|
| 🤖 **Multiple AI Providers** | Support for OpenAI, Deepseek, and Anthropic (Claude 3 Opus) |
| 🎨 **Beautiful Interactive CLI** | Elegant user experience with Clack |
| ⚙️ **Highly Customizable** | Flexible configuration via `git-ai-assistance.config.ts` |
| 📝 **Interactive Editing** | Edit generated commit messages before committing |
| 🚀 **Automatic Commit & Push** | Optional auto-commit and auto-push capabilities |
| 🔄 **Auto-staging** | Automatically stage all changes when no staged changes are found |
| 🏷️ **Enhanced Conventional Commits** | Improved type and scope selection for conventional commit format |

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/git-aicommit.git
cd git-aicommit

# Install dependencies
bun install

# Build the project
bun run build

# Link the CLI globally (optional)
bun link
```

## Usage

```bash
# Generate a commit message (will auto-stage if enabled)
git-aicommit

# Or stage your changes manually first
git add .
git-aicommit
```

## Configurations

Git AI Commit offers extensive configuration options to tailor the experience to your workflow. Configuration is managed through a TypeScript file that provides type safety and autocompletion in your editor.

### Setting Up Configuration

1. Create a configuration file in your project root:

```bash
# Copy the example configuration
cp git-ai-assistance.config.example.ts git-ai-assistance.config.ts

# Edit the configuration file with your preferred editor
nano git-ai-assistance.config.ts
```

### Key Configuration Areas

#### AI Provider Selection
Choose between OpenAI, Deepseek, or Anthropic as your AI backend, with customizable parameters for each:

```typescript
// Set your preferred default provider
defaultProvider: 'openai', // 'openai', 'deepseek', or 'anthropic'

// Configure each provider separately
openai: {
  model: 'gpt-4o',
  temperature: 0.7
},
```

#### Git Integration
Control how the tool interacts with your Git workflow:

```typescript
git: {
  autoCommit: true,  // Automatically commit after generating a message
  autoPush: false,   // Push commits automatically
  autoStage: true    // Stage changes when none are staged
}
```

#### Commit Message Formatting
Customize how your commit messages are structured:

```typescript
commitMessage: {
  format: 'conventional',  // Use conventional commit format
  includeEmoji: true,      // Add relevant emojis
  maxLength: 100           // Keep messages concise
}
```

### Full Configuration Example

See the [Configuration Options](#configuration-options) section below for a complete example configuration.

### Configuration Options

```typescript
// Example configuration
export default {
  // Default AI provider to use
  defaultProvider: 'openai', // 'openai', 'deepseek', or 'anthropic'
  
  // Provider-specific configurations
  openai: {
    // API key can be set via OPENAI_API_KEY environment variable
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o', // or 'gpt-3.5-turbo', etc.
    temperature: 0.7,
    maxTokens: 500
  },
  
  deepseek: {
    // API key can be set via DEEPSEEK_API_KEY environment variable
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 500
  },
  
  anthropic: {
    // API key can be set via ANTHROPIC_API_KEY environment variable
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-opus-20240229', // Claude 3 Opus
    temperature: 0.7,
    maxTokens: 500
  },
  
  git: {
    autoCommit: true, // Automatically commit after generating the message
    autoPush: false, // Automatically push after committing
    autoStage: true, // Automatically stage all changes if no staged changes are found
    includeProviderInfo: true // Include the AI provider name in the commit message
  },
  
  commitMessage: {
    maxLength: 100, // Maximum length of the commit message
    includeEmoji: true, // Include emoji in the commit message
    format: 'conventional', // 'conventional' or 'simple'
    
    // Conventional commit configuration
    conventional: {
      // Types configuration with selection support
      types: [
        { value: 'feat', name: 'feat:     A new feature', emoji: '✨' },
        { value: 'fix', name: 'fix:      A bug fix', emoji: '🐛' },
        { value: 'docs', name: 'docs:     Documentation only changes', emoji: '📝' },
        { value: 'style', name: 'style:    Changes that do not affect the meaning of the code', emoji: '💄' },
        { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature', emoji: '♻️' },
        { value: 'perf', name: 'perf:     A code change that improves performance', emoji: '⚡️' },
        { value: 'test', name: 'test:     Adding missing tests or correcting existing tests', emoji: '✅' },
        { value: 'build', name: 'build:    Changes that affect the build system or external dependencies', emoji: '🔨' },
        { value: 'ci', name: 'ci:       Changes to our CI configuration files and scripts', emoji: '👷' },
        { value: 'chore', name: 'chore:    Other changes that don\'t modify src or test files', emoji: '🔧' },
        { value: 'revert', name: 'revert:   Reverts a previous commit', emoji: '⏪' }
      ],
      
      // Scopes configuration with selection and requirement options
      scopes: [
        { value: 'core', name: 'core:     Core functionality', required: false },
        { value: 'config', name: 'config:   Configuration related', required: false },
        { value: 'ui', name: 'ui:       User interface', required: false },
        { value: 'git', name: 'git:      Git integration', required: false },
        { value: 'ai', name: 'ai:       AI integration', required: false }
      ]
    }
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `DEEPSEEK_API_KEY` | Your Deepseek API key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## Advanced Usage

### Conventional Commits

When using the conventional commit format, you can now interactively select:

| Selection | Description |
|-----------|-------------|
| **Type** | Choose from a list of commit types (feat, fix, docs, etc.) |
| **Scope** | Select from predefined scopes or enter a custom one |

### Auto-staging

If no staged changes are found and `autoStage` is enabled, the tool will automatically stage all changes before generating a commit message.

### Auto-push

When `autoPush` is enabled, the tool will automatically push your commit to the remote repository after committing.

## License

MIT
