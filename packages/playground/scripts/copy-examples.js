#!/usr/bin/env node

/**
 * Script to copy example files to the public directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const examplesDir = path.resolve(__dirname, '../examples');
const publicDir = path.resolve(__dirname, '../public');
const publicExamplesDir = path.resolve(publicDir, 'examples');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created public directory');
}

// Create examples directory in public if it doesn't exist
if (!fs.existsSync(publicExamplesDir)) {
  fs.mkdirSync(publicExamplesDir, { recursive: true });
  console.log('Created public/examples directory');
}

// Copy example files to public directory
if (fs.existsSync(examplesDir)) {
  const files = fs.readdirSync(examplesDir);
  let count = 0;
  
  files.forEach(file => {
    if (file.endsWith('.tc')) {
      fs.copyFileSync(
        path.resolve(examplesDir, file),
        path.resolve(publicExamplesDir, file)
      );
      count++;
      console.log(`Copied ${file} to public/examples`);
    }
  });
  
  console.log(`Copied ${count} example files to public/examples`);
} else {
  console.log('Examples directory not found');
}
