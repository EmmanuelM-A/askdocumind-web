# AskDocuMind — Frontend

A document Q&A web app that lets users upload documents and chat with them using AI. This repo contains the frontend client.

**Live demo:** [askdocumind.com](https://askdocumind.com)  

**Backend repo:** [EmmanuelM-A/askdocumind-api](https://github.com/EmmanuelM-A/askdocumind-api)

---

## Tech Stack

| Area | Tool |
| --- | --- |
| Framework | React 18 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| Icons | Font Awesome |
| Linting / Formatting | Biome |
| Testing | Vitest |
| Error monitoring | Sentry |
| Deployment | Vercel |

## Deployment

The app is deployed on [Vercel](https://vercel.com). Pushes to `main` trigger automatic production deployments.

## Getting Started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build        # production build
npm run test         # run tests in watch mode
npm run test:run     # run tests once
npm run lint:check   # check for lint/format issues
npm run lint:fix     # auto-fix lint/format issues
```
