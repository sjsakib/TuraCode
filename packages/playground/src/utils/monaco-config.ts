/**
 * Monaco Editor Configuration
 * 
 * This file contains utility functions for initializing and configuring the Monaco editor
 * with syntax highlighting for the TuraCode language.
 */

import * as monaco from 'monaco-editor';

/**
 * Language ID for TuraCode
 */
export const LANGUAGE_ID = 'tc';

/**
 * Syntax highlighting configuration for TuraCode
 */
const monarchLanguageConfig: monaco.languages.IMonarchLanguage = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  
  keywords: [
    'ata', 'hola', 'dakao', 'godi', 'na', 'holae', 'calay', 'gao'
  ],
  
  operators: [
    '=', '>', '<', '!', '==', '<=', '>=', '!=',
    '+', '-', '*', '/', '++', '--', '+=', '-=', '*=', '/='
  ],
  
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],
      
      // whitespace
      { include: '@whitespace' },
      
      // numbers
      [/\d+/, 'number'],
      
      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single']
    ],
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],
    ],
    
    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],
    
    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],
    
    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop']
    ],
  }
};

/**
 * Define custom theme for TuraCode
 */
const defineTheme = () => {
  monaco.editor.defineTheme('turaCodeTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'string', foreground: 'A31515' },
      { token: 'comment', foreground: '008000' },
      { token: 'number', foreground: '098658' },
      { token: 'operator', foreground: '000000' },
      { token: 'identifier', foreground: '001080' }
    ],
    colors: {
      'editor.foreground': '#000000',
      'editor.background': '#FFFFFF',
      'editorLineNumber.foreground': '#999999',
      'editor.lineHighlightBackground': '#F0F0F0',
      'editorCursor.foreground': '#333333',
      'editor.selectionBackground': '#ADD6FF',
    }
  });
  
  // Dark theme option
  monaco.editor.defineTheme('turaCodeThemeDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'comment', foreground: '6A9955' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'identifier', foreground: '9CDCFE' }
    ],
    colors: {
      'editor.foreground': '#D4D4D4',
      'editor.background': '#1E1E1E',
      'editorLineNumber.foreground': '#858585',
      'editor.lineHighlightBackground': '#282828',
      'editorCursor.foreground': '#AEAFAD',
      'editor.selectionBackground': '#264F78',
    }
  });
};

/**
 * Registers the TuraCode language with Monaco
 */
export const registerTuraCodeLanguage = (): void => {
  // Register language
  monaco.languages.register({ id: LANGUAGE_ID, aliases: ['TuraCode', 'turacode'] });
  
  // Set syntax highlighting
  monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, monarchLanguageConfig);
  
  // Define custom theme
  defineTheme();
};

/**
 * Editor configuration options
 */
export interface EditorOptions {
  readOnly?: boolean;
  fontSize?: number;
  tabSize?: number;
  theme?: 'light' | 'dark';
  automaticLayout?: boolean;
  minimap?: boolean;
}

/**
 * Default editor options
 */
const defaultEditorOptions: Required<EditorOptions> = {
  readOnly: false,
  fontSize: 14,
  tabSize: 2,
  theme: 'light',
  automaticLayout: true,
  minimap: false
};

/**
 * Creates and initializes a Monaco editor instance
 * @param container The container element for the editor
 * @param initialValue Initial content for the editor
 * @param options Editor configuration options
 * @returns The Monaco editor instance
 */
export const createMonacoEditor = (
  container: HTMLElement,
  initialValue: string = '',
  options: EditorOptions = {}
): monaco.editor.IStandaloneCodeEditor => {
  // Ensure language is registered
  registerTuraCodeLanguage();
  
  // Merge options with defaults
  const mergedOptions = { ...defaultEditorOptions, ...options };
  
  // Create editor config
  const editorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
    value: initialValue,
    language: LANGUAGE_ID,
    theme: mergedOptions.theme === 'dark' ? 'turaCodeThemeDark' : 'turaCodeTheme',
    automaticLayout: mergedOptions.automaticLayout,
    readOnly: mergedOptions.readOnly,
    fontSize: mergedOptions.fontSize,
    tabSize: mergedOptions.tabSize,
    minimap: {
      enabled: mergedOptions.minimap
    },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    renderWhitespace: 'none',
    wordWrap: 'on',
    fontFamily: "'Fira Code', monospace"
  };
  
  // Create editor instance
  return monaco.editor.create(container, editorConfig);
};

/**
 * Updates editor options
 * @param editor Monaco editor instance
 * @param options Editor options to update
 */
export const updateEditorOptions = (
  editor: monaco.editor.IStandaloneCodeEditor,
  options: EditorOptions
): void => {
  const monacoOptions: monaco.editor.IEditorOptions = {};
  
  if (options.fontSize !== undefined) {
    monacoOptions.fontSize = options.fontSize;
  }
  
  if (options.tabSize !== undefined) {
    // Use editor.getModel()?.updateOptions to set tabSize
    const model = editor.getModel();
    if (model) {
      model.updateOptions({ tabSize: options.tabSize });
    }
  }
  
  if (options.theme !== undefined) {
    editor.updateOptions({
      theme: options.theme === 'dark' ? 'turaCodeThemeDark' : 'turaCodeTheme'
    });
  }
  
  if (options.readOnly !== undefined) {
    monacoOptions.readOnly = options.readOnly;
  }
  
  if (options.minimap !== undefined) {
    monacoOptions.minimap = {
      enabled: options.minimap
    };
  }
  
  editor.updateOptions(monacoOptions);
};

/**
 * Disposes a Monaco editor instance
 * @param editor Monaco editor instance to dispose
 */
export const disposeEditor = (editor: monaco.editor.IStandaloneCodeEditor): void => {
  if (editor) {
    editor.dispose();
  }
};

export default {
  createMonacoEditor,
  updateEditorOptions,
  disposeEditor,
  registerTuraCodeLanguage,
  LANGUAGE_ID
};
