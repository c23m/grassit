import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import Icons from 'unplugin-icons/vite'

export default defineConfig(({ mode }) => {
  // .env* 文件的内容不会注入 process.env，这里用 loadEnv 显式读取
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const proxyTarget =
    env.VITE_PROXY_TARGET ||
    process.env.VITE_PROXY_TARGET ||
    'http://localhost:8000'

  return {
    plugins: [vue(), Icons({ compiler: 'vue3' })],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
        },
        '/public': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
