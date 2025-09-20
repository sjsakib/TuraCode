# Data Model: Toy Language Playground

## Overview

The Toy Language Playground is primarily a client-side application with no persistent data storage. The data model focuses on the in-memory structures used during the editing, transpilation, and execution process.

## Core Data Structures

### PlaygroundState

The central state object that manages the current state of the playground.

```typescript
interface PlaygroundState {
  sourceCode: string;         // The user's input code
  isExecuting: boolean;       // Whether code is currently executing
  output: OutputEntry[];      // The execution results
  editorSettings: EditorSettings;  // Configuration for the editor
}

interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'light' | 'dark';
}

interface OutputEntry {
  type: 'result' | 'error' | 'log';
  content: string;
  timestamp: number;
}
```

### TranspilationResult

Represents the result of attempting to transpile the source code. Note that the core package's `transpileSrc` function returns only a string with the transpiled JavaScript code, but may throw exceptions. This interface wraps that behavior with a more structured approach.

```typescript
interface TranspilationResult {
  success: boolean;
  code?: string;        // The transpiled JavaScript code (when success is true)
  error?: {
    message: string;    // Error message from caught exception
    line?: number;      // If available, the line where error occurred
    column?: number;    // If available, the column where error occurred
  };
}
```

### ExecutionResult

Represents the result of executing the transpiled code.

```typescript
interface ExecutionResult {
  success: boolean;
  output: string[];        // Array of output strings
  errors?: ExecutionError[]; // Any errors encountered during execution
  executionTime: number;   // Time taken to execute in milliseconds
}

interface ExecutionError {
  message: string;
  stack?: string;
  isFatal: boolean;       // Whether this error stopped execution
}
```

## State Management

The playground will use a simple state management approach with vanilla JavaScript. We'll use a lightweight pub/sub pattern or a custom store to manage state.

```typescript
// Simple state store
class PlaygroundStore {
  private state: PlaygroundState;
  private listeners: Array<(state: PlaygroundState) => void> = [];
  
  constructor(initialState: PlaygroundState) {
    this.state = initialState;
  }
  
  getState(): PlaygroundState {
    return { ...this.state };
  }
  
  setState(partialState: Partial<PlaygroundState>): void {
    this.state = { ...this.state, ...partialState };
    this.notifyListeners();
  }
  
  subscribe(listener: (state: PlaygroundState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

// Example actions
const actions = {
  setSourceCode: (store: PlaygroundStore, sourceCode: string) => {
    store.setState({ sourceCode });
  },
  startExecution: (store: PlaygroundStore) => {
    store.setState({ isExecuting: true, output: [] });
  },
  finishExecution: (store: PlaygroundStore, output: OutputEntry[]) => {
    store.setState({ isExecuting: false, output });
  },
  clearOutput: (store: PlaygroundStore) => {
    store.setState({ output: [] });
  },
  updateEditorSettings: (store: PlaygroundStore, settings: Partial<EditorSettings>) => {
    store.setState({ 
      editorSettings: { ...store.getState().editorSettings, ...settings } 
    });
  }
};
```

## Data Flow

1. User inputs code in the editor, updating the `sourceCode` in the `PlaygroundState`
2. When the run button is clicked, `isExecuting` is set to true
3. The code is sent to the transpiler (from the core package)
4. The playground attempts to call `transpileSrc` in a try-catch block:
   - If successful, it gets a string with the transpiled JavaScript code
   - If it throws an exception, the error is caught and formatted
5. The result is wrapped in a `TranspilationResult` object
6. If transpilation was successful, the transpiled code is executed
7. Execution produces an `ExecutionResult`
8. Results are converted to `OutputEntry` objects and added to the `output` array
9. `isExecuting` is set to false

## Component Data Requirements

### Editor Component
- Requires: `sourceCode`, `editorSettings`
- Produces: Updated `sourceCode`

### Control Panel Component
- Requires: `isExecuting`
- Produces: Run and clear actions

### Output Component
- Requires: `output`
- Displays: Formatted output entries

## Data Persistence

The playground will not persist data to a server, but could optionally use browser localStorage to remember:
- Last edited code
- Editor settings preferences

This persistence would be optional and not critical to the core functionality.