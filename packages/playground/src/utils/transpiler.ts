/**
 * Transpiler Utility for TuraCode Playground
 * 
 * This utility provides a wrapper around the core package's transpileSrc function
 * to provide a more structured approach to handling transpilation results.
 * 
 * The main purposes of this wrapper are:
 * 1. Provide a consistent interface for transpilation results
 * 2. Handle errors in a structured way
 * 3. Extract line/column information from error messages when available
 * 4. Insulate the rest of the application from changes in the core transpiler
 */

import { transpileSrc } from '@turacode/core';
import { TranspilationResult } from '../types';

/**
 * Attempts to transpile TuraCode source code to JavaScript
 * 
 * @param sourceCode TuraCode source code to transpile
 * @returns TranspilationResult object with success status and either code or error
 * 
 * @example
 * // Successful transpilation
 * const result = transpile("let x = 5");
 * if (result.success) {
 *   console.log(result.code); // Access the transpiled JavaScript
 * }
 * 
 * @example
 * // Error handling
 * const result = transpile("let x = ;"); // Invalid syntax
 * if (!result.success && result.error) {
 *   console.error(
 *     `Error at line ${result.error.line}, column ${result.error.column}: ${result.error.message}`
 *   );
 * }
 */
export function transpile(sourceCode: string): TranspilationResult {
  try {
    // Call the core package's transpileSrc function
    const transpiledCode = transpileSrc(sourceCode);
    
    // Return successful result with transpiled code
    return {
      success: true,
      code: transpiledCode
    };
  } catch (error) {
    // Parse error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Try to extract line and column information from error message
    // Common formats: "Error at line X, column Y: message" or similar
    const lineMatch = errorMessage.match(/line\s+(\d+)/i);
    const columnMatch = errorMessage.match(/column\s+(\d+)/i);
    
    const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
    const column = columnMatch ? parseInt(columnMatch[1], 10) : undefined;
    
    // Return error result
    return {
      success: false,
      error: {
        message: errorMessage,
        line,
        column
      }
    };
  }
}

export default {
  transpile
};
