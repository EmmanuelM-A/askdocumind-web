# DocuChat Frontend

A minimal single-page React app starter using Vite, TypeScript, and Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

## API Dev Env (Cookie Sessions)

Use a `.env` file so frontend and backend hosts stay consistent during local development.

```bash
VITE_DOCU_CHAT_API_BASE_URL=http://localhost:5000/api
VITE_DOCU_CHAT_API_VERSION=1
```

Notes:
- Keep hostnames consistent (`localhost` with `localhost`, or `127.0.0.1` with `127.0.0.1`).
- The API client sends requests with `credentials: include` by default for cookie-based anonymous sessions.

## Build

```bash
npm run build
```

