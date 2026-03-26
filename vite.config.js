import { defineConfig } from 'vite';
import path from 'path';

// パスのエイリアスの設定
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
});
