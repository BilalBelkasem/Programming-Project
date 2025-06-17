import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // Zorgt dat Vite op alle netwerkinterfaces luistert
    proxy: {
      '/api': {
        target:'192.168.0.50:5000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
});

