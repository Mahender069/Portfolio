import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const commit = (process.env.COMMIT_REF || 'dev').slice(0, 7)

export default defineConfig({
  define: {
    __COMMIT__: JSON.stringify(commit),
    __BUILT__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [react()],
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
