import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true // Permite acessar de qualquer IP
  },
  preview: {
    port: 3000,
    host: true, // Permite acessar de qualquer IP
    allowedHosts: ['seedsafe.onrender.com', '.onrender.com'] // Permite seu domínio no Render
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});