import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    chunkSizeWarningLimit: 1024
  },
  server: {
      proxy: {
          '/api': {
              target: 'http://localhost:3000',
              changeOrigin: true,
              secure: false
          },
      },
  },
})
