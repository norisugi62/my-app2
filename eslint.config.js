import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-var': 'error', // varはエラー
      'no-unused-vars': 'warn', // 使っていない変数は警告
      'no-console': 'warn', // console.logは警告
      semi: ['error', 'always'], // 文末のセミコロンは必須
      quotes: ['error', 'single'], // 文字列はシングルクォートで囲む
      eqeqeq: ['error', 'always'], // 厳密な等価演算子を使用する ===を使用するってこと
      'prefer-const': 'error', // 変更されない変数はconstを使用する
    },
  },
]);
