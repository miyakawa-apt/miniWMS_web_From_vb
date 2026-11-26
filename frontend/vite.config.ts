import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 単一デプロイ：ビルド出力を Spring Boot の static に置く
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../backend/src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // 開発時は API を Spring Boot（8080）へ中継する
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
