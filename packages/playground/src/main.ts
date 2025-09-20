/**
 * Main Entry Point for TuraCode Playground
 * 
 * This file initializes the TuraCode Playground and mounts it to the DOM.
 * The playground provides an interactive environment for writing and
 * executing TuraCode programs directly in the browser.
 * 
 * Key features:
 * - Monaco editor with syntax highlighting for TuraCode
 * - Execution of transpiled code in the browser
 * - Example code selector for learning different language features
 * - Responsive design for various screen sizes
 */

import './styles.css';
import { createPlayground } from './components/playground';
import { createPlaygroundStore } from './utils/store';

/**
 * Initialize the playground when the DOM is ready
 * 
 * This function:
 * 1. Finds the container element in the DOM
 * 2. Creates a new playground store for state management
 * 3. Creates and mounts the playground component
 * 4. Exposes the playground instance in development mode for debugging
 */
function initPlayground() {
  // Find the container element
  const container = document.getElementById('app');
  
  if (!container) {
    console.error('Playground container element not found. Make sure there is an element with id="app" in the HTML.');
    return;
  }
  
  // Create store with initial state
  const store = createPlaygroundStore();
  
  // Create and mount the playground
  const playground = createPlayground(container, store, {
    showBranding: true,
    onStatusChange: (status) => {
      // Optional status change handling
      console.log('Playground status:', status);
    }
  });
  
  // For debugging, expose the playground instance
  if (process.env.NODE_ENV === 'development') {
    (window as any).playground = playground;
  }
  
  // Log initialization complete
  console.log('TuraCode Playground initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlayground);
} else {
  initPlayground();
}