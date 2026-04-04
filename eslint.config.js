import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  // 既存のJSルール
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended', prettier],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-var': 'error', // varはエラー
      'no-unused-vars': 'warn', // 使っていない変数は警告
      'no-console': 'warn', // console.logは警告
      semi: ['error', 'always'], // 文末のセミコロンは必須
      quotes: ['error', 'single'], // 文字列はシングルクォートで囲む
      eqeqeq: ['error', 'always'], // 厳密な等価演算子を使用する ===を使用するってこと
      'prefer-const': 'error', // 再代入しない変数は let ではなく const で宣言することを強制する
    },
  },
  // Node用設定(vite.config.js)
  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
    rules: {}, // 特に追加ルールなくてもOK
  },
]);
