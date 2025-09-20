/**
 * Example Loader Utility
 * 
 * This utility loads example code files for the playground.
 */

/**
 * Loads an example file by name
 * @param name The name of the example file (without extension)
 * @returns A promise that resolves to the file content
 */
export async function loadExample(name: string): Promise<string> {
  try {
    const response = await fetch(`/examples/${name}.tc`);
    
    if (!response.ok) {
      throw new Error(`Failed to load example: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading example:', error);
    return `// Error loading example: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Gets the relative URL for an example file
 * @param name The name of the example file (without extension)
 * @returns The URL for the example file
 */
export function getExampleUrl(name: string): string {
  return `/examples/${name}.tc`;
}

export default {
  loadExample,
  getExampleUrl
};
