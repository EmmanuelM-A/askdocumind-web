# DocuChat Frontend

A React + Vite + TypeScript + Tailwind CSS single-page app for the DocuChat document-aware chatbot.

## Running locally

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env` file in the project root:

```bash
VITE_DOCU_CHAT_API_BASE_URL=http://localhost:5000/api
VITE_DOCU_CHAT_API_VERSION=1
VITE_MAX_FILES_MB_PER_CHAT=1
VITE_WEB_SEARCH_ENABLED=false
```

> Keep hostnames consistent — `localhost` with `localhost`, or `127.0.0.1` with `127.0.0.1`. The API client sends `credentials: include` on every request for cookie-based anonymous sessions.

## Building for production

```bash
npm run build
```

## Versioning

Versions follow **Semantic Versioning**: `MAJOR.MINOR.PATCH`

| Segment | Meaning                                                                    |
|---------|----------------------------------------------------------------------------|
| `MAJOR` | Pre-release while `0`. Bumping to `1` declares a stable public release.    |
| `MINOR` | A backwards-compatible new feature was added.                              |
| `PATCH` | A backwards-compatible bug fix.                                            |

So `0.1.0` = first feature-complete pre-release, no patches yet. Anything below `1.0.0` signals the product is still in flux.

To bump the version:

```bash
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm version major   # 0.1.0 → 1.0.0
```

The version is read from `package.json` at build time and displayed automatically in the footer.
