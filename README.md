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
| `npm test` | Run the unit tests with Vitest |
| `npm run generate:architecture-diagrams` | Regenerate architecture diagram images from the `.mmd` files in `diagrams/architecture/` |

## Environment variables

Set these in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL including `/api`, e.g. `https://api.askdocumind.com/api` |

## Local development

Run the [API](https://github.com/EmmanuelM-A/askdocumind-api) locally and point `NEXT_PUBLIC_API_BASE_URL` at it, e.g. `http://localhost:8000/api`. The deployed API won’t work from `localhost`: its session cookie is `Secure` and `SameSite=Strict`, so the browser only sends it on requests from `askdocumind.com`, and every request after sign-in would return 401.

## Notes

- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
