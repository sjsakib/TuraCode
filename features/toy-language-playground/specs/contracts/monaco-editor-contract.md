# Component Contract: Monaco Editor Integration

## Overview

This contract defines how the playground will integrate with the Monaco Editor for code editing and syntax highlighting.

## Import Contract

```typescript
// Import Monaco Editor from CDN or package
import * as monaco from 'monaco-editor';
// Or if using the Vite plugin
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
```

## Editor Initialization

```typescript
// Initialize Monaco Editor
function initializeMonacoEditor(
  containerElement: HTMLElement,
  initialValue: string = '',
  options: monaco.editor.IStandaloneEditorConstructionOptions = {}
): monaco.editor.IStandaloneCodeEditor {
  
  const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    value: initialValue,
    language: 'tc', // TuraCode language ID
    theme: 'turaCodeTheme', // Custom theme
    automaticLayout: true,
    minimap: {
      enabled: false
    },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    tabSize: 2,
    renderWhitespace: 'none',
    wordWrap: 'on'
  };
  
  return monaco.editor.create(
    containerElement, 
    { ...defaultOptions, ...options }
  );
}
```

## Custom Language Registration

```typescript
// Register the custom TuraCode language
function registerTuraCodeLanguage(): void {
  monaco.languages.register({ id: 'tc', aliases: ['TuraCode'] });
  
  monaco.languages.setMonarchTokensProvider('tc', {
    // Token definitions based on VS Code extension grammar
    // This will be replaced with actual grammar rules
    tokenizer: {
      root: [
        // Keywords
        [/\b(let|const|if|else|while|for|function|return|true|false)\b/, 'keyword'],
        // Strings
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        // Numbers
        [/\b\d+\b/, 'number'],
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        // Other syntax
        [/[{}()\[\]]/, 'delimiter.bracket'],
        [/[;,.]/, 'delimiter'],
        [/[<>=!&|+\-*/%^~]/, 'operator'],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ]
    }
  });
  
  // Define a custom theme with appropriate colors
  monaco.editor.defineTheme('turaCodeTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'string', foreground: 'A31515' },
      { token: 'comment', foreground: '008000' },
      { token: 'number', foreground: '098658' },
      { token: 'operator', foreground: '000000' }
    ],
    colors: {}
  });
}
```

## VS Code Grammar Integration

```typescript
// Function to convert VS Code TextMate grammar to Monaco's Monarch format
function convertVSCodeGrammarToMonarch(
  grammarJson: any
): monaco.languages.IMonarchLanguage {
  // Implementation will depend on the specific grammar format
  // This is a placeholder for the conversion logic
  return {
    tokenizer: {
      // Converted rules will go here
      root: []
    }
  };
}
```

## Editor Event Handling

```typescript
// Handle editor content changes
function handleEditorContentChange(
  editor: monaco.editor.IStandaloneCodeEditor,
  callback: (value: string) => void
): monaco.IDisposable {
  return editor.onDidChangeModelContent(() => {
    const value = editor.getValue();
    callback(value);
  });
}

// Set editor content programmatically
function setEditorContent(
  editor: monaco.editor.IStandaloneCodeEditor,
  value: string
): void {
  editor.setValue(value);
}
```

## Editor Disposal

```typescript
// Properly dispose of the editor when component unmounts
function disposeEditor(
  editor: monaco.editor.IStandaloneCodeEditor
): void {
  if (editor) {
    editor.dispose();
  }
}
```

## Error Highlighting

```typescript
// Note: Error highlighting will not be supported initially
// This functionality may be added in future iterations

// Placeholder for future error highlighting implementation
function highlightErrors(
  editor: monaco.editor.IStandaloneCodeEditor,
  errors: Array<{
    message: string;
    line: number;
    column: number;
  }>
): void {
  // Error highlighting not implemented
  console.log('Error highlighting not supported yet');
}

// Placeholder for future error clearing implementation
function clearErrorHighlights(
  editor: monaco.editor.IStandaloneCodeEditor
): void {
  // Error highlighting not implemented
}
```

## Examples

```typescript
// Example: Initialize editor in a vanilla JS component
class CodeEditor {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private container: HTMLElement;
  
  constructor(container: HTMLElement, initialCode: string, onChange: (code: string) => void) {
    this.container = container;
    
    // Register language once
    registerTuraCodeLanguage();
    
    // Create editor
    this.editor = initializeMonacoEditor(
      container,
      initialCode
    );
    
    // Set up change handler
    const disposable = handleEditorContentChange(this.editor, onChange);
    
    // Cleanup method to call when component is destroyed
    this.dispose = () => {
      disposable.dispose();
      disposeEditor(this.editor);
    };
  }
  
  dispose(): void {
    // Will be defined in constructor
  }
  
  setValue(code: string): void {
    setEditorContent(this.editor, code);
  }
  
  getValue(): string {
    return this.editor.getValue();
  }
}
```