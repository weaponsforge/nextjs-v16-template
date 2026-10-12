# --------------------------------------------------------------------
# Base image
# --------------------------------------------------------------------
FROM node:24.11.0-alpine AS base
RUN apk add --no-cache libc6-compat
RUN mkdir -p /opt/client
WORKDIR /opt/client
RUN chown -R node:node /opt/client
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./

# --------------------------------------------------------------------
# Builder
# Installs dependencies for building
# --------------------------------------------------------------------
FROM base AS builder
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . ./

# --------------------------------------------------------------------
# Build targets
# --------------------------------------------------------------------

# BUILD TARGET for standalone mode
FROM builder AS build-standalone
RUN npm run docker:build

# BUILD TARGET for static export
FROM builder AS build-static
RUN npm run docker:static

# --------------------------------------------------------------------
# DEVELOPMENT image (for docker compose / docker run)
# Node.js alpine node user UID/GID is 1000/1000
# --------------------------------------------------------------------
FROM base AS development
ENV NODE_ENV=development
RUN mkdir -p /opt/client/.next && \
    chown -R node:node /opt/client
USER node
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 \
    npm ci
COPY --chown=node:node . ./
EXPOSE 3000
CMD ["sh", "-c", "if [ \"$IS_WEBPACK\" = \"1\" ]; then npm run docker:webpack; else npm run dev; fi"]

# --------------------------------------------------------------------
# PRODUCTION (Next.js standalone mode build)
# https://hmos.dev/en/nextjs-docker-standalone-and-custom-server#2-standalone-mode-build
# Next.js standalone output automatically excludes devDependencies - only production deps are included
# --------------------------------------------------------------------
FROM base AS production
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --chown=node:node --from=build-standalone /opt/client/package*.json /opt/client/.next/standalone ./
COPY --chown=node:node --from=build-standalone /opt/client/.next/static ./.next/static
COPY --chown=node:node --from=build-standalone /opt/client/public ./public
USER node
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# --------------------------------------------------------------------
# PRODUCTION (Static client export)
# --------------------------------------------------------------------
FROM nginx:1.22.0-alpine AS production-static
COPY --from=build-static /opt/client/out /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY config/nginx/nginx.conf /etc/nginx/conf.d/
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
