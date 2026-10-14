import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from 'vitest/config'

// shadcn/ui primitives are vendored via the shadcn CLI, not hand-authored: not tested.
const SHADCN_UI_PATHS = [
  'src/components/ui/**',
  'src/__tests__/components/ui/**',
]

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
    exclude: [...configDefaults.exclude, ...SHADCN_UI_PATHS],
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, ...SHADCN_UI_PATHS],
    },
  },
})
