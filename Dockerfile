# syntax=docker/dockerfile:1

# ------------------------------------------------------------------------------
# Stage 1: Base image with shared setup
# ------------------------------------------------------------------------------

FROM node:23-alpine AS base

LABEL maintainer="MOJ Strategic Service Transformation Team <STGTransformationTeam@justice.gov.uk>"

RUN apk --update-cache upgrade --available \
  && apk --no-cache add tzdata \
  && rm -rf /var/cache/apk/*

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

# Create non-root user
RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --ingroup appgroup

WORKDIR /app

# Accept build args and promote them to ENV for later stages
ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)
RUN test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_BRANCH=${GIT_BRANCH}

# ------------------------------------------------------------------------------
# Stage 2: Build stage
# ------------------------------------------------------------------------------

FROM base AS build

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

COPY package*.json ./

# Prevent Cypress from installing in CI-style templates
ENV CYPRESS_INSTALL_BINARY=0
RUN npm ci --no-audit

COPY . .
RUN npm run build

# Prune dev dependencies
RUN npm prune --omit=dev --no-audit

# ------------------------------------------------------------------------------
# Stage 3: Runtime
# ------------------------------------------------------------------------------

FROM base

WORKDIR /app

# Copy only what's needed for runtime
COPY --from=build --chown=appuser:appgroup /app/package*.json ./
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/dist ./dist

EXPOSE 9999
ENV NODE_ENV=production

USER 2000

CMD ["npm", "start"]
