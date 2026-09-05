import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: [
      "debian"
    ],
    proxy: {
      '/api': {
        target: 'http://gst-backend:8090',
        // target: 'http://debian:8090',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 可选：重写路径
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
