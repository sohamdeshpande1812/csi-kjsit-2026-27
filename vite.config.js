import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Import from `@/...` instead of long relative paths.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // The lazy-loaded 3D vendor bundle (Three.js + R3F + Drei) is ~284 kB gzipped.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replaceAll('\\', '/');
          if (!norm.includes('/node_modules/')) return undefined;
          if (
            norm.includes('/node_modules/@react-three/') ||
            norm.includes('/node_modules/three-stdlib/') ||
            norm.includes('/node_modules/maath/')
          ) {
            return 'vendor-r3f';
          }
          if (norm.includes('/node_modules/three/')) {
            return 'vendor-three';
          }
          if (norm.includes('/node_modules/gsap/') || norm.includes('/node_modules/@gsap/')) {
            return 'vendor-gsap';
          }
          if (
            norm.includes('/node_modules/framer-motion/') ||
            norm.includes('/node_modules/motion-dom/') ||
            norm.includes('/node_modules/motion-utils/')
          ) {
            return 'vendor-motion';
          }
          if (
            norm.includes('/node_modules/react-dom/') ||
            norm.includes('/node_modules/react/') ||
            norm.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
          return undefined;
        },
      },
    },
  },
});
