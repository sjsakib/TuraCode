/**
 * Type definitions for @turacode/core
 */

declare module '@turacode/core' {
  /**
   * Transpiles TuraCode source code to JavaScript
   * @param code TuraCode source code to transpile
   * @returns Transpiled JavaScript code
   * @throws Error if transpilation fails
   */
  export function transpileSrc(code: string): string;
}
