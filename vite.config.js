import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    /* Lokal dev: /api/* → PHP serverinə proxy
       Production-da həmin URL-lər cPanel-in real PHP fayllarına gedir */
    proxy: {
      '/api': {
        target: 'https://digitoy.az',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
