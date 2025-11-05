FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json ./
RUN bun install --frozen-lockfile

# Production
FROM base AS production
COPY --from=install /app/node_modules ./node_modules
COPY . .

EXPOSE 3001
CMD ["bun", "run", "src/index.ts"]


