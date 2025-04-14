# Track My Case UI

[![repo standards badge](https://img.shields.io/endpoint?labelColor=231f20&color=005ea5&style=for-the-badge&label=MoJ%20Compliant&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fendpoint%2Ftemplate-repository&logo=data:image/png;base64,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)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#template-repository)

Frontend for the **Track My Case** service, is generated from the [Data Platform App Cloud PLatform Deployment Template](https://github.com/ministryofjustice/data-platform-app-template) and leverages the [HMPPS TypeScript Template](https://github.com/ministryofjustice/hmpps-template-typescript)  
with authentication, authorisation, and other HMPPS-specific integrations **removed** for simplicity and focus.

## To Do / Limitations

This project is currently in active development. The following are known gaps or future tasks:

- ❌ **No authentication or session-based user identity**  
  Authentication will be added later
- ❌ **No authorization / role-based access control**  
  Access to features is currently not gated by any user roles.
- ❌ **No external services or APIs integrated yet**  
  Placeholder services and mocks will be added as use cases emerge.
- ❌ **Minimal integration and unit test coverage**  
  Test scaffolding is in place, but few tests exist yet. Contributions welcome.
- 🔧 **CSRF protection errors under development mode**  
  Currently raises issues without a working session store.
- 📦 **No Redis or database integration**  
  Future work will introduce persistence and backend integrations.
- 🧪 **No E2E or Cypress tests configured yet**
- ⚙️ **No CI/CD pipeline integrated yet**
- Add `tsc -p integration_tests`

---

## Prerequisites

- Node.js `>=22`
- npm `>=10`
- Docker (for local container-based execution)

---

## Running the application

To start the app locally in development mode (with hot reloading):

```bash
npm install
npm run start:dev
```

The app will be available at:  
📍 `http://localhost:9999`

---

## Running in Docker

```bash
docker compose up --build
```

---

## Running the tests

**NOTE: Testing is limited as the base template is still being built.**

```bash
npm test
```

---

## Code style

- Code formatting: Prettier
- Linting: ESLint (with MoJ shared config)
- Git hooks: Husky

Format the codebase using:

```bash
npm run lint-fix
```

---

## Environment variables

| Name             | Required | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `BUILD_NUMBER`   | ✅       | Build identifier (e.g. GitHub Actions run number) |
| `GIT_REF`        | ✅       | Git commit SHA                                    |
| `GIT_BRANCH`     | ✅       | Git branch name                                   |
| `PRODUCT_ID`     | ✅       | Internal product identifier                       |
| `SESSION_SECRET` | ✅       | Session encryption key                            |
| `NO_HTTPS`       | ❌       | Disable HTTPS redirects for dev usage             |
| `REDIS_ENABLED`  | ❌       | Enable Redis for session storage                  |

For local use, you can set these in the `docker-compose.yml` environment block or export them directly into your shell.

---

## Architecture

This is a standard MoJ Express + TypeScript app using:

- [`express`](https://expressjs.com/)
- [`nunjucks`](https://mozilla.github.io/nunjucks/)
- [`govuk-frontend`](https://github.com/alphagov/govuk-frontend)
- [`@ministryofjustice/frontend`](https://github.com/ministryofjustice/moj-frontend)
- `esbuild` for fast bundling
- `jest` for testing

---

## Structure

```text
.
├── server/            # All application logic
│   ├── views/         # Nunjucks templates
│   ├── routes/        # Route handlers
│   ├── middleware/    # Express middleware
│   ├── utils/         # Reusable helpers
├── assets/            # JS, SCSS, and static frontend assets
├── dist/              # Compiled JS and assets (not committed)
```

---

## Deployment

The application is designed for deployment to the [MoJ Cloud Platform](https://user-guide.cloud-platform.service.justice.gov.uk/).  
It listens on port `9999` to comply with current platform requirements.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of updates and planned releases.
