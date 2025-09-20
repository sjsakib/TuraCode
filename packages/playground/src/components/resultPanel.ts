/**
 * Result Panel Component
 * 
 * This component displays the execution output from running TuraCode.
 * It formats different types of output (logs, errors, results).
 */

import { PlaygroundStore } from '../utils/store';
import { OutputEntry } from '../types';

/**
 * Result panel component options
 */
export interface ResultPanelOptions {
  maxEntries?: number;
}

/**
 * Result panel component class
 */
export class ResultPanel {
  private container: HTMLElement;
  private store: PlaygroundStore;
  private options: ResultPanelOptions;
  private outputContainer: HTMLElement | null = null;
  private unsubscribe: (() => void) | null = null;

  /**
   * Creates a new ResultPanel component
   * @param container The container element for the result panel
   * @param store The playground store instance
   * @param options Result panel options
   */
  constructor(
    container: HTMLElement,
    store: PlaygroundStore,
    options: ResultPanelOptions = {}
  ) {
    this.container = container;
    this.store = store;
    this.options = {
      maxEntries: 100,
      ...options
    };

    this.initialize();
  }

  /**
   * Initializes the result panel
   */
  private initialize(): void {
    // Set up container
    this.container.classList.add('result-panel');
    
    // Create heading
    const heading = document.createElement('div');
    heading.classList.add('font-bold', 'text-gray-700', 'mb-2');
    heading.textContent = 'Output';
    this.container.appendChild(heading);
    
    // Create output container
    this.outputContainer = document.createElement('div');
    this.outputContainer.classList.add('output-container');
    this.container.appendChild(this.outputContainer);
    
    // Subscribe to store changes
    this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));
    
    // Initial render
    this.renderOutput(this.store.getState().output);
  }

  /**
   * Handles state changes from the store
   * @param state New state from the store
   */
  private handleStateChange(state: any): void {
    this.renderOutput(state.output);
  }

  /**
   * Renders the output entries
   * @param entries Output entries to render
   */
  private renderOutput(entries: OutputEntry[]): void {
    if (!this.outputContainer) return;
    
    // Clear existing output
    this.outputContainer.innerHTML = '';
    
    // If no entries, show placeholder
    if (entries.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.classList.add('text-gray-500', 'italic');
      placeholder.textContent = 'No output to display. Run your code to see results here.';
      this.outputContainer.appendChild(placeholder);
      return;
    }
    
    // Limit entries if needed
    const displayEntries = this.options.maxEntries && entries.length > this.options.maxEntries
      ? entries.slice(-this.options.maxEntries)
      : entries;
    
    // Render each entry
    displayEntries.forEach(entry => {
      this.outputContainer?.appendChild(this.createOutputEntryElement(entry));
    });
    
    // Scroll to bottom
    this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
  }

  /**
   * Creates an element for an output entry
   * @param entry The output entry to create an element for
   * @returns The created element
   */
  private createOutputEntryElement(entry: OutputEntry): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('output-entry');
    
    // Apply type-specific styling
    switch (entry.type) {
      case 'log':
        element.classList.add('output-log');
        break;
      case 'error':
        element.classList.add('output-error');
        break;
      case 'result':
        element.classList.add('output-result', 'border-green-500');
        break;
    }
    
    // Format content based on type
    if (entry.type === 'error') {
      const errorHeader = document.createElement('div');
      errorHeader.classList.add('font-bold');
      errorHeader.textContent = 'Error:';
      element.appendChild(errorHeader);
      
      // Parse the error message to extract line and column information
      const lineMatch = entry.content.match(/line\s+(\d+)/i);
      const columnMatch = entry.content.match(/column\s+(\d+)/i);
      
      if (lineMatch || columnMatch) {
        const locationInfo = document.createElement('div');
        locationInfo.classList.add('text-sm', 'text-red-600', 'mb-1');
        
        let locationText = 'at ';
        if (lineMatch) {
          locationText += `line ${lineMatch[1]}`;
          if (columnMatch) {
            locationText += `, column ${columnMatch[1]}`;
          }
        } else if (columnMatch) {
          locationText += `column ${columnMatch[1]}`;
        }
        
        locationInfo.textContent = locationText;
        element.appendChild(locationInfo);
      }
    }
    
    const content = document.createElement('pre');
    content.classList.add('whitespace-pre-wrap', 'break-words');
    content.textContent = entry.content;
    element.appendChild(content);
    
    // Add timestamp
    if (entry.timestamp) {
      const timestamp = document.createElement('div');
      timestamp.classList.add('text-xs', 'text-gray-500', 'mt-1');
      
      const date = new Date(entry.timestamp);
      timestamp.textContent = date.toLocaleTimeString();
      
      element.appendChild(timestamp);
    }
    
    return element;
  }

  /**
   * Clears all output from the panel
   */
  clear(): void {
    if (this.outputContainer) {
      this.outputContainer.innerHTML = '';
    }
  }

  /**
   * Disposes the result panel component and cleans up resources
   */
  dispose(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    
    // Clear container
    this.container.innerHTML = '';
  }
}

/**
 * Creates and mounts a ResultPanel component to the given container
 * @param container The container element for the result panel
 * @param store The playground store instance
 * @param options Result panel options
 * @returns The ResultPanel component instance
 */
export function createResultPanel(
  container: HTMLElement,
  store: PlaygroundStore,
  options: ResultPanelOptions = {}
): ResultPanel {
  return new ResultPanel(container, store, options);
}

export default createResultPanel;
