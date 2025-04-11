# Stage 1: base image with non-root user
FROM node:22-alpine AS base

LABEL maintainer="MOJ Strategic Service Transformation Team <STGTransformationTeam@justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone


RUN apk --update-cache upgrade --available \
&& apk --no-cache add tzdata \
&& rm -rf /var/cache/apk/*

# Create non-root user and group only if not already present
# RUN addgroup --gid 1000 --system appgroup 2>/dev/null || true && \
# adduser --uid 1000 --system appuser --gid 1000 2>/dev/null || true

RUN addgroup --gid 2000 --system appgroup && \
adduser --uid 2000 --system appuser --ingroup appgroup

WORKDIR /app

# Stage 2: build and install dependencies
FROM base AS build

COPY package*.json ./
# RUN npm ci --omit=dev --no-audit
ENV NODE_ENV='production'

COPY . .
# Install all dependencies for build
ENV NODE_ENV=development
RUN npm install
RUN npm run build

RUN npm prune --no-audit --omit=dev

# Stage 3: runtime image
FROM base

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/dist ./dist

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

# Serve on 8080 — match platform/Helm expectations
# EXPOSE 3000

EXPOSE 9999

ENV NODE_ENV=production
USER 2000

CMD ["npm", "start"]