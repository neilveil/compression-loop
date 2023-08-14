import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import eslint from '@eslint/js'

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs['eslint-recommended'].rules,
      ...tsPlugin.configs['recommended'].rules,
      'no-async-promise-executor': 'off'
    },
    files: ['src/**/*.ts']
  }
]
