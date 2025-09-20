# API Contract: Core Package Integration

## Overview

This contract defines how the playground package will integrate with the core package to access the transpilation functionality.

## Import Contract

```typescript
// Import from core package
import { transpileSrc } from '@turacode/core';
```

## Function Contracts

### transpileSrc

Transpiles the source code from the Tura language to JavaScript.

```typescript
function transpileSrc(sourceCode: string): string
```

#### Parameters:
- `sourceCode: string` - The raw source code to transpile

#### Returns:
- `string` - The transpiled JavaScript code

## Type Definitions

The core package doesn't export complex types for the playground to use. The function interface is simple:

```typescript
// Function signature
type TranspileSrc = (sourceCode: string) => string;
```

## Error Handling

The `transpileSrc` function may throw exceptions if the parsing fails. The playground should wrap the call in a try-catch block to handle these errors properly.

## Examples

```typescript
// Example: Transpile code and handle result
try {
  const transpiledCode = transpileSrc(sourceCode);
  
  // Use the transpiled code
  executeJavaScript(transpiledCode);
} catch (error) {
  // Handle transpilation error
  displayError(error.message);
}
```