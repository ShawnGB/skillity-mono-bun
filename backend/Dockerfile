FROM oven/bun:1.2-alpine
WORKDIR /app

COPY docker/workspace-backend.json ./package.json
COPY bun.lock ./
COPY backend/package.json ./backend/
RUN bun install

COPY backend ./backend
WORKDIR /app/backend
EXPOSE 3000
CMD ["bun", "run", "start:dev"]
