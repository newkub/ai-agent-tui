# AI Module

This module provides a unified interface for interacting with various AI providers, including OpenAI, Anthropic, and Deepseek. It supports text and image generation capabilities.

## Features

- **Provider Support**: Easily switch between different AI providers.
- **Capabilities**: Supports text generation and image generation.
- **Configuration**: Configure provider-specific settings via environment variables.

## Installation

1. Install the module using Bun:

   ```bash
   bun install @lib/ai
   ```

2. Set up environment variables for provider configurations (e.g., API keys).

## Usage

### Initialization

Import the module and initialize the desired provider:

```typescript
import { providers } from '@lib/ai';

const ai = providers('openai'); // or 'anthropic', 'deepseek'
```

### Text Generation

Generate text using the `textgen` method:

```typescript
const prompt = "Write a short story about a robot.";
const result = await ai.textgen(prompt);
console.log(result);
```

### Image Generation

Generate images using the `imagegen` method:

```typescript
const prompt = "A futuristic cityscape.";
const result = await ai.imagegen(prompt);
console.log(result);
```

## Configuration

### Default Provider

Set the default provider using the `AI_DEFAULT_PROVIDER` environment variable:

```bash
export AI_DEFAULT_PROVIDER=openai
```

### Provider-Specific Settings

Configure provider-specific settings via environment variables (e.g., API keys).

## Providers

### OpenAI

- **Text Generation**: Uses GPT models for text generation.
- **Image Generation**: Uses DALL·E for image generation.

### Anthropic

- **Text Generation**: Uses Claude models for text generation.
- **Image Generation**: Uses custom models for image generation.

### Deepseek

- **Text Generation**: Uses Deepseek models for text generation.
- **Image Generation**: Uses custom models for image generation.

## Contributing

Contributions are welcome! Please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
