# TUI Package

A TypeScript-based Terminal User Interface (TUI) library for building interactive command-line applications.

## Installation

To install the TUI package, run the following command in your terminal:

```bash
bun add @newkub/tui
```

## Basic Usage

Here's a simple example of how to use the TUI package in a TypeScript project:

```typescript
import { TUI } from '@newkub/tui';

const tui = new TUI();

// Create a simple command
tui.registerCommand({
  name: 'hello',
  description: 'Prints a greeting',
  action: async () => {
    console.log('Hello, World!');
  }
});

tui.run();
```

## Features

- **Command Management**: Easily register and manage CLI commands
- **Interactive Prompts**: Built-in support for input, selection, and confirmation prompts
- **Task Management**: Track and display task progress
- **Styling**: Support for colored text and formatted output
- **Markdown Rendering**: Display formatted markdown content in the terminal

## Documentation

### Core Components

- **Command System**: Handle CLI commands with options and validation
- **Prompt System**: Create interactive user prompts
- **Task System**: Manage and display task progress
- **Styling System**: Apply colors and styles to terminal output

### Examples

See the [examples](examples/) directory for complete usage examples.

## Contributing

Contributions are welcome! Please read our [contribution guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

MIT