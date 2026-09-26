import { defineConfig } from 'vite';

// Em desenvolvimento o frontend (5173) repassa /api para o servidor Express.
// Rode `npm run dev:api` em outro terminal. Sem isso, /api caía no index.html do Vite.
const API_TARGET = process.env.FANVERSE_API_URL || 'http://localhost:3000';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: false },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: false },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
