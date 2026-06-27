import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          animation: ['@studio-freight/lenis'],
          icons: ['lucide-react'],
        }
      }
    }
  }
})