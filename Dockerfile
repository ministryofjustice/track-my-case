# Stage 1: base image with non-root user
FROM node:22.14-bookworm-slim AS base

LABEL maintainer="MOJ Strategic Service Transformation Team <STGTransformationTeam@justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

# Create non-root user and group
RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Stage 2: build and install dependencies
FROM base AS build

COPY package*.json ./
RUN npm ci --omit=dev

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

COPY --from=build --chown=appuser:appgroup \
    /app/public ./public

EXPOSE 3000
EXPOSE 9999

USER 2000

CMD ["node", "server.js"]