import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/items': 'http://localhost:3000',
      '/cart': 'http://localhost:3000',
      '/orders': {
        target: 'http://localhost:3000',
        bypass(req) {
          // Don't proxy browser page navigations — let Vite serve index.html
          if (req.headers.accept?.includes('text/html')) return req.url
        },
      },
    },
  },
})
