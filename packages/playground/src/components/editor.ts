/**
 * Editor Component
 * 
 * This component provides a Monaco editor instance for editing TuraCode.
 * It handles editor creation, state integration, and event handling.
 */

import * as monaco from 'monaco-editor';
import { createMonacoEditor, updateEditorOptions, disposeEditor } from '../utils/monaco-config';
import { PlaygroundStore, playgroundActions } from '../utils/store';
import { EditorSettings } from '../types';

/**
 * Editor component options
 */
export interface EditorComponentOptions {
  readOnly?: boolean;
  autoFocus?: boolean;
}

/**
 * Editor component class
 */
export class Editor {
  private container: HTMLElement;
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private store: PlaygroundStore;
  private unsubscribe: (() => void) | null = null;
  private options: EditorComponentOptions;

  /**
   * Creates a new Editor component
   * @param container The container element for the editor
   * @param store The playground store instance
   * @param options Editor component options
   */
  constructor(
    container: HTMLElement,
    store: PlaygroundStore,
    options: EditorComponentOptions = {}
  ) {
    this.container = container;
    this.store = store;
    this.options = options;

    this.initialize();
  }

  /**
   * Initializes the editor
   */
  private initialize(): void {
    // Get initial state from store
    const state = this.store.getState();
    const { sourceCode, editorSettings } = state;

    // Create editor instance
    this.editor = createMonacoEditor(this.container, sourceCode, {
      readOnly: this.options.readOnly,
      fontSize: editorSettings.fontSize,
      tabSize: editorSettings.tabSize,
      theme: editorSettings.theme,
      automaticLayout: true,
      minimap: false
    });

    // Set auto focus if needed
    if (this.options.autoFocus) {
      this.editor.focus();
    }

    // Add change listener to update store
    this.editor.onDidChangeModelContent(() => {
      if (this.editor) {
        const sourceCode = this.editor.getValue();
        playgroundActions.setSourceCode(this.store, sourceCode);
      }
    });

    // Subscribe to store changes to update editor settings
    this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));
  }

  /**
   * Handles state changes from the store
   * @param state New state from the store
   */
  private handleStateChange(state: any): void {
    if (!this.editor) return;

    // Update editor settings if they've changed
    const editorSettings = state.editorSettings as EditorSettings;
    updateEditorOptions(this.editor, {
      fontSize: editorSettings.fontSize,
      tabSize: editorSettings.tabSize,
      theme: editorSettings.theme
    });

    // Update read-only state based on execution status
    if (this.options.readOnly !== true) {
      this.editor.updateOptions({ readOnly: state.isExecuting });
    }
  }

  /**
   * Gets the current editor value
   * @returns The current editor content
   */
  getValue(): string {
    return this.editor ? this.editor.getValue() : '';
  }

  /**
   * Sets the editor value
   * @param value New content for the editor
   */
  setValue(value: string): void {
    if (this.editor) {
      this.editor.setValue(value);
    }
  }

  /**
   * Disposes the editor component and cleans up resources
   */
  dispose(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    if (this.editor) {
      disposeEditor(this.editor);
      this.editor = null;
    }
  }
}

/**
 * Creates and mounts an Editor component to the given container
 * @param container The container element for the editor
 * @param store The playground store instance
 * @param options Editor component options
 * @returns The Editor component instance
 */
export function createEditor(
  container: HTMLElement,
  store: PlaygroundStore,
  options: EditorComponentOptions = {}
): Editor {
  return new Editor(container, store, options);
}

export default createEditor;
