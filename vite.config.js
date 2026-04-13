import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
  // パスのエイリアスの設定
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/scss'),
      '@js': path.resolve(__dirname, 'src/js'),
    },
  },
  // minifiyの設定の有無
  build: {
    minify: mode === 'production',
  },
}));
