FROM node:24.11.0-alpine AS base
RUN apk add --no-cache libc6-compat
RUN mkdir -p /opt/client
WORKDIR /opt/client
RUN chown -R node:node /opt/client
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./

# Installs dependencies for building
FROM base AS builder
RUN --mount=type=cache,target=/root/.npm \
    npm ci && npm cache clean --force
COPY . ./

# BUILD TARGET for standalone mode
FROM builder AS build-standalone
RUN npm run docker:build

# BUILD TARGET for static export
FROM builder AS build-static
RUN npm run docker:static

# DEVELOPMENT app PROFILE
FROM base AS development
ENV NODE_ENV=development
RUN --mount=type=cache,target=/root/.npm \
    npm install && \
    npm cache clean --force && \
    mkdir -p /opt/client/.next && \
    chown -R node:node /opt/client/.next
COPY --chown=node:node . ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "if [ \"$IS_WEBPACK\" = \"1\" ]; then npm run docker:dev --webpack; else npm run dev; fi"]
# CMD ["npm", "run", "docker:dev"]

# PRODUCTION CLIENT PROFILE (Docker standalone mode build)
# https://hmos.dev/en/nextjs-docker-standalone-and-custom-server#2-standalone-mode-build
# Next.js standalone output automatically excludes devDependencies - only production deps are included
FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node --from=build-standalone /opt/client/package*.json /opt/client/.next/standalone ./
COPY --chown=node:node --from=build-standalone /opt/client/.next/static ./.next/static
COPY --chown=node:node --from=build-standalone /opt/client/public ./public
USER node
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# PRODUCTION CLIENT PROFILE (Static export)
FROM nginx:1.22.0-alpine AS production-static
COPY --from=build-static /opt/client/out /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY config/nginx/nginx.conf /etc/nginx/conf.d/
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
