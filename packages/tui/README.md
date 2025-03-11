# @tui

Opinionated UI Kit for Command Line Apps

![npm](https://img.shields.io/npm/v/@tui)
![license](https://img.shields.io/npm/l/@tui)

## Why this package exists?
TUI is an opinionated UI Kit to log messages, render tables, display spinners, and much more. Following are some of the reasons for creating this package:

- First-class TypeScript support
- Consistent design elements
- Easy testing of UI output

## Installation
Install the package using bun:

```bash
bun add @tui
```

## Basic Usage
```typescript
import { TUI } from '@tui'
const tui = new TUI()

tui.render()
```

## Features
- **TUI**: Renders the TUI interface.

## API Documentation
### `TUI`
- `render()`: Renders the TUI interface.

## Testing
```typescript
const tui = new TUI()

tui.render()
```

## Contributing
We welcome contributions! Please read our [contributing guide](CONTRIBUTING.md).

## License
MIT