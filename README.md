# AskDocuMind Web Client

The frontend for [AskDocuMind](https://askdocumind.com), a retrieval-augmented generation (RAG) API. It hosts a live demo where you upload documents or code, ask questions, and see which documents and web pages each answer used, plus an architecture tour of the system.

- Live site: [askdocumind.com](https://askdocumind.com)
- API: [EmmanuelM-A/askdocumind-api](https://github.com/EmmanuelM-A/askdocumind-api)

Built with Next.js (App Router), React and Tailwind CSS, tested with Vitest and linted with Biome.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The demo: chat, documents panel, sample documents, then "From upload to answer" and "Built with" |
| `/architecture` | One diagram per screen (system overview, RAG pipeline, upload handling, data models) with a side nav |
| `/privacy`, `/terms` | Rendered from Markdown in `src/data/` |
| `/demo` | Permanent redirect to `/` |

## Setup

```bash
npm install
```

Create `.env.local` (or `.env`) with the variables below, then run `npm run dev`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL including `/api`, e.g. `https://api.askdocumind.com/api` |

`NEXT_PUBLIC_` variables are baked into the bundle at build time, so changing one needs a rebuild.

## Local development

Run the [API](https://github.com/EmmanuelM-A/askdocumind-api) locally and point `NEXT_PUBLIC_API_BASE_URL` at it, e.g. `http://localhost:5001/api`. The deployed API won’t work from `localhost`: its session cookie is `Secure` and `SameSite=Strict`, so the browser only sends it on requests from `askdocumind.com`, and every request after sign-in returns 401.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome (writes changes) |
| `npm test` | Run the unit tests with Vitest |

## Project structure

```
src/
  app/          Pages, root layout, global styles, sitemap and robots
  api/          API client (fetch wrapper, ApiError, 401 retry) and one file per resource
  components/   UI, grouped by page: demo/, architecture/, layout/, navigation/
  config/       Env vars (configs.ts) and fixed API limits and routes (constants.ts)
  data/         Page copy as JSON, plus the privacy and terms Markdown
  hooks/        useDocuments (upload queue, status polling, delete) and useTheme
  lib/          Pure helpers: upload checks, chat history storage, formatting
  types/        API types, matching the API's camelCase JSON
tests/          Vitest unit tests
public/samples/ The sample documents used by "Try sample documents"
```

## How the demo talks to the API

- **Session:** on load, the demo calls `POST /v1/auth/anonymous/init` (sets an HttpOnly cookie), then `POST /v1/chat-session/init` to get the visitor's chat. Every request is sent with `credentials: "include"`. On a 401, the client refreshes the session once and retries.
- **Uploads:** files are checked in the browser (type, 10 MB, 10 per chat, duplicate names), given the right MIME type, and uploaded one at a time. On a 429 the queue waits for `Retry-After` and carries on.
- **Processing:** uploads return `202`, then the demo polls each document's status every 3 seconds until it is `COMPLETED` or `FAILED`. Failed documents can be retried.
- **Chat history:** the API doesn't store messages yet, so the conversation is saved in `localStorage` for the current chat and restored when the visitor returns.
- **Expired sessions:** if the chat no longer exists (404/403), the demo starts a new one and tells the visitor.

## Editing content

- **Page text** lives in `src/data/` (`demo/content.json`, `architecture/architecture.json`, `layout/*.json`, and the privacy and terms Markdown). Text changes don’t need code changes.
- **Architecture diagrams** are the SVGs in `public/images/architecture/`, one light and one dark per diagram. Their Mermaid sources are kept outside this repo.
- **Sample documents:** the files in `public/samples/` are listed, with the suggested questions, under `samples` in `src/data/demo/content.json`. Keep each file under 1 MB, and use made-up facts so answers can only come from the file.

## Deployment

The site is deployed on Vercel. Set `NEXT_PUBLIC_API_BASE_URL` in the Vercel project. For the session cookie to work, the API must be served from a subdomain of the site (`api.askdocumind.com`), with `CORS_ORIGINS` listing the site’s origin and `COOKIE_DOMAIN` set on the API.

CI (`.github/workflows/ci.yml`) runs lint, type checking, tests and a build on every push and pull request to `main` and `develop`.

## License

Source available, all rights reserved. See [LICENSE](LICENSE).
