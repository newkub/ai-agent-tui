# Agent Package

This package provides an interface for interacting with multiple AI providers.

## Installation

```bash
bun install
```

## Usage

```typescript
import { Agent } from './src';

const agent = new Agent();

// Chat with OpenAI
const openaiResponse = await agent.chat('openai', 'Hello');

// Chat with Anthropic
const anthropicResponse = await agent.chat('anthropic', 'Hello');
```

## Configuration

Set the following environment variables in your `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Testing

Run the test suite:

```bash
bun test
```
