import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'build',
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html'),
    },
  },
  server: {
    open: true
  }
});
