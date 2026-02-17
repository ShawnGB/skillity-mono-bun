# uSkillity

A platform for creative workshops. People host hands-on experiences (pottery, cooking, music, etc.) and others book a spot and show up. Started as a skill-sharing marketplace in 2016, rebooted in 2025 with a focus on creativity.

## Stack

- **Backend:** NestJS, PostgreSQL, TypeORM
- **Frontend:** Next.js 16, shadcn/ui, Tailwind CSS
- **Shared:** TypeScript types package
- **Dev:** Docker Compose, Bun

## Structure

```
backend/      # NestJS API
frontend/     # Next.js app
packages/     # shared types
```

## Local Dev

```bash
cp .env.example .env
docker compose up
```

## License

All rights reserved. See [LICENSE](./LICENSE).

---

Built in Berlin by [Shawn Becker](https://shawnbecker.de).
