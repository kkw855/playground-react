import tseslint from 'typescript-eslint'
import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'

import globals from 'globals'

import importPlugin from 'eslint-plugin-import'

import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

import tailwind from 'eslint-plugin-tailwindcss'

// eslint-plugin-prettier and eslint-config-prettier 둘 다 설정함
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

import checkFile from 'eslint-plugin-check-file'

// eslint.config.js 파일 절대 경로
const __filename = fileURLToPath(import.meta.url)
// eslint.config.js 파일 디렉터리 경로
const __dirname = path.dirname(__filename)
// .gitignore 파일 절대 경로
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default tseslint.config(
  // .gitignore 에 있는 파일은 제외
  includeIgnoreFile(gitignorePath),
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      importPlugin.flatConfigs.errors,
      importPlugin.flatConfigs.warnings,
      importPlugin.flatConfigs.typescript,
      react.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      ...tailwind.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'check-file': checkFile,
    },
    settings: {
      // import 문에서 타입스크립트 파일 인식 가능
      'import/resolver': {
        typescript: true,
      },
      react: {
        // eslint-plugin-react 사용자가 설치한 버전을 자동으로 선택
        version: 'detect',
      },
    },
    rules: {
      // any 타입 사용 허용
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/no-empty-function': ['off'],
      // import React from 'react' 필요 없음
      'react/react-in-jsx-scope': 'off',
      'react/no-children-prop': ['error', { allowFunctions: true }],
      'react/prop-types': 'off',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // enforce unidirectional codebase architecture (shared -> features -> app).
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // disables cross-feature imports:
            // e.g., src/features/discussions should not import from src/features/comments, etc.
            {
              target: './src/features/auth',
              from: './src/features',
              except: ['./auth'],
            },
            {
              target: './src/features/images',
              from: './src/features',
              except: ['./images'],
            },
            {
              target: './src/features/hotels',
              from: './src/features',
              except: ['./hotels'],
            },

            // enforce unidirectional codebase:

            // e.g., src/app can import from src/features but not the other way around
            {
              target: './src/features',
              from: './src/app',
            },

            // e.g., src/features and src/app can import from these shared modules but not the other way around
            {
              target: [
                './src/domain',
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
              ],
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
      // import 문 설정된 순서대로 정렬
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
      'import/no-cycle': 'error',
      // 파일 이름 규칙
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  // 항상 마지막에 설정
  eslintPluginPrettierRecommended,
)
