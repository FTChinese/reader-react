import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000/',
      // Forward requests for service, like qr image generation
      '/service': 'http://localhost:4000/'
    }
  },
});
