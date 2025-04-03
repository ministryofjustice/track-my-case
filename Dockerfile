# Stage 1: base image with non-root user
FROM node:22.14-bookworm-slim AS base

LABEL maintainer="MOJ Strategic Service Transformation Team <STGTransformationTeam@justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

# Create non-root user and group only if not already present
RUN addgroup --gid 1000 --system appgroup 2>/dev/null || true && \
    adduser --uid 1000 --system appuser --gid 1000 2>/dev/null || true

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Stage 2: build and install dependencies
FROM base AS build

COPY package*.json ./
RUN npm ci --omit=dev --no-audit

COPY . .

# Stage 3: runtime image
FROM base

COPY --from=build --chown=appuser:appgroup \
    /app/package.json \
    /app/package-lock.json \
    ./

COPY --from=build --chown=appuser:appgroup \
    /app/node_modules ./node_modules

COPY --from=build --chown=appuser:appgroup \
    /app/server.js ./server.js

# Serve on 8080 — match platform/Helm expectations
# EXPOSE 3000
EXPOSE 9999

# Drop privileges
USER 1000:1000

CMD ["node", "server.js"]