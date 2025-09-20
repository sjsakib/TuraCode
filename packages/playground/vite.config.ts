import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    // @ts-ignore
    monacoEditorPlugin.default({
      languageWorkers: ['editorWorkerService', 'typescript']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  }
});

// Create public directory if it doesn't exist
const publicDir = path.resolve(__dirname, 'public');
const examplesDir = path.resolve(__dirname, 'examples');
const publicExamplesDir = path.resolve(publicDir, 'examples');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create examples directory in public if it doesn't exist
if (!fs.existsSync(publicExamplesDir)) {
  fs.mkdirSync(publicExamplesDir, { recursive: true });
}

// Copy example files to public directory
if (fs.existsSync(examplesDir)) {
  fs.readdirSync(examplesDir).forEach(file => {
    if (file.endsWith('.tc')) {
      fs.copyFileSync(
        path.resolve(examplesDir, file),
        path.resolve(publicExamplesDir, file)
      );
    }
  });
}