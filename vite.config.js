import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 2888,
    proxy: {
      '/api': {
        target: 'http://10.92.152.109:8790',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock', // mock文件存放目录
      enable: true, // 开发环境启用
      supportTs: false, // 支持TypeScript
    }),
  ],
})
