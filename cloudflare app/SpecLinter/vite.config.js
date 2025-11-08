// Vite configuration for SpecLinter Figma plugin
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        code: resolve(__dirname, 'code.ts'),
        ui: resolve(__dirname, 'ui.ts')
      },
      formats: ['iife'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      output: {
        extend: true,
        globals: {
          'figma': 'figma'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2017',
    minify: false,
    sourcemap: false
  },
  define: {
    global: 'globalThis'
  }
});
