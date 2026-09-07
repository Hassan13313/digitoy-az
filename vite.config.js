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
        /* Lokal PHP server (php -S localhost:8080 -t public)
           Production API-sinə qoşulmamaq üçün production URL istifadə olunmur. */
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false,
      },
    },
  },
})
