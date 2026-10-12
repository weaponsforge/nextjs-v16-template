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
- **ESLint 9** flat config (`eslint.config.mjs`) with `eslint-config-next`, `eslint-plugin-import`, `eslint-config-prettier`
- **Prettier 3** (`.prettierrc.json`)
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
npm run verify         # lint + format:check + types:check (must pass before commit/merge)
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
- `src/app/(home)/page.tsx` is the `/` route. `(home)` is a route group, so it does not add a URL segment.
- Pages import feature code **only through the feature's barrel file**, for example `import { Menu } from '@/features/home'`. Deep imports such as `@/features/*/*` are blocked by ESLint (`no-restricted-imports`).
- Business logic lives outside `app/`:
  - `src/features/<feature>/`: domain modules with `actions/`, `components/`, `dal/`, `hooks/`, `schemas/`, `services/`, `utils/`, `types.ts`, and an `index.ts` barrel
  - `src/components/ui/` and `src/components/shared/`: globally reusable UI and layout components
  - `src/lib/`, `src/hooks/`, `src/types/`: shared utilities, hooks, and types

Path aliases: `@/*` maps to `src/*`. There are also `@/features` and `@/components/*`.

## Conventions

**Read and follow [`docs/CODEBASE.md`](docs/CODEBASE.md)**. It is the source of truth for folder structure, naming, ESLint and Prettier rules, and React patterns. Key points:

- **Formatting** (Prettier): no semicolons, single quotes, trailing commas, 2-space indent, 80-column width, LF line endings.
- **Naming**: camelCase for variables, functions, files, and folders. PascalCase for React components (`.tsx`), types, interfaces, enums, and Zod schemas. ALL_CAPS for meaningful constants.
- **File suffixes**: `*.schema.ts`, `*.enum.ts`, `*.interface.ts`, `*.types.ts`.
- **Functions**: write React components as `function` declarations, with one component per file. Write helpers and utilities as arrow functions. Always type parameters and return values (`explicit-module-boundary-types`), and avoid `any`.
- **Container/presentational pattern**: put logic and data handling in custom hooks, and keep components focused on rendering. Use `useReducer` when local state grows complex (more than 7 states, or submitted/failed/removed scenarios).
- **Declarative JSX**: compute `.map()` lists, ternaries, and derived values into named variables before `return`.
- **Scope**: keep constants and types at the narrowest scope that fits their usage. Move them up to `features/<name>/utils/constants.ts` or `features/<name>/types.ts` only when several folders share them.
- **File size**: aim for under about 250 lines (ESLint `max-lines` warns), but do not split code arbitrarily.
- **Logging**: `no-console` allows only `console.error`. Prefix unused variables with `_`.
- **Docs**: write short JSDoc for parameters, return values, and types. Add minimal inline comments.
- Run `npm run verify` before considering a change done.
