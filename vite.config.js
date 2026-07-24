import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber'],
          'animation-vendor': ['gsap', 'motion', 'lenis'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'markdown-vendor': ['react-markdown', 'rehype-raw', 'remark-gfm'],
          'spring-vendor': ['@react-spring/web'],
        }
      }
    }
  }
})
