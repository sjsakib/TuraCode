/**
 * Control Panel Component
 * 
 * This component provides the control buttons (Run, Clear) for the playground.
 */

import { PlaygroundStore, playgroundActions } from '../utils/store';

/**
 * Control panel component options
 */
export interface ControlPanelOptions {
  onRun?: () => void;
  onClear?: () => void;
  onExampleLoad?: (exampleName: string) => void;
}

/**
 * Example definition
 */
export interface Example {
  name: string;
  label: string;
}

/**
 * Predefined examples
 */
export const EXAMPLES: Example[] = [
  { name: 'basic', label: 'Basic Example' },
  { name: 'functions', label: 'Functions Example' },
  { name: 'errors', label: 'Error Handling' },
  { name: 'performance', label: 'Performance Test' }
];

/**
 * Control panel component class
 */
export class ControlPanel {
  private container: HTMLElement;
  private store: PlaygroundStore;
  private options: ControlPanelOptions;
  private runButton: HTMLButtonElement | null = null;
  private clearButton: HTMLButtonElement | null = null;
  private exampleSelect: HTMLSelectElement | null = null;
  private unsubscribe: (() => void) | null = null;

  /**
   * Creates a new ControlPanel component
   * @param container The container element for the control panel
   * @param store The playground store instance
   * @param options Control panel options
   */
  constructor(
    container: HTMLElement,
    store: PlaygroundStore,
    options: ControlPanelOptions = {}
  ) {
    this.container = container;
    this.store = store;
    this.options = options;

    this.initialize();
  }

  /**
   * Initializes the control panel
   */
  private initialize(): void {
    // Create the control panel elements
    this.container.classList.add('control-panel');
    
    // Create Run button
    this.runButton = document.createElement('button');
    this.runButton.textContent = 'Run';
    this.runButton.classList.add('btn', 'btn-primary');
    this.runButton.addEventListener('click', this.handleRunClick.bind(this));
    
    // Create example selector
    const exampleContainer = document.createElement('div');
    exampleContainer.classList.add('flex', 'items-center', 'ml-4');
    
    const exampleLabel = document.createElement('label');
    exampleLabel.textContent = 'Examples:';
    exampleLabel.classList.add('mr-2', 'text-sm');
    
    this.exampleSelect = document.createElement('select');
    this.exampleSelect.classList.add('border', 'rounded', 'px-2', 'py-1', 'text-sm');
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an example';
    this.exampleSelect.appendChild(defaultOption);
    
    // Add example options
    EXAMPLES.forEach(example => {
      const option = document.createElement('option');
      option.value = example.name;
      option.textContent = example.label;
      this.exampleSelect?.appendChild(option);
    });
    
    this.exampleSelect.addEventListener('change', this.handleExampleChange.bind(this));
    
    exampleContainer.appendChild(exampleLabel);
    exampleContainer.appendChild(this.exampleSelect);
    
    // Create Clear button
    this.clearButton = document.createElement('button');
    this.clearButton.textContent = 'Clear Output';
    this.clearButton.classList.add('btn', 'btn-secondary', 'ml-auto');
    this.clearButton.addEventListener('click', this.handleClearClick.bind(this));
    
    // Add buttons to container
    this.container.appendChild(this.runButton);
    this.container.appendChild(exampleContainer);
    this.container.appendChild(this.clearButton);
    
    // Subscribe to store changes
    this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));
    
    // Initial state update
    this.handleStateChange(this.store.getState());
  }

  /**
   * Handles state changes from the store
   * @param state New state from the store
   */
  private handleStateChange(state: any): void {
    if (this.runButton) {
      // Update run button state based on execution status
      this.runButton.disabled = state.isExecuting;
      this.runButton.textContent = state.isExecuting ? 'Running...' : 'Run';
    }
  }

  /**
   * Handles Run button click
   */
  private handleRunClick(): void {
    if (this.options.onRun) {
      this.options.onRun();
    }
  }

  /**
   * Handles Clear button click
   */
  private handleClearClick(): void {
    // Clear output in store
    playgroundActions.clearOutput(this.store);
    
    if (this.options.onClear) {
      this.options.onClear();
    }
  }

  /**
   * Handles Example selector change
   */
  private handleExampleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const exampleName = select.value;
    
    if (exampleName && this.options.onExampleLoad) {
      this.options.onExampleLoad(exampleName);
    }
  }

  /**
   * Disposes the control panel component and cleans up resources
   */
  dispose(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    
    if (this.runButton) {
      this.runButton.removeEventListener('click', this.handleRunClick.bind(this));
    }
    
    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClearClick.bind(this));
    }
    
    if (this.exampleSelect) {
      this.exampleSelect.removeEventListener('change', this.handleExampleChange.bind(this));
    }
    
    // Clear container
    this.container.innerHTML = '';
  }
}

/**
 * Creates and mounts a ControlPanel component to the given container
 * @param container The container element for the control panel
 * @param store The playground store instance
 * @param options Control panel options
 * @returns The ControlPanel component instance
 */
export function createControlPanel(
  container: HTMLElement,
  store: PlaygroundStore,
  options: ControlPanelOptions = {}
): ControlPanel {
  return new ControlPanel(container, store, options);
}

export default createControlPanel;
