# TuraCode Playground

An interactive web-based playground for writing, testing, and executing TuraCode programs directly in the browser.

## Features

- **Interactive Editor**: Monaco-based code editor with syntax highlighting for TuraCode
- **Real-time Execution**: Run your code and see the results immediately
- **Error Handling**: Clear error messages with line and column information
- **Example Programs**: Pre-built examples to learn language features
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- pnpm package manager

### Installation

```bash
# From the project root
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

This will:
1. Copy example files to the public directory
2. Start the Vite development server
3. Open the playground in your default browser

### Building for Production

```bash
# Build the playground for production
pnpm build
```

The built files will be in the `dist` directory.

## Architecture

The playground is built using:

- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Monaco Editor** - Code editor component
- **Tailwind CSS** - Utility-first CSS framework

### Key Components

- **Editor Component**: Handles code input with syntax highlighting
- **Result Panel**: Displays execution outputs and errors
- **Control Panel**: Provides run controls and example selection
- **Playground Component**: Orchestrates the overall functionality

### State Management

The playground uses a custom lightweight state management solution with a pub/sub pattern:

- `PlaygroundStore` maintains application state
- Components subscribe to state changes
- Actions update the state and notify subscribers

### Code Execution Flow

1. User writes TuraCode in the editor
2. User clicks the "Run" button
3. Code is transpiled to JavaScript using `@turacode/core`
4. Transpiled code is executed in a controlled browser environment
5. Output and errors are captured and displayed in the result panel

## Example Programs

The playground includes several example programs to help users learn TuraCode:

- **Basic Example**: Simple variables, expressions, and control flow
- **Functions Example**: Function definitions, parameters, and return values
- **Error Handling**: Examples of common syntax and runtime errors
- **Performance Test**: Larger code sample for performance testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Make changes to the playground code
2. Test your changes with different TuraCode programs
3. Ensure responsive design works on different screen sizes
4. Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.