## Project Folder structure

### NextJS app folder structure

Recommended NextJS app folder structure for projects using the **app router**.
```text
my-next-app/
├── public/
├── src/
│   ├── app/                # routing (App Router)
│   ├── components/         # shared UI components
│   ├── features/           # domain-driven modules
│   ├── lib/                # utilities, clients, configs
│   ├── hooks/              # reusable hooks
│   ├── types/              # global types
│   └── styles/             # global styles
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
  auth/
    components/
    hooks/
    services/
    types.ts
```

Grouping together feature-specific code like components, hooks, services removes clutter and scales well.

## Full Example

```text
src/
├── app/
|   ├── (marketing)/
|   ├── (dashboard)/
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
|   |   ├── services/
|   |   ├── server/
|   |   └── types.ts
|   |
|   └── courses/
|       ├── components/
|       ├── services/
|       ├── server/
|       └── types.ts
|
├── lib/
|   ├── db/
|   ├── auth/
|   ├── utils/
|   └── validations/
|
├── hooks/
|   ├── types/
|   └── styles/
...
```

## Benefits of using this structure

- **Scales cleanly** - You don’t end up with 200 files in `/components`
- **Encourages separation of concerns** - UI ≠ business logic ≠ data access
- **Works great with App Router**
   - app/ stays thin
   - Logic lives in features/ and lib/
