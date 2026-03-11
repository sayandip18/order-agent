# Order Agent

A monorepo containing a NestJS API and a web frontend.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

---

## Setup

Install all dependencies from the repo root:

```bash
npm install
```

---

## Infrastructure (Docker)

Start Postgres and Redis:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

Stop and remove all data (wipes volumes):

```bash
docker compose down -v
```

---

## Environment Variables

The API reads the following environment variables (all have defaults for local dev):

| Variable         | Default            | Description                  |
|------------------|--------------------|------------------------------|
| `PORT`           | `3000`             | API port                     |
| `DB_HOST`        | `localhost`        | Postgres host                |
| `DB_PORT`        | `5432`             | Postgres port                |
| `DB_USER`        | `postgres`         | Postgres user                |
| `DB_PASSWORD`    | `postgres`         | Postgres password            |
| `DB_NAME`        | `order_agent`      | Postgres database name       |
| `REDIS_HOST`     | `localhost`        | Redis host                   |
| `REDIS_PORT`     | `6379`             | Redis port                   |
| `SESSION_SECRET` | `change-this-secret` | Secret for signing sessions |

---

## Development

Run both the API and web app together:

```bash
npm run dev
```

Run only the API:

```bash
npm run api
```

Run only the web app:

```bash
npm run web
```

---

## Build

Build both apps:

```bash
npm run build
```

---

## API Endpoints

### Items

| Method | Path         | Description      |
|--------|--------------|------------------|
| GET    | /items       | Fetch all items  |
| GET    | /items/:id   | Fetch item by ID |

### Cart

Cart state is stored server-side in Redis, scoped to the user's session cookie.

| Method | Path             | Body                              | Description               |
|--------|------------------|-----------------------------------|---------------------------|
| GET    | /cart            | —                                 | Get current cart          |
| POST   | /cart            | `{ "itemId": "", "quantity": 1 }` | Add item to cart          |
| DELETE | /cart/:itemId    | —                                 | Remove an item from cart  |
| DELETE | /cart            | —                                 | Clear entire cart         |
