/**
 * Main Playground Component
 * 
 * This component integrates all other components (Editor, ControlPanel, ResultPanel)
 * and handles the core transpilation and execution logic.
 */

import { PlaygroundStore, playgroundActions } from '../utils/store';
import { createEditor, Editor } from './editor';
import { createControlPanel, ControlPanel } from './controlPanel';
import { createResultPanel, ResultPanel } from './resultPanel';
import { transpile } from '../utils/transpiler';
import { executeCode } from '../utils/executor';
import { loadExample } from '../utils/examples';
import { OutputEntry } from '../types';

/**
 * Playground component options
 */
export interface PlaygroundOptions {
  initialCode?: string;
  showBranding?: boolean;
  onStatusChange?: (status: { isExecuting: boolean }) => void;
}

/**
 * Playground component class
 */
export class Playground {
  private container: HTMLElement;
  private store: PlaygroundStore;
  private options: PlaygroundOptions;
  
  private editorContainer: HTMLElement | null = null;
  private controlContainer: HTMLElement | null = null;
  private resultContainer: HTMLElement | null = null;
  
  private editor: Editor | null = null;
  private controlPanel: ControlPanel | null = null;
  private resultPanel: ResultPanel | null = null;
  
  private unsubscribe: (() => void) | null = null;

  /**
   * Creates a new Playground component
   * @param container The container element for the playground
   * @param storeOrOptions Store instance or playground options
   * @param options Playground options (if first argument is a store)
   */
  constructor(
    container: HTMLElement,
    storeOrOptions: PlaygroundStore | PlaygroundOptions = {},
    options: PlaygroundOptions = {}
  ) {
    this.container = container;
    
    // Determine if first argument is a store or options
    if (storeOrOptions instanceof PlaygroundStore) {
      this.store = storeOrOptions;
      this.options = options;
    } else {
      this.store = new PlaygroundStore();
      this.options = storeOrOptions;
    }
    
    // Set initial code if provided
    if (this.options.initialCode) {
      playgroundActions.setSourceCode(this.store, this.options.initialCode);
    }
    
    this.initialize();
  }

  /**
   * Initializes the playground
   */
  private initialize(): void {
    // Clear container
    this.container.innerHTML = '';
    this.container.classList.add('playground-container');
    
    // Create header if branding is enabled
    if (this.options.showBranding !== false) {
      const header = document.createElement('header');
      header.classList.add('mb-4');
      
      const title = document.createElement('h1');
      title.textContent = 'TuraCode Playground';
      title.classList.add('text-xl', 'md:text-2xl', 'font-bold', 'text-primary', 'playground-title');
      
      header.appendChild(title);
      this.container.appendChild(header);
    }
    
    // Create main content container
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('flex', 'flex-col', 'lg:flex-row', 'gap-4', 'h-full', 'playground-layout');
    
    // Create left panel (editor)
    const leftPanel = document.createElement('div');
    leftPanel.classList.add('flex-grow', 'lg:w-3/5', 'flex', 'flex-col', 'editor-section');
    
    // Create editor container
    this.editorContainer = document.createElement('div');
    this.editorContainer.classList.add('editor-container', 'flex-grow');
    leftPanel.appendChild(this.editorContainer);
    
    // Create control container
    this.controlContainer = document.createElement('div');
    leftPanel.appendChild(this.controlContainer);
    
    // Create right panel (results)
    const rightPanel = document.createElement('div');
    rightPanel.classList.add('lg:w-2/5', 'h-64', 'lg:h-auto', 'result-section');
    
    // Create result container
    this.resultContainer = document.createElement('div');
    this.resultContainer.classList.add('h-full');
    rightPanel.appendChild(this.resultContainer);
    
    // Add panels to main container
    mainContainer.appendChild(leftPanel);
    mainContainer.appendChild(rightPanel);
    
    // Add main container to playground
    this.container.appendChild(mainContainer);
    
    // Initialize components
    this.initializeComponents();
    
    // Subscribe to store changes
    this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));
  }

  /**
   * Initializes the child components
   */
  private initializeComponents(): void {
    if (!this.editorContainer || !this.controlContainer || !this.resultContainer) {
      throw new Error('Component containers not initialized');
    }
    
    // Create editor
    this.editor = createEditor(this.editorContainer, this.store, {
      autoFocus: true
    });
    
    // Create control panel
    this.controlPanel = createControlPanel(this.controlContainer, this.store, {
      onRun: this.handleRun.bind(this),
      onClear: this.handleClear.bind(this),
      onExampleLoad: this.handleExampleLoad.bind(this)
    });
    
    // Create result panel
    this.resultPanel = createResultPanel(this.resultContainer, this.store);
  }

  /**
   * Handles state changes from the store
   * @param state New state from the store
   */
  private handleStateChange(state: any): void {
    // Call onStatusChange if provided
    if (this.options.onStatusChange) {
      this.options.onStatusChange({
        isExecuting: state.isExecuting
      });
    }
  }

  /**
   * Handles the Run button click
   */
  private handleRun(): void {
    // Get source code from store
    const { sourceCode } = this.store.getState();
    
    // Start execution
    playgroundActions.startExecution(this.store);
    playgroundActions.clearOutput(this.store);
    
    // Transpile the code
    const transpilationResult = transpile(sourceCode);
    
    // Handle transpilation failure
    if (!transpilationResult.success) {
      let errorMessage = `Transpilation Error: ${transpilationResult.error?.message}`;
      
      // Add line and column information if available
      if (transpilationResult.error?.line || transpilationResult.error?.column) {
        const lineInfo = transpilationResult.error.line ? `line ${transpilationResult.error.line}` : '';
        const columnInfo = transpilationResult.error.column ? `column ${transpilationResult.error.column}` : '';
        const locationInfo = [lineInfo, columnInfo].filter(Boolean).join(', ');
        
        if (locationInfo) {
          errorMessage = `Transpilation Error at ${locationInfo}: ${transpilationResult.error?.message}`;
        }
      }
      
      const errorEntry: OutputEntry = {
        type: 'error',
        content: errorMessage,
        timestamp: Date.now()
      };
      playgroundActions.addOutput(this.store, errorEntry);
      playgroundActions.finishExecution(this.store, this.store.getState().output);
      return;
    }
    
    // Execute the transpiled code
    const executionResult = executeCode(transpilationResult.code!);
    
    // Create output entries from execution result
    const outputEntries: OutputEntry[] = [
      ...this.store.getState().output,
      // Add each output line as a log entry
      ...executionResult.output.map(line => ({
        type: 'log' as const,
        content: line,
        timestamp: Date.now()
      })),
    ];
    
    // Add execution errors if any
    if (executionResult.errors && executionResult.errors.length > 0) {
      executionResult.errors.forEach(error => {
        // Format the error message
        let errorContent = error.message || 'Unknown error';
        
        // Include stack trace but format it for readability
        if (error.stack) {
          // Extract just the first few lines of the stack for better readability
          const stackLines = error.stack.split('\n');
          const relevantStack = stackLines.slice(0, 3).join('\n');
          errorContent += `\n\nStack trace:\n${relevantStack}`;
          
          if (stackLines.length > 3) {
            errorContent += '\n...';
          }
        }
        
        // Try to extract line information from error or stack
        const lineMatch = (error.stack || error.message || '').match(/line\s+(\d+)/i);
        if (lineMatch) {
          errorContent = `Runtime Error at line ${lineMatch[1]}: ${errorContent}`;
        } else {
          errorContent = `Runtime Error: ${errorContent}`;
        }
        
        outputEntries.push({
          type: 'error' as const,
          content: errorContent,
          timestamp: Date.now()
        });
      });
    }
    
    // Update store with results
    playgroundActions.finishExecution(this.store, outputEntries);
  }

  /**
   * Handles the Clear button click
   */
  private handleClear(): void {
    playgroundActions.clearOutput(this.store);
  }

  /**
   * Handles example selection
   * @param exampleName The name of the selected example
   */
  private async handleExampleLoad(exampleName: string): Promise<void> {
    try {
      // Load the example file
      const exampleCode = await loadExample(exampleName);
      
      // Update the editor
      playgroundActions.setSourceCode(this.store, exampleCode);
      
      if (this.editor) {
        this.editor.setValue(exampleCode);
      }
      
      // Add a log entry about the loaded example
      const logEntry: OutputEntry = {
        type: 'log',
        content: `Loaded example: ${exampleName}.tc`,
        timestamp: Date.now()
      };
      playgroundActions.clearOutput(this.store);
      playgroundActions.addOutput(this.store, logEntry);
    } catch (error) {
      // Log error if example loading fails
      const errorEntry: OutputEntry = {
        type: 'error',
        content: `Failed to load example: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
      playgroundActions.addOutput(this.store, errorEntry);
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
   * Disposes the playground component and cleans up resources
   */
  dispose(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
    
    if (this.controlPanel) {
      this.controlPanel.dispose();
      this.controlPanel = null;
    }
    
    if (this.resultPanel) {
      this.resultPanel.dispose();
      this.resultPanel = null;
    }
    
    // Clear container
    this.container.innerHTML = '';
  }
}

/**
 * Creates and mounts a Playground component to the given container
 * @param container The container element for the playground
 * @param storeOrOptions Store instance or playground options
 * @param options Playground options (if first argument is a store)
 * @returns The Playground component instance
 */
export function createPlayground(
  container: HTMLElement,
  storeOrOptions: PlaygroundStore | PlaygroundOptions = {},
  options: PlaygroundOptions = {}
): Playground {
  return new Playground(container, storeOrOptions, options);
}

export default createPlayground;
