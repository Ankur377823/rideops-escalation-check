# Frontend: Next.js, built once and then served by "next start" on port 3000.

# ---- Stage 1: install dependencies and build ----
FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The API address is baked into the browser code at build time.
ARG NEXT_PUBLIC_API_URL=http://localhost:8001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 2: the image that runs ----
FROM node:22-slim
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/package.json /app/next.config.ts ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next

# Run as a normal user, not root.
USER node

EXPOSE 3000
CMD ["npm", "start"]
