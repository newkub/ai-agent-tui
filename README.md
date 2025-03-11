# AI Chat CLI

A command-line interface for chatting with multiple AI providers (OpenAI, Anthropic, DeepSeek).

## Installation

1. Install dependencies:
```bash
bun install
```

2. Copy `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```

3. Run the CLI:
```bash
bun run src/index.ts
```

## Usage

- Select an AI provider when prompted
- Type your message and press Enter
- Type 'exit' to quit

## Supported Providers

- OpenAI
- Anthropic
- DeepSeek
