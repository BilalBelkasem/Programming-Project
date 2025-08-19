import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      '/api': 'http://localhost:5000',  // vervang 5000 door jouw backend poort als die anders is
    },
  },
});
