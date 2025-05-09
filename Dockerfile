# syntax=docker/dockerfile:1

# ------------------------------------------------------------------------------
# Stage 1: Base image with shared setup
# ------------------------------------------------------------------------------

FROM node:22-alpine AS base

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
ARG NODE_ENV
ARG NODE_PORT
ARG SERVICE_URL
ARG OIDC_CLIENT_ID
ARG OIDC_PRIVATE_KEY
ARG OIDC_ISSUER
ARG IV_DID_URI
ARG IV_ISSUER
ARG OIDC_TOKEN_AUTH_METHOD
ARG OIDC_SCOPES
ARG OIDC_CLAIMS
ARG OIDC_AUTHORIZE_REDIRECT_URL
ARG OIDC_POST_LOGOUT_REDIRECT_URL
ARG AUTH_VECTOR_OF_TRUST
ARG IDENTITY_VECTOR_OF_TRUST
ARG UI_LOCALES
ARG IMMEDIATE_REDIRECT
ARG REQUIRE_JAR
ARG IDENTITY_SUPPORTED

RUN required_variables=" \
    BUILD_NUMBER  \
    GIT_REF  \
    GIT_BRANCH  \
    NODE_ENV \
    NODE_PORT \
    SERVICE_URL \
    OIDC_CLIENT_ID \
    OIDC_PRIVATE_KEY \
    OIDC_ISSUER \
    IV_DID_URI \
    IV_ISSUER \
    OIDC_TOKEN_AUTH_METHOD \
    OIDC_SCOPES \
    OIDC_CLAIMS \
    OIDC_AUTHORIZE_REDIRECT_URL \
    OIDC_POST_LOGOUT_REDIRECT_URL \
    AUTH_VECTOR_OF_TRUST \
    IDENTITY_VECTOR_OF_TRUST \
    UI_LOCALES \
    IMMEDIATE_REDIRECT \
    REQUIRE_JAR \
    IDENTITY_SUPPORTED \
" &&  \
    set -- $required_variables && \
    for var in "$@"; do \
      eval val=\$$var; \
      test -n "$val" || { echo "==>> Error!!! Environment variable not set: $var"; exit 1; }; \
    done


ENV BUILD_NUMBER=$BUILD_NUMBER
ENV GIT_REF=$GIT_REF
ENV GIT_BRANCH=$GIT_BRANCH
ENV NODE_ENV=$NODE_ENV
ENV NODE_PORT=$NODE_PORT
ENV SERVICE_URL=$SERVICE_URL
ENV OIDC_CLIENT_ID=$OIDC_CLIENT_ID
ENV OIDC_PRIVATE_KEY=$OIDC_PRIVATE_KEY
ENV OIDC_ISSUER=$OIDC_ISSUER
ENV IV_DID_URI=$IV_DID_URI
ENV IV_ISSUER=$IV_ISSUER
ENV OIDC_TOKEN_AUTH_METHOD=$OIDC_TOKEN_AUTH_METHOD
ENV OIDC_SCOPES=$OIDC_SCOPES
ENV OIDC_CLAIMS=$OIDC_CLAIMS
ENV OIDC_AUTHORIZE_REDIRECT_URL=$OIDC_AUTHORIZE_REDIRECT_URL
ENV OIDC_POST_LOGOUT_REDIRECT_URL=$OIDC_POST_LOGOUT_REDIRECT_URL
ENV AUTH_VECTOR_OF_TRUST=$AUTH_VECTOR_OF_TRUST
ENV IDENTITY_VECTOR_OF_TRUST=$IDENTITY_VECTOR_OF_TRUST
ENV UI_LOCALES=$UI_LOCALES
ENV IMMEDIATE_REDIRECT=$IMMEDIATE_REDIRECT
ENV REQUIRE_JAR=$REQUIRE_JAR
ENV IDENTITY_SUPPORTED=$IDENTITY_SUPPORTED

# ------------------------------------------------------------------------------
# Stage 2: Build stage
# ------------------------------------------------------------------------------

FROM base AS build

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH
ARG NODE_ENV
ARG NODE_PORT
ARG SERVICE_URL
ARG OIDC_CLIENT_ID
ARG OIDC_PRIVATE_KEY
ARG OIDC_ISSUER
ARG IV_DID_URI
ARG IV_ISSUER
ARG OIDC_TOKEN_AUTH_METHOD
ARG OIDC_SCOPES
ARG OIDC_CLAIMS
ARG OIDC_AUTHORIZE_REDIRECT_URL
ARG OIDC_POST_LOGOUT_REDIRECT_URL
ARG AUTH_VECTOR_OF_TRUST
ARG IDENTITY_VECTOR_OF_TRUST
ARG UI_LOCALES
ARG IMMEDIATE_REDIRECT
ARG REQUIRE_JAR
ARG IDENTITY_SUPPORTED

COPY package*.json ./

RUN which node && which npm && node -v && npm -v
RUN ls -l package.json && cat package.json

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

ENV BUILD_NUMBER=$BUILD_NUMBER
ENV GIT_REF=$GIT_REF
ENV GIT_BRANCH=$GIT_BRANCH
ENV NODE_ENV=$NODE_ENV
ENV NODE_PORT=$NODE_PORT
ENV SERVICE_URL=$SERVICE_URL
ENV OIDC_CLIENT_ID=$OIDC_CLIENT_ID
ENV OIDC_PRIVATE_KEY=$OIDC_PRIVATE_KEY
ENV OIDC_ISSUER=$OIDC_ISSUER
ENV IV_DID_URI=$IV_DID_URI
ENV IV_ISSUER=$IV_ISSUER
ENV OIDC_TOKEN_AUTH_METHOD=$OIDC_TOKEN_AUTH_METHOD
ENV OIDC_SCOPES=$OIDC_SCOPES
ENV OIDC_CLAIMS=$OIDC_CLAIMS
ENV OIDC_AUTHORIZE_REDIRECT_URL=$OIDC_AUTHORIZE_REDIRECT_URL
ENV OIDC_POST_LOGOUT_REDIRECT_URL=$OIDC_POST_LOGOUT_REDIRECT_URL
ENV AUTH_VECTOR_OF_TRUST=$AUTH_VECTOR_OF_TRUST
ENV IDENTITY_VECTOR_OF_TRUST=$IDENTITY_VECTOR_OF_TRUST
ENV UI_LOCALES=$UI_LOCALES
ENV IMMEDIATE_REDIRECT=$IMMEDIATE_REDIRECT
ENV REQUIRE_JAR=$REQUIRE_JAR
ENV IDENTITY_SUPPORTED=$IDENTITY_SUPPORTED

USER 2000

RUN echo '==>> this is env:'
RUN echo $test

CMD ["npm", "start"]
