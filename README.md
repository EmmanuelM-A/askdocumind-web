# AskDocuMind Web Client

## Setup

```bash
npm install
```

Create `.env.local` with the variables listed below.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome (writes changes) |
| `npm test` | Run unit/integration tests with Vitest |
| `npm run generate:architecture-diagrams` | Regenerate architecture diagram images from the `.mmd` files in `diagrams/architecture/` |

## Environment variables

Set these in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ENV` | Environment name (`development`, `production`, etc.) |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API |
| `NEXT_PUBLIC_API_VERSION` | API version segment used by the client |
| `NEXT_PUBLIC_MAX_FILES_MB_PER_CHAT` | Max upload size (MB) enforced client-side |

## Notes

- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
