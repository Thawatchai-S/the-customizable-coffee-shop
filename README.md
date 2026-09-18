# The Customizable Coffee Shop — Monorepo

A repo holding two independent apps — a React frontend and an Express
backend. Each app is self-contained (its own `package.json` and
`package-lock.json`, no shared workspace) and runs primarily via Docker.

## Structure

```
apps/
  web/   React 19 + Tailwind CSS v4 (Vite)
  api/   Express 5 backend, organized in Clean Architecture layers
```

## Requirements

- Docker + Docker Compose
- Node.js v26+ (only if running an app outside Docker)
- PostgreSQL (for the API's database layer)

## Running with Docker

Each app has its own Dockerfile and builds as an independent image from its
own directory as the build context; `docker-compose.yml` runs them together:

```bash
docker compose up --build
# web:  http://localhost:8080
# api:  http://localhost:3000/api/health
```

- `web` is built to a static bundle and served by nginx, which proxies
  `/api/*` to the `api` service (configurable via the `API_HOST`/`API_PORT`
  env vars baked into `apps/web/nginx.conf.template`).
- `api` connects to Postgres via `DATABASE_URL`. The compose file currently
  points it at an external `postgres` container (network `db_default`,
  declared as `external: true`) rather than managing its own `db` service —
  adjust `DATABASE_URL`/`networks` in `docker-compose.yml` if your Postgres
  setup differs.
- Copy `.env.example` to `.env` at the repo root to override ports/credentials.

To build a single app's image standalone:

```bash
docker build -t coffee-shop-api apps/api
docker build -t coffee-shop-web apps/web
```

## Running without Docker

```bash
cd apps/api && npm install && npm run dev   # http://localhost:3000
cd apps/web && npm install && npm run dev   # http://localhost:5173
```

The web app dev server proxies `/api/*` requests to the backend (see
`apps/web/vite.config.js`), so `fetch('/api/health')` from the frontend
resolves against the Express server during development. Copy
`apps/api/.env.example` to `apps/api/.env` and adjust as needed.

## Backend architecture

`apps/api/src` is organized by feature module, each split into three layers
inspired by NestJS's Clean Architecture conventions:

```
modules/<feature>/
  domain/          entities and repository interfaces — no framework code
  application/     use-cases that orchestrate domain logic
  infrastructure/  Express controllers/routes, Drizzle repositories, etc.
```

Cross-cutting concerns (logging, database client, HTTP client, error types,
middlewares) live in `src/shared`. See `modules/health` for a minimal
end-to-end example of the pattern.

### Master data (`modules/master-data`)

Base drinks, syrups, toppings, and sizes live in Postgres, seeded from a
JSON file rather than hardcoded:

```bash
cd apps/api
npm run db:generate   # regenerate SQL migration from the Drizzle schema
npm run db:migrate    # apply migrations
npm run db:seed       # read master-data.seed.json and upsert into Postgres
```

- Source data: `src/modules/master-data/infrastructure/database/data/master-data.seed.json`
- Seeding is idempotent (upsert on conflict), safe to re-run.
- `GET /api/master-data` returns `{ baseDrinks, syrups, toppings, sizes }`.

### Drinks (`modules/drinks`) — Sprint 1, Tasks 1 & 2

Builds a drink from a base + any number of syrups/toppings (duplicates
allowed) + exactly one size, validated against master data, and produces a
human-readable description.

Syrups and toppings are treated uniformly as `Ingredient` customizations
(rather than one subclass per ingredient) via a `DrinkBuilder`
(`domain/builders/DrinkBuilder.js`), so adding a new syrup or topping later
is a master-data row, not a code change. Customizations are sent/stored as
`{ name, count }` (e.g. `{"name":"Vanilla","count":2}`) rather than a
flat array with repeated entries — the `DrinkBuilder` merges repeated
`addCustomization` calls into one `{ ingredient, count }` entry:

```bash
curl -X POST http://localhost:3000/api/drinks \
  -H "Content-Type: application/json" \
  -d '{"base":"Coffee","size":"Large","customizations":[{"name":"Vanilla","count":2},{"name":"Whipped Cream","count":1}]}'
```

```json
{
  "base": { "name": "Coffee", "...": "..." },
  "size": { "name": "Large", "...": "..." },
  "customizations": [{ "ingredient": { "name": "Vanilla" }, "count": 2 }, { "ingredient": { "name": "Whipped Cream" }, "count": 1 }],
  "description": "Large Coffee, Vanilla, Vanilla, Whipped Cream"
}
```

`Drink.describe()` (`domain/entities/Drink.js`) expands the counts back out
to produce the description string required by Task 2 — it deliberately
repeats each ingredient rather than using the `xN` shorthand, matching the
assignment's example output.

Invalid names (unknown base/size, or a base used as a customization) or a
non-positive-integer `count` return `422` with an `issues` array. Unit
tests for the builder and description: `cd apps/api && npm test`.

The frontend (`apps/web/src/features/drinks`) sends counts directly from its
+/− quantity controls and renders both a grouped summary (`Vanilla x2`) and
the raw `description` string from the API.

### Orders (`modules/orders`) — Sprint 1, Task 3

Places an order containing one or more drinks and returns an itemized
receipt with a grand total:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"drinks":[{"base":"Coffee","size":"Large","customizations":[{"name":"Vanilla","count":2}]},{"base":"Tea","size":"Small"}]}'
```

```json
{
  "items": [
    { "description": "Large Coffee, Vanilla, Vanilla", "price": 0, "...": "..." },
    { "description": "Small Tea", "price": 0, "...": "..." }
  ],
  "grandTotal": 0
}
```

Pricing rules aren't defined yet (Sprint 2, currently commented out in
`AGENT.md`), so every line item and the grand total are `0` for now via a
`PlaceholderPricingCalculator` behind a `PricingCalculator` port
(`domain/pricing`). Swapping in real pricing later is a new
`PricingCalculator` implementation — `Order`/`OrderItem` and the receipt
shape don't change.

`PlaceOrder` reuses the `drinks` module's `BuildDrink` use-case for each
drink and validates the whole order atomically: if any drink is invalid the
whole request is rejected with `422` and one issue per bad drink (e.g.
`"Drink 2: \"Espresso\" is not a valid base drink"`), rather than partially
placing the order. Master data is fetched once per order (not once per
drink) via an `InMemoryMasterDataRepository`.

The frontend (`apps/web/src/features/orders/OrderCart.jsx`) is a cart: each
drink built in the drink builder gets an "Add to Order" button; the cart
lists added drinks with a remove option, and "Place Order" shows the
itemized receipt returned by the API.

## Tooling

| Concern       | Library      |
| -------------- | ------------ |
| HTTP framework | express      |
| Validation     | valibot      |
| Logging        | winston      |
| ORM            | drizzle-orm (+ drizzle-kit) |
| HTTP client    | undici       |
| Postgres driver| pg           |
