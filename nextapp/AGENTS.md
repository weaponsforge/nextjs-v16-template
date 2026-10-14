<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## AGENTS.md

This file gives agents guidance for working in this repository.

## Project Overview

A barebones, minimal Next.js v16 template using the **App Router** with custom ESLint rules, Prettier, and Docker configurations.

This directory (`nextapp/`) is a **subfolder of a root project**. The root directory holds the Docker Compose files (`docker-compose.yml`, `docker-compose.prod.yml`, `docker-compose.static.yml`), so run `docker compose` commands from the root. Run `npm` commands from this directory.

## Tech Stack

- **Next.js 16** (App Router, React Server Components)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (via `@tailwindcss/postcss`; theme tokens in `src/app/globals.css`)
- **shadcn/ui** on **Base UI** (`@base-ui/react`, `base-nova` style, config in `components.json`). Primitives are vendored into `src/components/ui/`. Supporting packages: `class-variance-authority`, `cn` (class merging, re-exported from `src/lib/utils.ts`), `lucide-react` (icons), `tw-animate-css` and `shadcn` (CSS imported by `globals.css`).
- **ESLint 9** flat config (`eslint.config.mjs`) with `eslint-config-next`, `eslint-plugin-import`, `eslint-config-prettier`
- **Prettier 3** (`.prettierrc.json`)
- **Vitest** + **React Testing Library** + **jest-dom** (jsdom; `vitest.config.mts`). See [Testing](#testing).
- **Docker** (optional): multi-stage `Dockerfile` (development, standalone, and static targets). nginx serves the static export (`config/nginx/nginx.conf`).

## Commands

Run from this directory (Node >= 24):

```sh
npm install
npm run dev            # Dev server (Turbopack) at http://localhost:3000
npm run build          # Production build (output depends on IS_BUILD_STATIC / IS_BUILD_DOCKER)
npm start              # Serve the production build (run build first)
npm run lint           # ESLint
npm run lint:fix       # ESLint autofix
npm run format         # Prettier write
npm run format:check   # Prettier check
npm run types:check    # next typegen && tsc --noEmit
npm test               # Run tests once (Vitest)
npm run test:watch     # Run tests in watch mode
npm run verify         # lint + format:check + types:check (must pass before commit/merge)
npx shadcn@latest add <component>   # Vendor a shadcn/ui (Base UI) primitive into src/components/ui/
```

### Docker (optional)

Running the app with Docker is **optional**. The npm commands above are the main workflow. Use Docker only as an alternative.

Docker-only scripts (called from the `Dockerfile`):

- `npm run docker:webpack`: dev server using Webpack, for hot reload in Docker on Windows
- `npm run docker:build`: standalone build (`IS_BUILD_DOCKER=1`) to `.next/standalone` and `.next/static`
- `npm run docker:static`: static export (`IS_BUILD_STATIC=1`) to `out/`

Docker, run from the **root** project directory:

```sh
docker compose build --no-cache   # Build the dev image
docker compose up                 # Run the dev container on port 3000
```

### Environment

Copy `.env.example` to `.env.local`. `next.config.ts` throws an error if `IS_BUILD_STATIC` and `IS_BUILD_DOCKER` are both `1`.

| Variable            | Purpose                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `IS_BUILD_STATIC`   | `1` sets `output: 'export'` (static HTML in `out/`, unoptimized images). Server features will not build. |
| `IS_BUILD_DOCKER`   | `1` sets `output: 'standalone'` for Docker production.                                                   |
| `IS_WEBPACK`        | `1` to use Webpack in Docker dev (needed for hot reload on Windows hosts).                               |
| `WATCHPACK_POLLING` | `true` to enable polling-based hot reload in Docker on Windows.                                          |

## Architecture: Routing

- `src/app/` is **only for routing**. It holds `page.tsx` and `layout.tsx` files that compose features, with no heavy logic.
- `src/app/layout.tsx` is the root layout. It loads the Geist fonts and `globals.css` and renders the shared `Header`.
- `src/app/(home)/page.tsx` is the `/` route. `(home)` is a route group, so it does not add a URL segment. It only renders `HomeView` from `@/features/home`, which composes the page's content.
- Pages import feature code **only through the feature's barrel file**, for example `import { HomeView } from '@/features/home'`. Deep imports such as `@/features/*/*` are blocked by ESLint (`no-restricted-imports`).
- Business logic lives outside `app/`:
  - `src/features/<feature>/`: domain modules with `actions/`, `components/`, `dal/`, `hooks/`, `schemas/`, `services/`, `utils/`, `types.ts`, and an `index.ts` barrel
  - `src/components/ui/` and `src/components/shared/`: globally reusable UI and layout components. `ui/` holds the vendored shadcn/ui primitives (for example `button.tsx`), imported as `@/components/ui/button`.
  - `src/lib/`, `src/hooks/`, `src/types/`: shared utilities, hooks, and types

Path aliases: `@/*` maps to `src/*`. There are also `@/features` and `@/components/*`.

## Testing and Verification

- **Runner**: Vitest with React Testing Library in a jsdom environment. Config is in `vitest.config.mts` (setup in `vitest.setup.ts`), which resolves the `@/` path aliases from `tsconfig.json`.
- **Location**: tests live in `src/__tests__/`, at a path that mirrors the code under test in `src/`. Vitest only picks up `src/__tests__/**/*.test.{ts,tsx}`.
  - `src/features/home/components/Menu.tsx` → `src/__tests__/features/home/components/Menu.test.tsx`
- **Naming**: name the test file after the target module, with a `.test.ts` or `.test.tsx` suffix (`Button.tsx` → `Button.test.tsx`).
- **Scope**: write tests selectively, for critical or global components, features, and business logic. Keep them simple and feature-level. End-to-end tests belong after deployment, where appropriate.
- **Assertions**: `vitest.setup.ts` registers the `@testing-library/jest-dom` matchers. Use them for DOM checks, such as `toBeInTheDocument()`, `toBeVisible()`, `toBeDisabled()`, `toHaveAttribute()`, `toHaveClass()` and `toHaveTextContent()`, instead of hand-written property checks. jsdom doesn't load Tailwind CSS, so `toBeVisible()` can't see elements hidden by classes like `hidden`. Use `toHaveClass('hidden')` for those.
- **Cleanup**: `vitest.setup.ts` (loaded via `setupFiles`) calls Testing Library's `cleanup()` after every test. Test files don't need their own `afterEach(cleanup)`. Put other global test setup in this file too.
- **Imports**: test files follow the same ESLint rules as app code. Import feature code through its barrel (`@/features/<name>`) or a route file (`@/app/...`), not through deep `@/features/*/*` paths.
- `npm run verify`, `npm test` and `npm run build` must pass before a commit. `npm run verify` does not run the tests, so run all three.
- Never write tests for `src/components/ui/**` (shadcn primitives, vendored); `vitest.config.mts` excludes that folder from runs and coverage. Test the components and hooks that use them instead.

## Conventions

**Read and follow [`docs/CODEBASE.md`](docs/CODEBASE.md)**. It is the source of truth for folder structure, naming, ESLint and Prettier rules, React patterns, dependencies, and testing. Key points:

- **Formatting** (Prettier): no semicolons, single quotes, trailing commas, 2-space indent, 80-column width, LF line endings.
- **Naming**: camelCase for variables, functions, files, and folders. PascalCase for React components (`.tsx`), types, interfaces, enums, and Zod schemas. ALL_CAPS for meaningful constants.
- **File suffixes**: `*.schema.ts`, `*.enum.ts`, `*.interface.ts`, `*.types.ts`.
- **Functions**: write React components as `function` declarations, with one component per file. Write helpers and utilities as arrow functions. Always type parameters and return values (`explicit-module-boundary-types`), and avoid `any`. Use early `return`s to exit as soon as a condition isn't met.
- **Container/presentational pattern**: put logic and data handling in custom hooks, and keep components focused on rendering. Use `useReducer` when local state grows complex (more than 7 states, or submitted/failed/removed scenarios).
- Use `useMemo`/`useCallback` where it matters (props passed to children, expensive computations), not by default.
- **Declarative JSX**: compute `.map()` lists, ternaries, and derived values into named variables before `return`.
- **Scope**: keep constants and types at the narrowest scope that fits their usage. Move them up to `features/<name>/utils/constants.ts` or `features/<name>/types.ts` only when several folders share them.
- **File size**: aim for under about 250 lines (ESLint `max-lines` warns), but do not split code arbitrarily.
- **Logging**: `no-console` allows only `console.error`. Prefix unused variables with `_`.
- **Docs**: write short JSDoc for parameters, return values, and types. Add minimal inline comments.
- **Dependencies**: keep external libraries to a minimum, and don't add one for something simple to write by hand. Add a library only when it is truly needed (complex to build, used widely, or heavy processing). Prefer libraries that are credible, widely used (about 100K+ npm downloads), lightweight or tree-shakeable, and actively maintained.
- **Testing**: use Vitest and React Testing Library for selective, feature-level tests.
- Run `npm run verify` and `npm test` before considering a change done.

## Gotchas for newcomers

- **Read the bundled Next.js docs first** (`node_modules/next/dist/docs/01-app/`). Next 16 / React 19 differ from older training data.
- **Barrel only**: `@/features/<name>` is allowed, `@/features/<name>/components/...` fails lint. Add new exports to the feature's `index.ts` (a plain `.ts` file with no JSX, which re-exports each component by name, e.g. `export { HomeView } from './components/HomeView'`).
- **Tests live only in `src/__tests__/`** mirroring `src/`. A test placed next to the source file is never run.
- **`npm run verify` skips tests.** Run `verify`, `npm test` and `npm run build` before calling a change done.
- **Components are `function` declarations; helpers are arrow functions.** ESLint enforces this, along with a blank line before every `return` and `import/order` (react, then next, then `@/components`, `@/hooks`, `@/lib`).
- **Don't hand-edit generated files**: `next-env.d.ts`, `.next/`, `tsconfig.tsbuildinfo`. `types:check` runs `next typegen` first, so route types exist only after it.
- **Static vs Docker builds are mutually exclusive** (`IS_BUILD_STATIC`, `IS_BUILD_DOCKER`). Static export means no server actions, API routes, or runtime server features.
- **Compose files and the Docker workflow assume a parent directory** that isn't in this repo checkout. Prefer the npm workflow.
- **Styling is Tailwind 4**: tokens live in `src/app/globals.css`, with no `tailwind.config`. Prefer scale utilities over arbitrary values.
- **shadcn/ui uses Base UI, not Radix**: add primitives with `npx shadcn@latest add <component>`, never by hand. `components.json` pins the `base-nova` style; don't re-run `shadcn init` without `-b base`, or it falls back to the Radix `new-york` style.
- **`src/components/ui/` is vendored**: Prettier ignores it (`.prettierignore`) and ESLint turns off `explicit-module-boundary-types` there, so CLI output passes `verify` unchanged. Restyle primitives through `className`, variants, or `data-slot` selectors in `globals.css`.
- **Base UI `Button` is for actions, not navigation**: rendering it as an `<a>` via `render` + `nativeButton={false}` adds `role="button"`. For links, put `buttonVariants()` from `@/components/ui/button` on a plain `<a>` or `next/link`.
- **Font variables belong on `<html>`**: `globals.css` applies `font-sans` (`var(--font-geist-sans)`) to `html`, so `layout.tsx` must put the `next/font` `.variable` classes on `<html>`, not `<body>`. On `<body>`, the variable is undefined where the font is set, and everything outside an explicit `font-sans` falls back to the browser default font.
- **Dark mode follows the OS** (`prefers-color-scheme`): `globals.css` defines `@custom-variant dark` as that media query, not shadcn's default `.dark` class. Switch both back to `.dark` if you add a theme toggle (for example `next-themes`).
