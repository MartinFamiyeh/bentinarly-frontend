import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg'
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7141',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        ws: true,
      }
    }
  }
})
