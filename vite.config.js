import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages 部署在根域名或子路径下，使用相对基路径更稳妥；
  // 配合 public/_redirects 实现子页面刷新不 404。
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
