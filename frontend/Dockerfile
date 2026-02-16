FROM oven/bun:1.2-alpine
WORKDIR /app

COPY docker/workspace-frontend.json ./package.json
COPY bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY frontend/package.json ./frontend/
RUN bun install

COPY packages/shared ./packages/shared
COPY frontend ./frontend
WORKDIR /app/frontend
EXPOSE 3000
CMD ["bun", "run", "dev"]
