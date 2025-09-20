# Quickstart Guide: Toy Language Playground

This guide will help you set up and implement the Toy Language Playground as a new package in the project.

## Setup

### 1. Create Package Structure

Create a new package in the packages directory with the following structure:

```
packages/playground/
├── src/
│   ├── components/
│   │   ├── editor.ts
│   │   ├── playground.ts
│   │   ├── resultPanel.ts
│   │   └── controlPanel.ts
│   ├── utils/
│   │   ├── monaco-config.ts
│   │   ├── executor.ts
│   │   └── store.ts
│   ├── types.ts
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 2. Configure Package

Create a basic package.json:

```json
{
  "name": "@turacode/playground",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@turacode/core": "workspace:*",
    "monaco-editor": "^0.36.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.21",
    "tailwindcss": "^3.3.1",
    "typescript": "^4.9.3",
    "vite": "^4.2.0",
    "vite-plugin-monaco-editor": "^1.1.0"
  }
}
```

Set up Vite configuration in vite.config.ts:

```typescript
import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  plugins: [
    monacoEditorPlugin({})
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

Configure Tailwind CSS:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create the PostCSS configuration:

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Implement Monaco Editor

Create a Monaco Editor configuration utility (monaco-config.ts):

```typescript
import * as monaco from 'monaco-editor';

// Language ID for our toy language
const LANGUAGE_ID = 'tc';
const LANGUAGE_NAME = 'TuraCode';

/**
 * Initialize Monaco Editor with the TuraCode language
 */
export function initMonacoEditor(
  container: HTMLElement,
  initialValue: string = '',
  options: monaco.editor.IStandaloneEditorConstructionOptions = {}
): monaco.editor.IStandaloneCodeEditor {
  // Register the language if not already registered
  registerTuraCodeLanguage();
  
  // Create editor with default + custom options
  const editor = monaco.editor.create(container, {
    value: initialValue,
    language: LANGUAGE_ID,
    theme: 'turaCodeTheme',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    tabSize: 2,
    renderWhitespace: 'none',
    wordWrap: 'on',
    ...options
  });
  
  // Set up window resize handler
  window.addEventListener('resize', () => {
    editor.layout();
  });
  
  return editor;
}

/**
 * Register the TuraCode language with Monaco
 */
function registerTuraCodeLanguage(): void {
  // Only register once
  if (monaco.languages.getLanguages().some(lang => lang.id === LANGUAGE_ID)) {
    return;
  }
  
  // Register language
  monaco.languages.register({ id: LANGUAGE_ID, aliases: [LANGUAGE_NAME] });
  
  // Define tokenizer rules
  monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
    tokenizer: {
      root: [
        // Keywords
        [/\b(let|const|if|else|while|for|function|return|true|false)\b/, 'keyword'],
        
        // Strings
        [/"([^"\\]|\\.)*$/, 'string.incomplete'],
        [/'([^'\\]|\\.)*$/, 'string.incomplete'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        
        // Numbers
        [/\b\d+\.\d+\b/, 'number.float'],
        [/\b\d+\b/, 'number'],
        
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        
        // Identifiers
        [/[a-zA-Z_]\w*/, 'identifier'],
        
        // Delimiters and operators
        [/[{}()\[\]]/, 'delimiter.bracket'],
        [/[;,.]/, 'delimiter'],
        [/[=!<>]=?/, 'operator'],
        [/[+\-*/%&|^~]/, 'operator'],
      ],
      
      string_double: [
        [/[^"\\]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ],
      
      string_single: [
        [/[^'\\]+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop']
      ],
      
      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ]
    }
  });
  
  // Define a theme
  monaco.editor.defineTheme('turaCodeTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'string', foreground: 'A31515' },
      { token: 'string.escape', foreground: 'FF0000' },
      { token: 'comment', foreground: '008000' },
      { token: 'number', foreground: '098658' },
      { token: 'number.float', foreground: '098658' },
      { token: 'delimiter.bracket', foreground: '000000' },
      { token: 'delimiter', foreground: '000000' },
      { token: 'operator', foreground: '000000' },
      { token: 'identifier', foreground: '001080' }
    ],
    colors: {}
  });
}

/**
 * Highlight syntax errors in the editor
 * Note: This functionality is not supported initially and may be added later
 */
export function highlightErrors(
  editor: monaco.editor.IStandaloneCodeEditor,
  error: { message: string; line?: number; column?: number }
): void {
  // Error highlighting not implemented
  console.log('Error highlighting not supported yet:', error);
}

/**
 * Clear all error highlights
 * Note: This functionality is not supported initially and may be added later
 */
export function clearErrors(editor: monaco.editor.IStandaloneCodeEditor): void {
  // Error highlighting not implemented
}

/**
 * Dispose of the editor properly
 */
export function disposeEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
  if (editor) {
    editor.dispose();
  }
}
```

#### Main Component (playground.ts)

```typescript
import { transpileSrc } from '@turacode/core';
import { PlaygroundStore } from '../utils/store';
import { initMonacoEditor } from '../utils/monaco-config';
import { PlaygroundState, OutputEntry } from '../types';

export class Playground {
  private container: HTMLElement;
  private editorContainer: HTMLElement;
  private controlPanel: HTMLElement;
  private resultPanel: HTMLElement;
  private editor: any; // Monaco editor instance
  private store: PlaygroundStore;

  constructor(container: HTMLElement) {
    this.container = container;
    
    // Initialize store
    this.store = new PlaygroundStore({
      sourceCode: '// Write your code here',
      output: [],
      isExecuting: false,
      editorSettings: {
        fontSize: 14,
        tabSize: 2,
        theme: 'light'
      }
    });
    
    // Create DOM structure
    this.createDomStructure();
    
    // Initialize editor
    this.initEditor();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Subscribe to state changes
    this.store.subscribe(state => this.render(state));
  }
  
  private createDomStructure(): void {
    // Create header
    const header = document.createElement('div');
    header.className = 'p-4 bg-gray-100 border-b';
    header.innerHTML = `
      <h1 class="text-2xl font-bold">Toy Language Playground</h1>
      <p class="text-gray-600">
        Write code in the editor below and click Run to execute it.
      </p>
    `;
    this.container.appendChild(header);
    
    // Create main content area
    const content = document.createElement('div');
    content.className = 'flex flex-col md:flex-row flex-1 overflow-hidden';
    
    // Create editor container
    this.editorContainer = document.createElement('div');
    this.editorContainer.className = 'w-full md:w-3/5 h-[400px] md:h-full';
    content.appendChild(this.editorContainer);
    
    // Create right panel container
    const rightPanel = document.createElement('div');
    rightPanel.className = 'w-full md:w-2/5 h-[300px] md:h-full flex flex-col';
    
    // Create control panel
    this.controlPanel = document.createElement('div');
    this.controlPanel.className = 'p-4 border-b flex gap-2';
    rightPanel.appendChild(this.controlPanel);
    
    // Create result panel
    this.resultPanel = document.createElement('div');
    this.resultPanel.className = 'flex-1 overflow-auto p-4 font-mono text-sm';
    rightPanel.appendChild(this.resultPanel);
    
    content.appendChild(rightPanel);
    this.container.appendChild(content);
  }
  
  private initEditor(): void {
    const state = this.store.getState();
    this.editor = initMonacoEditor(
      this.editorContainer,
      state.sourceCode,
      {
        fontSize: state.editorSettings.fontSize,
        tabSize: state.editorSettings.tabSize,
        theme: state.editorSettings.theme === 'dark' ? 'vs-dark' : 'vs'
      }
    );
    
    // Update store when editor content changes
    this.editor.onDidChangeModelContent(() => {
      const value = this.editor.getValue();
      this.store.setState({ sourceCode: value });
    });
  }
  
  private setupEventListeners(): void {
    // Add run button
    const runButton = document.createElement('button');
    runButton.className = 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded';
    runButton.textContent = 'Run';
    runButton.addEventListener('click', () => this.runCode());
    this.controlPanel.appendChild(runButton);
    
    // Add clear button
    const clearButton = document.createElement('button');
    clearButton.className = 'bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded';
    clearButton.textContent = 'Clear Output';
    clearButton.addEventListener('click', () => this.store.setState({ output: [] }));
    this.controlPanel.appendChild(clearButton);
  }
  
  private async runCode(): Promise<void> {
    const state = this.store.getState();
    this.store.setState({ isExecuting: true, output: [] });
    
    try {
      // Transpile the code using the core package
      const transpileResult = transpileSrc(state.sourceCode);
      
      if (!transpileResult.success) {
        // Handle transpilation errors
        const errorEntry: OutputEntry = {
          type: 'error',
          content: `${transpileResult.error.message} ${
            transpileResult.error.line 
              ? `(Line ${transpileResult.error.line}, Column ${transpileResult.error.column || 0})` 
              : ''
          }`,
          timestamp: Date.now()
        };
        
        this.store.setState({ 
          isExecuting: false,
          output: [errorEntry]
        });
        return;
      }
      
      // Execute the transpiled code
      const jsCode = transpileResult.result.code;
      let output: OutputEntry[] = [];
      
      // Capture console.log output
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        output.push({
          type: 'log',
          content: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '),
          timestamp: Date.now()
        });
      };
      
      try {
        // Execute the transpiled code
        const result = new Function(jsCode)();
        
        if (result !== undefined) {
          output.push({
            type: 'result',
            content: typeof result === 'object' 
              ? JSON.stringify(result, null, 2) 
              : String(result),
            timestamp: Date.now()
          });
        }
        
        this.store.setState({ 
          isExecuting: false,
          output
        });
      } catch (execError) {
        output.push({
          type: 'error',
          content: `Runtime error: ${execError.message}`,
          timestamp: Date.now()
        });
        
        this.store.setState({ 
          isExecuting: false,
          output
        });
      } finally {
        // Restore console.log
        console.log = originalConsoleLog;
      }
      
    } catch (error) {
      // Handle unexpected errors
      this.store.setState({ 
        isExecuting: false,
        output: [{
          type: 'error',
          content: `Unexpected error: ${error.message}`,
          timestamp: Date.now()
        }]
      });
    }
  }
  
  private render(state: PlaygroundState): void {
    // Update run button state
    const runButton = this.controlPanel.querySelector('button');
    if (runButton) {
      runButton.disabled = state.isExecuting;
      runButton.textContent = state.isExecuting ? 'Running...' : 'Run';
    }
    
    // Update result panel
    this.renderResults(state.output);
  }
  
  private renderResults(output: OutputEntry[]): void {
    this.resultPanel.innerHTML = '';
    
    if (output.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'text-gray-400 italic';
      placeholder.textContent = 'Run your code to see results';
      this.resultPanel.appendChild(placeholder);
      return;
    }
    
    output.forEach(entry => {
      const entryElement = document.createElement('div');
      entryElement.className = 'mb-2 pb-2 border-b border-gray-200';
      
      // Apply styling based on entry type
      let typeClass = '';
      let prefix = '';
      
      switch (entry.type) {
        case 'result':
          typeClass = 'text-blue-600';
          prefix = '⟹ ';
          break;
        case 'error':
          typeClass = 'text-red-600';
          prefix = '⚠️ ';
          break;
        case 'log':
          typeClass = 'text-gray-800';
          prefix = '> ';
          break;
      }
      
      entryElement.className += ` ${typeClass}`;
      
      // Create content element
      const content = document.createElement('pre');
      content.className = 'whitespace-pre-wrap';
      content.textContent = `${prefix}${entry.content}`;
      entryElement.appendChild(content);
      
      this.resultPanel.appendChild(entryElement);
    });
  }
}
```

## Running Locally

1. Install dependencies:
   ```
   cd packages/playground
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Key Implementation Tasks

1. **Monaco Editor Integration**
   - Set up Monaco Editor with custom language definition
   - Import syntax highlighting rules from VS Code extension
   - Configure editor options and theme

2. **Core Package Integration**
   - Import parser and transpiler from @turacode/core
   - Set up code execution environment
   - Handle errors and output capture

3. **UI Components**
   - Implement responsive layout with Tailwind CSS
   - Build the control panel with Run button
   - Create result panel with proper formatting

4. **Error Handling**
   - Show syntax error messages in the output panel
   - Display runtime errors with proper formatting
   - Prevent playground crashes from bad code

## Testing

Test the playground with various code examples, including:
- Valid code with different language features
- Code with syntax errors
- Code with runtime errors
- Long-running or complex code

## Resources

- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [Vite Plugin for Monaco](https://github.com/vdesjs/vite-plugin-monaco-editor)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

#### Types (types.ts)

```typescript
export interface PlaygroundState {
  sourceCode: string;
  output: OutputEntry[];
  isExecuting: boolean;
  editorSettings: EditorSettings;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'light' | 'dark';
}

export interface OutputEntry {
  type: 'result' | 'error' | 'log';
  content: string;
  timestamp: number;
}

export interface TranspileResult {
  success: boolean;
  result?: {
    code: string;
    ast: any;
  };
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}
```