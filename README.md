# Track My Case UI

Frontend for the **Track My Case** service. This is an Express + TypeScript application using Nunjucks and GOV.UK Design System components.

Generated from the [Data Platform App Template](https://github.com/ministryofjustice/data-platform-app-template), based on [HMPPS TypeScript Template](https://github.com/ministryofjustice/hmpps-template-typescript) — with authentication and HMPPS integrations removed for simplicity.

---

## Prerequisites

- Node.js `>=22`
- npm `>=10`
- Docker (for local container-based execution)

---

## 🔧 Quick Start

To start the app locally in development mode (with hot reloading):

```bash
npm install
npm run start:dev
```

Visit: [http://localhost:9999](http://localhost:9999)

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

## Code style

- Code formatting: Prettier
- Linting: ESLint (with MoJ shared config)
- Git hooks: Husky

Format the codebase using:

```bash
npm run lint-fix
```

---

## 📦 Tech Stack

- [Express.js](https://expressjs.com/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [govuk-frontend](https://github.com/alphagov/govuk-frontend)
- [@ministryofjustice/frontend](https://github.com/ministryofjustice/moj-frontend)
- `TypeScript`, `esbuild`, `Jest`, `Prettier`, `ESLint`
- `esbuild` for fast bundling
- `jest` for testing

---

## 📁 Folder Structure

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

➡️ See [docs/views-structure.md](docs/views-structure.md) for full views layout.

---

## 🌍 Environment Variables

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

## 🚧 Development Status

See [docs/known-limitations.md](docs/known-limitations.md)

---

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md)
