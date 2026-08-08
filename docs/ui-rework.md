# Migrating DocuChat Frontend to Next.js

## 1. Creating the Project

Run the following command in the **parent directory** of your current project (not inside it):

```bash
npx create-next-app@latest docuchat-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

When prompted, choose:

- **Would you like to use ESLint?** → **Yes** (we'll replace it with Biome immediately after, but the scaffolding needs it)
- **Would you like to use Turbopack?** → Yes (faster dev server)

> This creates a new folder. You'll migrate your files into it, not scaffold into your existing folder.

---

## 2. Remove ESLint, Add Biome

After scaffolding:

```bash
# Remove ESLint
npm uninstall eslint eslint-config-next

# Remove the ESLint config file
rm .eslintrc.json  # or .eslintrc.js / eslint.config.mjs

# Install Biome
npm install --save-dev --save-exact @biomejs/biome

# Initialise Biome config
npx @biomejs/biome init
```

Copy your existing `biome.json` from the old project into the new one. Then add these scripts to `package.json`:

```json
"scripts": {
  "lint": "biome lint .",
  "format": "biome format . --write",
  "check": "biome check ."
}
```

---

## 3. Install Remaining Dependencies

```bash
# Your existing runtime deps
npm install @sentry/nextjs

# If you use any others from your current project, add them here
```

> Note: `react-router-dom` is **not needed** — Next.js handles routing natively.

---

## 4. Project Structure

Use the **App Router** (`src/app/`). Here is the structure to follow:

```bash
src/
├── app/                         # Next.js App Router (pages + layouts)
│   ├── layout.tsx               # Root layout (replaces index.html + main wrapper)
│   ├── page.tsx                 # / → Home page
│   ├── architecture/
│   │   └── page.tsx             # /architecture
│   ├── demo/
│   │   └── page.tsx             # /demo
│   ├── feedback/
│   │   └── page.tsx             # /feedback
│   ├── privacy/
│   │   └── page.tsx             # /privacy (keep from current project)
│   └── terms/
│       └── page.tsx             # /terms (keep from current project)
│
├── components/                  # Shared UI components (move from src/components/)
│   ├── ChatArea.tsx
│   ├── DocumentsArea.tsx
│   ├── HeaderBar.tsx
│   └── FooterBar.tsx
│
├── hooks/                       # Custom hooks (move from src/hooks/)
│   └── useTheme.ts
│
├── api/                         # API client functions (move from src/api/)
│   ├── api-client.ts
│   ├── auth-endpoints.ts
│   ├── chat-session-endpoints.ts
│   └── ...
│
├── types/                       # TypeScript types (move as-is)
├── config/                      # App config (move, but update env vars — see below)
├── lib/                         # Utilities like logger.ts
├── data/                        # JSON data files
└── assets/                      # Static assets (or use /public/ at root)
```

**Static assets** (SVGs, images) go in `/public/` at the project root — Next.js serves them from there automatically. Move `src/assets/` → `public/assets/`.

---

## 5. The Root Layout (`src/app/layout.tsx`)

This replaces your `index.html` + the global CSS import + the `<html>` / `<body>` wrapper:

```tsx
import type { Metadata } from "next";
import "./globals.css";   // your existing index.css, renamed

export const metadata: Metadata = {
  title: "DocuChat",
  description: "...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Rename `src/styles/index.css` → `src/app/globals.css`.

---

## 6. Environment Variables

Next.js uses a different convention than Vite. **All `VITE_` prefixes must change.**

| Vite (old)                        | Next.js (new)                            |
|-----------------------------------|------------------------------------------|
| `VITE_ENV`                        | `NEXT_PUBLIC_ENV`                        |
| `VITE_ASK_DOCU_MIND_API_BASE_URL` | `NEXT_PUBLIC_ASK_DOCU_MIND_API_BASE_URL` |
| `import.meta.env.VITE_X`          | `process.env.NEXT_PUBLIC_X`              |

The `NEXT_PUBLIC_` prefix is required for any env var accessed in the **browser**. Variables without it are server-only.

Update `src/config/configs.ts`:

```ts
export const settings = {
  api: {
    ENV: process.env.NEXT_PUBLIC_ENV ?? "development",
    BASE_URL: process.env.NEXT_PUBLIC_ASK_DOCU_MIND_API_BASE_URL,
    BASE_VERSION: process.env.NEXT_PUBLIC_ASK_DOCU_MIND_API_VERSION ?? "1",
    IS_WEB_SEARCH_ENABLED: process.env.NEXT_PUBLIC_WEB_SEARCH_ENABLED === "true",
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  documents: {
    MAX_MB_PER_CHAT: Number(process.env.NEXT_PUBLIC_MAX_FILES_MB_PER_CHAT) || 1,
  },
};
```

Rename your `.env` file and update all variable names to match.

---

## 7. Client Components vs Server Components

This is the **most important concept** when moving to Next.js App Router.

By default, every file in `src/app/` is a **Server Component** — it renders on the server and has no access to browser APIs (`localStorage`, `window`, `document`, event handlers, or hooks).

You must add `"use client"` at the top of any file that:

- Uses React hooks (`useState`, `useEffect`, etc.)
- Accesses `localStorage` or `document`
- Has event handlers (`onClick`, `onChange`, etc.)

**Rule of thumb:** Page files (`page.tsx`) can often stay as server components for layout/data fetching. Push interactivity down into smaller client components.

For example, the `useTheme` hook touches `localStorage` and `document`, so any component using it needs `"use client"`:

```tsx
"use client";

import { useTheme } from "@/hooks/useTheme";
```

`HeaderBar`, `ChatArea`, `DocumentsArea`, and `FooterBar` all have state and event handlers — they all need `"use client"`.

---

## 8. Sentry Setup

Instead of manually initialising Sentry in `App.tsx`, use the official Next.js Sentry wizard:

```bash
npx @sentry/wizard@latest -i nextjs
```

This auto-generates `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`, and patches `next.config.ts` for you. Remove the manual `Sentry.init()` call from your components after running this.

---

## 9. TypeScript Config

The scaffolded `tsconfig.json` already includes the `@/*` alias. Verify this block is present:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Your existing import paths (`@/components/...`, `@/api/...`, etc.) will work without changes.

---

## 10. Migration Order (Recommended Steps)

1. Scaffold the new project with `create-next-app`
2. Swap ESLint → Biome, copy your `biome.json`
3. Copy `src/components/`, `src/hooks/`, `src/api/`, `src/types/`, `src/lib/`, `src/data/`, `src/config/` into the new project's `src/`
4. Move `src/styles/index.css` → `src/app/globals.css`
5. Move `src/assets/` → `public/assets/`
6. Update all env var names (`VITE_` → `NEXT_PUBLIC_`) in config and `.env`
7. Update `import.meta.env` → `process.env` in configs
8. Add `"use client"` to all components that use hooks, events, or browser APIs
9. Create `src/app/layout.tsx` with global CSS import and HTML shell
10. Create each `page.tsx` (`/`, `/architecture`, `/demo`, `/feedback`, `/privacy`, `/terms`)
11. Run `npm run dev` and work through any remaining errors

---

The biggest things to watch out for are the **env var renaming** and the **`"use client"` directive** — those two are responsible for most migration friction. Everything else maps cleanly from your current structure.
