## Next.js (App Router) + Server Components + Server Actions Folder Structure

### High-level project folder structure

Recommended Next.js app folder structure for projects using the **App Router** with **Server Components** and **Server Actions**.

```text
my-next-app/
├── public/
├── src/
│   ├── app/                # Routing (App Router)
│   ├── components/         # Shared UI components
│   ├── features/           # Domain-driven modules
│   │── lib/                # Shared utilities, clients, configs
|   │   ├── constants.ts    # Shared constants definition
|   │   └── helpers.ts      # Shared helper functions
│   ├── hooks/              # Shared reusable hooks
│   ├── types/              # Global types
│   └── styles/             # Global styles
├── next.config.js
├── tsconfig.json
└── package.json
```

## Structure Notes

#### 1. `app/` is ONLY for routing

```text
app/
  dashboard/
    page.tsx
    layout.tsx
```

No heavy logic here — just composition.

#### 2. Business logic lives outside `app/`

```text
lib/
  api/
  db/
  auth/
```

Keeps routes clean and testable

#### 3. Features group related code

```text
features/
  notes/
    actions/            # Next.js Server actions
    components/         # React components
      edit/             # Sub-feature components
      LeftPanel.tsx     # Shared feature component
    dal/                # Server-side data access layer
      notes.ts          # Direct calls to database CRUD operations
      notes.queries.ts  # Custom queries construction
    hooks/              # Custom React hooks, contexts
    schemas/            # Data type definitions eg., Zod schemas
    services/           # API calls to external data sources
    utils/              # Utility methods and helper functions
      helpers.ts
      constants.ts      # Feature-level constants definition
    types.ts            # Type definitions shared across the feature
    index.ts            # Barrel file collects exports from multiple files into one entry point
```

Grouping together feature-specific code like components, hooks, services removes clutter and scales well.

## Full Example

```text
src/
├── app/
|   ├── (home)/
|   ├── marketing/
|   ├── dashboard/
|   └── api/
|
├── components/
|   ├── ui/              # buttons, inputs, etc.
|   └── shared/          # reusable across features
|
├── features/
|   ├── auth/
|   |   ├── components/
|   |   ├── hooks/
|   |   ├── dal/
|   |   ├── utils/
|   |   ├── types.ts
|   |   └── index.ts
|   |
|   ├── marketing/
|   |   ├── components/
|   |   ├── dal/
|   |   ├── utils/
|   |   ├── types.ts
|   |   └── index.ts
|   |
|   └── home/
|       ├── components/
|       |   ├── About.tsx
|       |   ├── Hero.tsx
|       |   └── Profiles.tsx
|       ├── hooks/
|       ├── types.ts
|       └── index.ts
|
├── lib/
|   ├── db/
|   ├── auth/
|   ├── utils/
|   └── validations/
|
├── hooks/
├── types/
├── styles/
...
```

`index.ts` in each feature folder exports React components or utilities that the web app uses globally (eg., in Next.js `page.ts` or `layout.ts`)

eg., in `/features/auth/index.ts`:

```tsx
export { default as AuthWidget } from './components/AuthWidget'
export { signIn, signOut } from './utils/authClient'
export { AUTH_CODE, AUTH_ERROR, AUTH_ROUTES } from './utils/constants'
```

eg., usage in `/app/auth/page.tsx`:

```tsx
import { AuthWidget } from '@/features/auth'

export default function AuthPage() {
  return <AuthWidget />
}
```

## Benefits of using this structure

- **Scales cleanly** - You don’t end up with 200 files in `/components`
- **Encourages separation of concerns** - UI ≠ business logic ≠ data access
- **Works great with App Router**
  - app/ stays thin
  - Logic lives in features/ and lib/

## Path Aliases

Follow these path aliases in `tsconfig.json` when creating new components. Use path aliases when importing components.

```json
"paths": {
  "@/*": ["./src/*"],
  "@/features": ["./src/features"],
  "@/features/*": ["./src/features/*"],
  "@/components/*": ["./src/components/*"]
}
```

## ESLint Rules

Check and enforce the following ESLint rules for code correctness, imports, unused variables:

```json
rules: {
  'import/no-commonjs': 'error',
  'no-console': ['error', { allow: ['error'] }],
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'react/react-in-jsx-scope': 'off',
  '@typescript-eslint/no-require-imports': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    },
  ],
  'no-restricted-imports': [
    'error',
    {
      'patterns': ['@/features/*/*'],
    },
  ],
  // The mechanically-enforceable subset of the conventions below.
  'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/naming-convention': [
    'error',
    { 'selector': 'typeLike', 'format': ['PascalCase'] },
    { 'selector': 'variable', 'format': ['camelCase', 'PascalCase', 'UPPER_CASE'], 'leadingUnderscore': 'allow' },
    { 'selector': 'function', 'format': ['camelCase', 'PascalCase'] },
    { 'selector': 'parameter', 'format': ['camelCase', 'PascalCase'], 'leadingUnderscore': 'allow' },
    { 'selector': 'import', 'format': ['camelCase', 'PascalCase', 'UPPER_CASE'] },
    { 'selector': ['property', 'objectLiteralProperty', 'typeProperty'], 'format': null },
  ],
  'react/function-component-definition': [
    'error',
    { 'namedComponents': 'function-declaration', 'unnamedComponents': 'arrow-function' },
  ],
}
```

## Prettier

Formatting (semicolons, quotes, indent, line endings, trailing commas) is owned by Prettier, not ESLint. Config lives in `.prettierrc.json` at the repo root:

```json
{
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "bracketSpacing": true
}
```

## Verification

Before a commit or build is considered good, `npm run verify` must pass — it chains:

- `lint` (ESLint — correctness, imports, unused vars)
- `format:check` (Prettier — formatting, no writes)
- `types:check` (next typegen && tsc --noEmit — TypeScript types, including generated route types)

Run `npm run verify` locally and in CI before merging.

## 📐 General Coding Guidelines

- Use **`LF` (Line Feed)** as the line ending format for all code and other files to ensure consistency across environments and platforms.
- Use **arrow functions** instead of traditional function declarations when defining helper or utility functions and methods. Only use `function()` definitions for specific cases.
- Follow **camelCase** for naming variables, files, functions/methods and folders.
- Follow **PascalCase** for naming **Zod** schemas, **React** components `.tsx`, **TypeScript** `types`, `interfaces`, `enums` and other TypeScript constructs.
- Follow consistent file naming conventions based on content:
  - Use `*.schema.ts` for files containing Zod schemas.
  - Use `*.enum.ts` for files containing only enums.
  - Use `*.interface.ts` for files containing only interfaces.
  - Use `*.types.ts` for files that include a mix of types, interfaces, enums, or other related constructs.
- Always define the **types** of function parameters and return values. Use TypeScript **interfaces** or **types** for generic parameters when applicable.
  - Avoid `any` unless absolutely necessary (prefer `unknown`, `Record`, etc.)
- Implement features using a **co-located structure** within the `📂 src/features` directory.
- Use **early `return` statements** to exit a hooks or functions as soon as possible when conditions aren't met, to avoid unnecessary processing and to keep the logic clean and efficient.

### Source File Size

- Aim to keep each source file—whether a React component, hook, utility, or other module—**under approximately 250 lines of code**.
- When a file exceeds 250 lines, **evaluate whether it can be split into smaller, cohesive modules** with clear responsibilities.
- Prefer **smaller, focused files** when splitting improves readability, maintainability, or separation of concerns.
- **Do not split code arbitrarily** just to satisfy the line-count target; keep closely related logic together when that produces a clearer design.

### Constants

- Extract **meaningful, repeated, or configuration-like constant values** into well-named `ALL_CAPS` variables to improve readability and maintainability.
  ```typescript
  ✅ const DISCUSSIONS_API = "/api/v1/discussions"
      fetch(DISCUSSIONS_API)
  ❌ fetch("/api/v1/discussions")
  ```
- Do **not** extract trivial or self-explanatory literals solely to avoid inline values.
  ```typescript
  ✅ if (items.length === 0) { ... }
  ❌ const EMPTY_LENGTH = 0
  if (items.length === EMPTY_LENGTH) { ... }
  ```
- Store constants that are **shared across multiple parts of a feature** in `features/<feature-name>/utils/constants.ts`.
- Keep constants that are **only used by one module** local to that module rather than moving them to the feature-level constants.ts.
- Avoid creating constants for values that are used only once unless the name provides meaningful semantic context.

### TypeScript Types

- **Feature-shared types:** Create `types.ts` at the feature root for types used by **multiple folders** within the feature, such as `actions/`, `components/`, `hooks/`, `services/`, or `utils/`.
- **Folder-internal types:** Create `types.ts` inside `actions/`, `components/`, `hooks/`, `services/`, or `utils/` when the types are used **only within that folder**.
- **Keep types at the narrowest scope that satisfies their usage.** Do not create or move types to a shared `types.ts` solely for convenience.
- **Promote a folder-internal type to the feature-level `types.ts` when another folder needs to use it.**

## Frontend UI

The React app follows the [container-component pattern](https://www.patterns.dev/react/presentational-container-pattern/) (also known as the container/presentational) pattern, where **logic and data processing are handled in React hooks** (containers) while **components are focused only on rendering UI** (components).

### ⚛️ React Components

- Use **function declarations** only when defining React components.
- Name **component folder names** using **camelCase**, **components** in **PascalCase** (e.g., `FeatureOne.tsx`, `featureTwo/FeatureTwo.tsx`).
- Keep React components focused on **UI (JSX/HTML)** with minimal logic. Whenever possible, separate logic and data handling into custom **React hooks** (`"containers"`), and use components solely for rendering UI.
- Use **TypeScript interfaces or types** to define props instead of PropTypes.
- Make good use of **component composition** — build small, focused components that can be composed together.
- A file should only have one React component. Avoid defining multiple components in a single file.
- Group React components into sub-feature folders under `features/`, e.g. `features/reflections/view` and `features/reflections/edit`.
- Place non-feature **globally reusable UI or layout components** in the `📂 /src/components` (ui or layout) subfolders.
- Define local states in a **useReducer** hook when: (1) the component needs to track "submitted", "fetch failed", "item removed" scenarios, (2) local states start clustering (more than 7 local states)

### ⚡ Rendering Optimization

- Use `useMemo()` and `useCallback()` to memoize values and functions where appropriate, especially when passing props to child components or dealing with expensive computations.
- Observe the React profiler from the [React Developer Tools](https://react.dev/learn/react-developer-tools) to determine which component/s may need rendering optimizations from time to time.
- Be mindful of the **final bundle size** generated by the `"npm run build"` command. Optimize components, imports, and dependencies to reduce unnecessary bloat and improve performance.
- Keep the **return block declarative**. Before **return**, compute list rendering (`Array.map`), conditional output and derived values into named variables. The JSX should only reference those variables. Simple `&&` guards and single prop values are fine inline; loops and ternaries are not.

  ✅ Do:

  ```typescript
  const users = userList.map((item) => (
    <User
      key={item.id}
      name={item.name}
    />
  ))

  return (
    <div>{users}</div>
  )
  ```

  ❌ Don't:

  ```typescript
   return (
     <div>
       {userList.map((item) => (
         <User
           key={item.id}
           name={item.name}
           />
       ))}
     </div>
   )
  ```

## 📄 Code Documentation

- Always use short, direct-to-the point **JSDoc-style descriptions** to describe function parameters, return types, and TypeScript type or interface definitions.
- Add **minimal, short, direct-to-the-point inline comments** where necessary to clarify intent, especially for complex or non-obvious logic.
- Use **descriptive and self-explanatory variable names** to reduce the need for excessive comments and improve overall code readability.
