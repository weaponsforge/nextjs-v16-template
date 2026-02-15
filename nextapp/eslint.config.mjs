import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-console': ['error', { 'allow': ['error'] }],
      'react/react-in-jsx-scope': 'off',
      'no-restricted-imports': [
        'error',
        { 'patterns':
          [
            '@/features/*',
            './features/*'
          ]
        }
      ],
    },
  },
])

export default eslintConfig
