/**
 * Type definitions for the Toy Language Playground
 * 
 * This file contains TypeScript interfaces for all data structures used in the playground,
 * including PlaygroundState, EditorSettings, OutputEntry, and TranspilationResult.
 */

/**
 * Editor settings for configuring the Monaco editor.
 */
export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'light' | 'dark';
}

/**
 * An entry in the playground output panel.
 */
export interface OutputEntry {
  type: 'result' | 'error' | 'log';
  content: string;
  timestamp: number;
}

/**
 * The main state object that manages the current state of the playground.
 */
export interface PlaygroundState {
  sourceCode: string;         // The user's input code
  isExecuting: boolean;       // Whether code is currently executing
  output: OutputEntry[];      // The execution results
  editorSettings: EditorSettings;  // Configuration for the editor
}

/**
 * Represents the result of transpiling the source code.
 * 
 * Note: The core package's `transpileSrc` function returns only a string with 
 * the transpiled JavaScript code, but may throw exceptions. This interface 
 * wraps that behavior with a more structured approach.
 */
export interface TranspilationResult {
  success: boolean;
  code?: string;        // The transpiled JavaScript code (when success is true)
  error?: {
    message: string;    // Error message from caught exception
    line?: number;      // If available, the line where error occurred
    column?: number;    // If available, the column where error occurred
  };
}

/**
 * Represents an error that occurred during code execution.
 */
export interface ExecutionError {
  message: string;
  stack?: string;
  isFatal: boolean;       // Whether this error stopped execution
}

/**
 * Represents the result of executing the transpiled code.
 */
export interface ExecutionResult {
  success: boolean;
  output: string[];        // Array of output strings
  errors?: ExecutionError[]; // Any errors encountered during execution
  executionTime: number;   // Time taken to execute in milliseconds
}

/**
 * Monaco editor instance type from monaco-editor
 * This is a placeholder to avoid direct dependency on monaco-editor
 * to allow importing types.ts in files that don't need the full monaco dependency
 */
export interface MonacoEditor {
  dispose: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  onDidChangeModelContent: (listener: () => void) => { dispose: () => void };
  // Add other properties as needed
}

/**
 * Monaco editor namespace placeholder type
 * This allows referencing the monaco namespace without direct dependency
 */
export interface Monaco {
  editor: {
    create: (element: HTMLElement, options: any) => MonacoEditor;
    // Add other properties as needed
  };
  languages: {
    register: (language: { id: string, aliases?: string[] }) => void;
    setMonarchTokensProvider: (language: string, tokenizer: any) => void;
    // Add other properties as needed
  };
  // Add other namespaces as needed
}
