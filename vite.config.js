import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber'],
          'animation-vendor': ['gsap', 'motion', 'lenis'],
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
})
