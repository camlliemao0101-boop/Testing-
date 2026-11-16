import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 发布目标是 GitHub Pages 项目站点 https://camlliemao0101-boop.github.io/Testing-/lina/
  // （仓库名末尾确实带连字符）。运行时拼出来的 `/assets/...` 由 src/assetUrl.ts
  // 接上同一个基础路径，两边都走 import.meta.env.BASE_URL。
  base: '/Testing-/lina/',
  // 监听所有网卡，方便手机等同一局域网设备用 IP:端口 访问
  server: { host: true, port: 5178 },
  preview: { host: true, port: 4178 },
})
