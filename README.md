# Skillity

A platform for hands-on workshops. Passionate people host experiences — pottery, cooking, music, languages — and curious learners book a spot and show up. Small groups, in person, in your city.

Started in Berlin in 2016, rebooted in 2025.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React Router 7 (SSR), Vite, Tailwind CSS 4, shadcn/ui |
| Backend | NestJS, PostgreSQL, TypeORM |
| Runtime | Bun |
| Shared | TypeScript types package (`@skillity/shared`) |
| Dev | Docker Compose |

## Structure

```
backend/        # NestJS API (port 3000)
frontend/       # React Router 7 SSR app (port 3001)
packages/
  shared/       # shared TypeScript types
docker/         # workspace package.json stubs for Docker layer caching
```

## Local Dev

```bash
cp .env.example .env
docker compose up
```

The frontend proxies API calls to the backend via `API_URL=http://api:3000` inside Docker.

Frontend hot-reload is enabled via volume mounts — changes to `frontend/app/`, `frontend/components/`, and `frontend/lib/` reflect immediately.

## Frontend Architecture

- **SSR-first:** all data fetching in `loader()` functions, no client-side data fetching
- **Mutations:** `useFetcher` + resource routes (`/api/*`) — no server actions, no tRPC
- **Auth:** httpOnly cookies forwarded from the NestJS JWT strategy; `lib/session.server.ts` reads them on every request
- **Routing:** explicit `app/routes.ts` — no file-system magic

## License

All rights reserved. See [LICENSE](./LICENSE).

---

Built in Berlin by [Shawn Becker](https://shawnbecker.de).
