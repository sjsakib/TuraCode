/**
 * PlaygroundStore
 * 
 * A custom state management solution with a pub/sub pattern for the TuraCode playground.
 * Manages the state of the playground and notifies subscribers when the state changes.
 */

import { PlaygroundState, EditorSettings, OutputEntry } from '../types';

/**
 * Default editor settings
 */
const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  theme: 'light',
};

/**
 * Default initial state for the playground
 */
const DEFAULT_INITIAL_STATE: PlaygroundState = {
  sourceCode: '// Welcome to TuraCode Playground\n// Write your code here and click Run to execute it\n\nlet x = 5\nlet y = 10\ndakao(x + y)\n',
  isExecuting: false,
  output: [],
  editorSettings: DEFAULT_EDITOR_SETTINGS,
};

export type StateUpdater<T> = (state: T) => Partial<T>;

/**
 * PlaygroundStore class for managing playground state with pub/sub pattern
 */
export class PlaygroundStore {
  private state: PlaygroundState;
  private listeners: Array<(state: PlaygroundState) => void> = [];
  
  /**
   * Creates a new PlaygroundStore with the given initial state
   * @param initialState Initial state for the playground
   */
  constructor(initialState: Partial<PlaygroundState> = {}) {
    this.state = { ...DEFAULT_INITIAL_STATE, ...initialState };
  }
  
  /**
   * Gets the current state
   * @returns A copy of the current state
   */
  getState(): PlaygroundState {
    return { ...this.state };
  }
  
  /**
   * Updates the state with the given partial state
   * @param partialState Partial state to update
   */
  setState(partialState: Partial<PlaygroundState>): void {
    this.state = { ...this.state, ...partialState };
    this.notifyListeners();
  }
  
  /**
   * Updates the state using a function that receives the current state
   * @param updater Function that receives current state and returns partial state
   */
  updateState(updater: StateUpdater<PlaygroundState>): void {
    const partialState = updater(this.getState());
    this.setState(partialState);
  }
  
  /**
   * Subscribes a listener to state changes
   * @param listener Function to call when state changes
   * @returns Function to unsubscribe the listener
   */
  subscribe(listener: (state: PlaygroundState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Notifies all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

/**
 * Playground actions for updating the state
 */
export const playgroundActions = {
  /**
   * Sets the source code
   * @param store PlaygroundStore instance
   * @param sourceCode New source code
   */
  setSourceCode: (store: PlaygroundStore, sourceCode: string) => {
    store.setState({ sourceCode });
  },
  
  /**
   * Starts execution
   * @param store PlaygroundStore instance
   */
  startExecution: (store: PlaygroundStore) => {
    store.setState({ isExecuting: true });
  },
  
  /**
   * Finishes execution with the given output
   * @param store PlaygroundStore instance
   * @param output Execution output
   */
  finishExecution: (store: PlaygroundStore, output: OutputEntry[]) => {
    store.setState({ isExecuting: false, output });
  },
  
  /**
   * Adds an output entry
   * @param store PlaygroundStore instance
   * @param entry Output entry to add
   */
  addOutput: (store: PlaygroundStore, entry: OutputEntry) => {
    store.updateState(state => ({
      output: [...state.output, entry]
    }));
  },
  
  /**
   * Clears the output
   * @param store PlaygroundStore instance
   */
  clearOutput: (store: PlaygroundStore) => {
    store.setState({ output: [] });
  },
  
  /**
   * Updates editor settings
   * @param store PlaygroundStore instance
   * @param settings Partial editor settings to update
   */
  updateEditorSettings: (store: PlaygroundStore, settings: Partial<EditorSettings>) => {
    store.setState({ 
      editorSettings: { ...store.getState().editorSettings, ...settings } 
    });
  }
};

/**
 * Creates a new instance of the PlaygroundStore
 * @param initialState Optional initial state
 * @returns PlaygroundStore instance
 */
export function createPlaygroundStore(initialState: Partial<PlaygroundState> = {}): PlaygroundStore {
  return new PlaygroundStore(initialState);
}

export default createPlaygroundStore;
