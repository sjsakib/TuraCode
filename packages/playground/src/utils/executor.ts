/**
 * Code Execution Utility
 * 
 * This utility provides functions for executing transpiled JavaScript code
 * in a controlled environment, capturing console output and errors.
 */

import { ExecutionResult, ExecutionError } from '../types';

/**
 * Creates a secure function that can be used to evaluate code in a controlled context
 * @param code The JavaScript code to execute
 * @returns A function that executes the code when called
 */
function createExecutableFunction(code: string): Function {
  // Using Function constructor to create a function from the code
  // This is similar to eval but with better scope isolation
  try {
    return new Function(code);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create executable function: ${errorMessage}`);
  }
}

/**
 * Override console methods to capture output during execution
 * @returns Object with capturedOutput array and restore function
 */
function captureConsoleOutput() {
  const capturedOutput: string[] = [];
  
  // Store original console methods
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Override console methods to capture output
  console.log = (...args) => {
    capturedOutput.push(args.map(arg => String(arg)).join(' '));
    // Still call original for debugging
    originalLog.apply(console, args);
  };
  
  console.info = (...args) => {
    capturedOutput.push('[INFO] ' + args.map(arg => String(arg)).join(' '));
    originalInfo.apply(console, args);
  };
  
  console.warn = (...args) => {
    capturedOutput.push('[WARN] ' + args.map(arg => String(arg)).join(' '));
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    capturedOutput.push('[ERROR] ' + args.map(arg => String(arg)).join(' '));
    originalError.apply(console, args);
  };
  
  // Function to restore original console methods
  const restore = () => {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  };
  
  return { capturedOutput, restore };
}

/**
 * Executes the given JavaScript code and captures the output and errors
 * @param code The JavaScript code to execute
 * @returns ExecutionResult with output, errors, and execution time
 */
export function executeCode(code: string): ExecutionResult {
  // Setup console capturing
  const { capturedOutput, restore } = captureConsoleOutput();
  const errors: ExecutionError[] = [];
  
  // Create executable function
  let executableFn: Function;
  try {
    executableFn = createExecutableFunction(code);
  } catch (error) {
    restore();
    return {
      success: false,
      output: [],
      errors: [{
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        isFatal: true
      }],
      executionTime: 0
    };
  }
  
  // Execute the code and measure execution time
  const startTime = performance.now();
  let success = true;
  
  try {
    executableFn();
  } catch (error) {
    success = false;
    errors.push({
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      isFatal: true
    });
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  // Restore original console methods
  restore();
  
  return {
    success,
    output: capturedOutput,
    errors: errors.length > 0 ? errors : undefined,
    executionTime
  };
}

export default {
  executeCode
};
