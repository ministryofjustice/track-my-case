# Track a Case — UI

[![repo standards badge](https://img.shields.io/endpoint?labelColor=231f20&color=005ea5&style=for-the-badge&label=MoJ%20Compliant&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fendpoint%2Ftemplate-repository&logo=data:image/png;base64,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)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#template-repository)

Citizen-facing frontend for the **Track a Case** service (HMCTS / Ministry of Justice). Express.js + TypeScript, server-side rendered via Nunjucks, styled with GOV.UK Design System.

> **Note:** This service is closing on 1 August 2026. This documentation reflects the final production state of the codebase.

---

## Contents

- [Quick Start](#quick-start)
- [Commands](#commands)
- [Architecture](#architecture)
- [Features](#features)
  - [GOV.UK One Login](#govuk-one-login)
  - [Authentication Guards](#authentication-guards)
  - [Private Beta Password](#private-beta-password)
  - [English / Welsh Translation](#english--welsh-translation)
  - [GOV.UK Frontend Template](#govuk-frontend-template)
  - [Static Resources](#static-resources)
  - [Web Security (Helmet + CSP)](#web-security-helmet--csp)
  - [Web Session](#web-session)
  - [CSRF Protection](#csrf-protection)
  - [Rate Limiting](#rate-limiting)
  - [URL Normalisation](#url-normalisation)
  - [Google Tag Manager & Analytics](#google-tag-manager--analytics)
  - [Cookies](#cookies)
  - [Prometheus Metrics](#prometheus-metrics)
  - [Is This Page Useful](#is-this-page-useful)
  - [Quick Exit](#quick-exit)
  - [Service Shutdown Banner](#service-shutdown-banner)
  - [AWS Secrets Manager](#aws-secrets-manager)
  - [Health Check](#health-check)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## Quick Start

```bash
npm install
npm run start:dev   # esbuild watch + dev server on :9999
```

Visit [http://localhost:9999](http://localhost:9999)

```bash
docker compose up --build   # alternative: run in Docker
```

---

## Commands

| Command | Description |
|---|---|
| `npm run start:dev` | esbuild watch + Node dev server |
| `npm run build` | Production build → `dist/` |
| `npm run lint` | ESLint (zero warnings enforced) |
| `npm run lint-fix` | ESLint fix + Prettier format |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm test` | Jest unit tests |
| `npm run test:ci` | Jest sequential (single worker, for CI) |
| `npm run int-test` | Cypress E2E headless |
| `npm run int-test-ui` | Cypress E2E interactive |

Run a single Jest test file:

```bash
npx jest server/path/to/file.test.ts
```

---

## Architecture

**Request flow:**

```
server.ts → app.ts (middleware chain) → routes/ → controllers/ → services/ → API client → Nunjucks render
```

**Middleware order** (load-bearing — do not reorder):

1. i18n
2. Web security (Helmet)
3. Request parsing
4. Web session
5. Static resources
6. Nunjucks
7. GOV.UK One Login (Passport / OIDC)
8. CSRF
9. Cookie parser
10. Google Tag Manager
11. Rate limiting
12. Prometheus
13. URL parser
14. Routes
15. Error handler

See [`server/app.ts`](server/app.ts) for the full chain.

---

## Features

### GOV.UK One Login

**File:** [`server/middleware/setUpGovukOneLogin.ts`](server/middleware/setUpGovukOneLogin.ts)

OpenID Connect authentication via GOV.UK One Login, implemented with Passport.js.

| Route | Description |
|---|---|
| `GET /sign-in` | Initiates OIDC flow |
| `GET /oidc/authorization-code/callback` | Handles OAuth callback; success → `/case/search` |
| `POST /back-channel-logout-uri` | Receives back-channel logout from GOV.UK |
| `GET /signed-out` | Post-logout confirmation page |

**Token handling:** JWKS public key fetched from GOV.UK, JWT verified with `kid` validation. Tokens stored via `tokenStoreFactory`.

**User object:** Extracts `name`, `user_id`, and `userRoles` (with `ROLE_` prefix stripped).

**Key config:**

| Variable | Description |
|---|---|
| `OIDC_CLIENT_ID` | GOV.UK One Login client ID |
| `OIDC_PRIVATE_KEY` | Private key for `private_key_jwt` auth |
| `OIDC_AUTHORIZE_REDIRECT_URL` | Callback URL registered with GOV.UK |
| `OIDC_POST_LOGOUT_REDIRECT_URL` | Post-logout redirect |
| `AUTH_VECTOR_OF_TRUST` | e.g. `Cl.Cm` |
| `UI_LOCALES` | e.g. `en` |

---

### Authentication Guards

**File:** [`server/helpers/authenticatedUser.ts`](server/helpers/authenticatedUser.ts)

Two middleware guards applied to protected routes:

| Guard | Checks | Used on |
|---|---|---|
| `AuthenticatedUser` | Valid One Login OIDC session (via Passport) | `/case/search`, `/case/court-information` |
| `PasswordAuthenticated` | `req.session.passwordCorrect` + not expired | All case routes |

Both are applied in combination on most case routes: `PasswordAuthenticated` first, then `AuthenticatedUser`.

If `PasswordAuthenticated` fails, the user is redirected to `/private-beta-sign-in` with `returnTo` saved in session.

---

### Private Beta Password

**Files:** [`server/controllers/private-beta-sign-in-controller.ts`](server/controllers/private-beta-sign-in-controller.ts) · [`server/views/pages/private-beta-sign-in.njk`](server/views/pages/private-beta-sign-in.njk)

A service-level password gate used before One Login, as the service is in private beta. The password is stored in config and may be a semicolon-separated list to support rotation.

| Variable | Description |
|---|---|
| `TMC_PASSWORD` | Service password (semicolon-separated for multiple) |
| `TMC_PASSWORD_EXPIRATION_IN_MINUTES` | Session validity after sign-in (default: 1440 = 24 h) |

On success, a signed HTTP-only cookie is set with a `maxAge` derived from the expiration config. On failure, the same error message is shown regardless of whether the field was empty or the password was wrong (to avoid enumeration).

---

### English / Welsh Translation

**Files:** [`server/middleware/setUpi18n.ts`](server/middleware/setUpi18n.ts) · [`server/locales/`](server/locales/)

i18next with `i18next-fs-backend`. Language is detected from query string (`?lng=cy`) or cookie, then cached in a cookie.

**Supported languages:** `en` (English), `cy` (Welsh)

**Locale file structure:**

```
server/locales/
  common/          en.json  cy.json   ← shared strings (nav, banners, feedback)
  home/            en.json  cy.json
  cookies/         en.json  cy.json
  private-beta-sign-in/
  case/
    dashboard/     en.json  cy.json
    search/        en.json  cy.json
    court-information/
    ...
```

**Usage in templates:**

```njk
{{ t('common:shutdownBanner.heading') }}
{{ t('private-beta-sign-in:label', { applicationName: applicationName }) }}
```

**Rule:** Only external URLs (`http://` / `https://`) belong in locale JSON files. Internal routes (e.g. `/cookies`) must stay hardcoded in templates.

---

### GOV.UK Frontend Template

**Version:** `govuk-frontend` v6.3.0 · `@ministryofjustice/frontend` v9.0.0

**Layout files:**

| File | Used for |
|---|---|
| [`server/views/layout/public.njk`](server/views/layout/public.njk) | Unauthenticated pages (start, cookies, privacy, etc.) |
| [`server/views/layout/citizen-authenticated.njk`](server/views/layout/citizen-authenticated.njk) | Authenticated case pages |

Both layouts include: phase banner, back link, service shutdown banner, cookie banner, language switcher, quick exit, page feedback, and GOV.UK footer.

**Nunjucks setup:** [`server/middleware/nunjucksSetup.ts`](server/middleware/nunjucksSetup.ts)

View paths resolved (in order):
- `server/views/`
- `node_modules/govuk-frontend/dist/`
- `node_modules/@ministryofjustice/frontend/`

Asset cache-busting uses a manifest file generated at build time (`dist/assets/manifest.json`) via the `assetMap` Nunjucks filter.

---

### Static Resources

**File:** [`server/middleware/setUpStaticResources.ts`](server/middleware/setUpStaticResources.ts)

Gzip compression enabled. Paths served with a **1-hour cache** (`Cache-Control: public, max-age=3600`):

| URL path | Source |
|---|---|
| `/dist/assets` | Built app assets (CSS, JS, images) |
| `/assets` (GOV.UK) | `node_modules/govuk-frontend/dist/govuk/assets` |
| `/assets` (MOJ) | `node_modules/@ministryofjustice/frontend/moj/assets` |

All dynamic responses get `no-cache` headers via `nocache` middleware.

---

### Web Security (Helmet + CSP)

**File:** [`server/middleware/setUpWebSecurity.ts`](server/middleware/setUpWebSecurity.ts)

Helmet with a strict Content Security Policy. A fresh **nonce** (`crypto.randomBytes(16)`) is generated per request and injected into `<script>` and `<style>` tags.

| Directive | Allowed sources |
|---|---|
| `default-src` | `'self'` |
| `script-src` | `'self'`, `'strict-dynamic'`, nonce, googletagmanager.com |
| `style-src` | `'self'`, nonce, fonts.googleapis.com |
| `img-src` | `'self'`, data:, Google Analytics, GTM, DoubleClick |
| `connect-src` | `'self'`, GTM, Google Analytics, Azure Monitor |
| `font-src` | `'self'`, data:, fonts.gstatic.com |
| `frame-ancestors` | `'none'` |
| `form-action` | `'self'` |
| `object-src` | `'none'` |

**Other headers:** HSTS (1 year, includeSubDomains, preload), Referrer-Policy `strict-origin-when-cross-origin`, X-Frame-Options `DENY`. Cross-Origin Embedder Policy is **disabled** to support third-party iframes.

---

### Web Session

**File:** [`server/middleware/setUpWebSession.ts`](server/middleware/setUpWebSession.ts)

Express session with optional Redis store.

| Setting | Value |
|---|---|
| Session name | `track-my-case.session` |
| Default timeout | 120 minutes (`WEB_SESSION_TIMEOUT_IN_MINUTES`) |
| Cookie | HttpOnly, SameSite: lax, Secure when HTTPS |
| Rolling | `true` — expiry resets on every request |
| Store | MemoryStore (default) · Redis when `REDIS_ENABLED=true` |

Each request also receives an `X-Request-Id` header (UUID, passed through if already present), stored on `req.id`.

**Key config:**

| Variable | Description |
|---|---|
| `SESSION_SECRET` | Encryption key |
| `SESSION_NAME` | Cookie name |
| `WEB_SESSION_TIMEOUT_IN_MINUTES` | Idle timeout (default: 120) |
| `REDIS_ENABLED` | Enable Redis session store |

---

### CSRF Protection

**File:** [`server/middleware/setUpCsrf.ts`](server/middleware/setUpCsrf.ts)

Uses `csrf-sync`. Token is read from `req.body._csrf` (forms) or the `x-csrf-token` header (AJAX). Template variable `res.locals.csrfToken` is set automatically.

Disabled when `NODE_ENV === 'test'`.

---

### Rate Limiting

**File:** [`server/utils/rateLimitSetUp.ts`](server/utils/rateLimitSetUp.ts)

IP-based rate limiting applied globally via `express-rate-limit`.

| Setting | Default | Config variable |
|---|---|---|
| Max requests | 300 | `RATE_LIMIT_MAX_REQUESTS` |
| Window | 300 s (5 min) | `RATE_LIMIT_WINDOW_SECS` |
| Response | 429 + "Too many requests, please try again later." | — |

Standard `RateLimit-*` headers are enabled; legacy `X-RateLimit-*` headers are disabled.

---

### URL Normalisation

**File:** [`server/middleware/setUpReqUrlParser.ts`](server/middleware/setUpReqUrlParser.ts)

Normalises incoming request URLs before routing:

- Converts path to lowercase
- Collapses double slashes (`//` → `/`)
- Performs a safe redirect for malformed URLs
- Logs redirects with the request ID

---

### Google Tag Manager & Analytics

**File:** [`server/middleware/setUpGtm.ts`](server/middleware/setUpGtm.ts)

GTM and GA4 IDs are injected into `res.locals` on every request. The Nunjucks layouts include the GTM `<script>` tag in `<head>` and a `<noscript>` iframe at `bodyStart`.

Analytics are **only active** when the user has accepted cookies (`cookiePreferencesSet` cookie is set).

User and session IDs are encrypted before being passed to the data layer.

| Variable | Value |
|---|---|
| `GOOGLE_TAG_MANAGER_ID` | `GTM-xxxxxxxxxxx` |
| `GOOGLE_ANALYTICS_ID` | `G-xxxxxxxxxxxx` |

---

### Cookies

**Files:** [`server/routes/cookiesRoutes.ts`](server/routes/cookiesRoutes.ts) · [`server/views/pages/cookies.njk`](server/views/pages/cookies.njk) · [`server/views/partials/cookie-banner.njk`](server/views/partials/cookie-banner.njk)

| Route | Description |
|---|---|
| `GET /cookies` | Cookie policy page |
| `POST /cookies` | Save cookie preferences |
| `POST /cookies/decision` | Accept or reject from the banner (AJAX) |

The cookie banner is shown on every page until a decision is made. It stores the preference in a signed cookie `cookiePreferencesSet`. Analytics are activated or deactivated immediately based on the choice without a page reload.

---

### Prometheus Metrics

**Files:** [`server/middleware/setUpPrometheus.ts`](server/middleware/setUpPrometheus.ts) · [`server/services/prometheusService.ts`](server/services/prometheusService.ts)

**Scrape endpoint:** `GET /prometheus`

Metrics collected:

| Metric | Type | Labels | Description |
|---|---|---|---|
| `tmc_ui_application_availability` | Gauge | `status` | 1 = available, 0 = unavailable |
| `tmc_ui_health_check_status` | Gauge | `status`, `reason` | 1 = UP, 0 = DOWN |
| `tmc_ui_http_requests_total` | Counter | `method`, `route`, `status_code` | All HTTP requests |
| `tmc_ui_http_request_duration_seconds` | Histogram | `method`, `route`, `status_code` | Response times (buckets: 0.1 · 0.5 · 1 · 2 · 5 · 10 s) |
| `tmc_ui_page_feedback_total` | Counter | `page`, `useful` | "Is this page useful?" responses |

Node.js default metrics (CPU, memory, event loop) are also collected via `prom-client`.

A background health check runs every **30 seconds**, pinging the downstream API and updating the availability and health gauges.

---

### Is This Page Useful

**File:** [`server/views/partials/is-this-page-useful-feedback.njk`](server/views/partials/is-this-page-useful-feedback.njk)

Rendered in the footer of every page. Presents a **Yes / No** question. Responses are submitted via `POST /feedback/decision` (CSRF-protected) and recorded as a Prometheus counter (`tmc_ui_page_feedback_total`). A GA4 event is also fired.

- **Yes:** Shows a "Thank you" confirmation inline.
- **No:** Shows a link to an external SmartSurvey questionnaire.

---

### Quick Exit

**File:** [`server/views/partials/quick-exit.njk`](server/views/partials/quick-exit.njk)

Available to authenticated users (when `correctPasswordAndNotExpired === true`). Provides an emergency exit for users who may be in an unsafe situation (e.g. domestic abuse context).

- **Button** visible in the page footer
- **Keyboard shortcut:** Press Shift × 3 or Escape × 3 within the time window
- Three indicator dots show progress as keys are pressed
- On trigger: opens BBC Weather in a new tab, blanks the current tab, and removes it from browser history

| Variable | Description |
|---|---|
| `TMC_QUICK_EXIT_WINDOW_SECS` | Time window for key sequence (default: 5 s) |

---

### Service Shutdown Banner

**Files:** [`server/views/partials/service-shut-down-banner.njk`](server/views/partials/service-shut-down-banner.njk) · [`server/locales/common/en.json`](server/locales/common/en.json) · [`server/locales/common/cy.json`](server/locales/common/cy.json)

A red notification banner shown on all pages, informing users the service closes on **1 August 2026**. Styled via `.notification-banner--shutdown` in [`assets/scss/overrides/_local.scss`](assets/scss/overrides/_local.scss).

Translation keys: `shutdownBanner.title`, `shutdownBanner.heading`, `shutdownBanner.body`, `shutdownBanner.body2`.

---

### AWS Secrets Manager

**File:** [`server/awsSecretsLoader.ts`](server/awsSecretsLoader.ts)

At startup, optionally fetches the following secrets from AWS Secrets Manager:

- `OIDC_CLIENT_ID`
- `OIDC_PRIVATE_KEY`
- `SESSION_SECRET`

Secrets are cached in memory after the first load. If disabled, values fall back to environment variables.

| Variable | Description |
|---|---|
| `TMC_AWS_SECRET_MANAGER_ENABLED` | `true` to enable (default: `true`) |
| `TMC_AWS_SECRET_MANAGER_NAME` | Secret name in AWS |
| `TMC_AWS_REGION` | AWS region |

Secret values are masked in logs (first 2 + `****` + last 2 characters).

---

### Health Check

**File:** [`server/routes/healthRoutes.ts`](server/routes/healthRoutes.ts)

`GET /health` — returns service status. Used by Kubernetes liveness/readiness probes and load balancers. Also updates the Prometheus availability gauge.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_PORT` | | `9999` | Server port |
| `NODE_ENV` | prod | `development` | Environment name |
| `TRACK_MY_CASE_API_URL` | prod | `http://localhost:4550` | Downstream case API |
| `SESSION_SECRET` | prod | (insecure default) | Session encryption key |
| `SESSION_NAME` | | `track-my-case.session` | Session cookie name |
| `WEB_SESSION_TIMEOUT_IN_MINUTES` | | `120` | Session idle timeout |
| `OIDC_CLIENT_ID` | prod | | GOV.UK One Login client ID |
| `OIDC_PRIVATE_KEY` | prod | | Private key for OIDC |
| `OIDC_AUTHORIZE_REDIRECT_URL` | prod | | OIDC callback URL |
| `OIDC_POST_LOGOUT_REDIRECT_URL` | prod | | Post-logout URL |
| `AUTH_VECTOR_OF_TRUST` | prod | `Cl.Cm` | OIDC vtr parameter |
| `UI_LOCALES` | prod | `en` | OIDC ui_locales |
| `TMC_PASSWORD` | prod | | Service-level beta password |
| `TMC_PASSWORD_EXPIRATION_IN_MINUTES` | prod | `1440` | Password session lifetime |
| `TMC_QUICK_EXIT_WINDOW_SECS` | | `5` | Quick exit key window |
| `GOOGLE_TAG_MANAGER_ID` | prod | `GTM-xxxxxxxxxxx` | GTM container ID |
| `GOOGLE_ANALYTICS_ID` | prod | `G-xxxxxxxxxxxx` | GA4 measurement ID |
| `RATE_LIMIT_MAX_REQUESTS` | | `300` | Requests per window |
| `RATE_LIMIT_WINDOW_SECS` | | `300` | Rate limit window (seconds) |
| `TMC_AWS_SECRET_MANAGER_ENABLED` | | `true` | Enable AWS Secrets Manager |
| `TMC_AWS_SECRET_MANAGER_NAME` | prod | | AWS secret name |
| `TMC_AWS_REGION` | prod | | AWS region |
| `REDIS_ENABLED` | | `false` | Enable Redis session store |
| `NO_HTTPS` | | | Set to `true` to disable HTTPS redirect |
| `UPCOMING_MAINTENANCE` | | | Maintenance window schedule string |
| `ONGOING_MAINTENANCE` | | | Ongoing maintenance schedule string |
| `DISPLAY_HEARING_DATE_TYPE` | prod | `false` | Feature flag: hearing date display |
| `ENVIRONMENT_NAME` | | | Banner label (e.g. `PRE-PRODUCTION`) |

---

## Project Structure

```
.
├── server/
│   ├── app.ts                          # Express app — middleware chain
│   ├── server.ts                       # Entry point — starts server, loads AWS secrets
│   ├── config.ts                       # All environment config (strongly typed)
│   ├── awsSecretsLoader.ts             # AWS Secrets Manager loader
│   ├── constants/
│   │   └── paths.ts                    # All route path constants
│   ├── routes/                         # Route definitions
│   │   ├── index.ts
│   │   ├── caseRoutes.ts
│   │   ├── cookiesRoutes.ts
│   │   ├── healthRoutes.ts
│   │   ├── oneLoginRoutes.ts
│   │   └── prometheusRoutes.ts
│   ├── controllers/                    # Request handlers
│   ├── services/                       # Business logic + Prometheus service
│   ├── data/
│   │   └── trackMyCaseApiClient.ts     # HTTP client for downstream API
│   ├── middleware/
│   │   ├── setUpGovukOneLogin.ts       # OIDC / Passport
│   │   ├── setUpWebSecurity.ts         # Helmet + CSP
│   │   ├── setUpWebSession.ts          # Session config
│   │   ├── setUpStaticResources.ts     # Static file serving + compression
│   │   ├── setUpReqUrlParser.ts        # URL normalisation
│   │   ├── setUpRateLimit.ts           # Rate limiting
│   │   ├── setUpGtm.ts                 # Google Tag Manager
│   │   ├── setUpPrometheus.ts          # Prometheus middleware
│   │   ├── setUpCsrf.ts                # CSRF protection
│   │   ├── setUpi18n.ts                # i18next setup
│   │   └── nunjucksSetup.ts            # Nunjucks view engine
│   ├── helpers/
│   │   └── authenticatedUser.ts        # AuthenticatedUser + PasswordAuthenticated guards
│   ├── interfaces/
│   │   └── caseDetails.ts              # Zod schemas — API response shapes
│   ├── locales/                        # Translation files
│   │   ├── common/  en.json  cy.json
│   │   ├── cookies/ en.json  cy.json
│   │   └── case/    …
│   └── views/
│       ├── layout/
│       │   ├── public.njk              # Base layout (unauthenticated)
│       │   └── citizen-authenticated.njk
│       ├── pages/                      # Full page templates
│       └── partials/
│           ├── cookie-banner.njk
│           ├── is-this-page-useful-feedback.njk
│           ├── quick-exit.njk
│           └── service-shut-down-banner.njk
│
├── assets/
│   ├── scss/
│   │   ├── index.scss
│   │   └── overrides/
│   │       └── _local.scss             # Custom overrides (shutdown banner, quick exit, etc.)
│   └── js/
│
├── esbuild/
│   └── esbuild.config.js               # Build pipeline
│
└── dist/                               # Compiled output (not committed)
```
