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

| Variable               | Default                                      | Description                    |
|------------------------|----------------------------------------------|--------------------------------|
| `PORT`                 | `3000`                                       | API port                       |
| `DB_HOST`              | `localhost`                                  | Postgres host                  |
| `DB_PORT`              | `5432`                                       | Postgres port                  |
| `DB_USER`              | `postgres`                                   | Postgres user                  |
| `DB_PASSWORD`          | `postgres`                                   | Postgres password              |
| `DB_NAME`              | `order_agent`                                | Postgres database name         |
| `REDIS_HOST`           | `localhost`                                  | Redis host                     |
| `REDIS_PORT`           | `6379`                                       | Redis port                     |
| `SESSION_SECRET`       | `change-this-secret`                         | Secret for signing sessions    |
| `GOOGLE_CLIENT_ID`     | —                                            | Google OAuth client ID         |
| `GOOGLE_CLIENT_SECRET` | —                                            | Google OAuth client secret     |
| `GOOGLE_CALLBACK_URL`  | `http://localhost:3000/auth/google/callback` | OAuth redirect URI             |
| `FRONTEND_URL`         | `http://localhost:5173`                      | Where to redirect after login  |

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

### Users

| Method | Path       | Body                          | Description        |
|--------|------------|-------------------------------|--------------------|
| GET    | /users     | —                             | Fetch all users    |
| GET    | /users/:id | —                             | Fetch user by ID   |
| PATCH  | /users/:id | `{ "name": "", "avatarUrl": "" }` | Update user    |

### Auth

| Method | Path                  | Description                                              |
|--------|-----------------------|----------------------------------------------------------|
| GET    | /auth/google          | Redirect to Google OAuth consent screen                  |
| GET    | /auth/google/callback | Google redirects here after consent; sets session cookie |
| GET    | /auth/me              | Returns current logged-in user                           |
| GET    | /auth/logout          | Destroys session and redirects to frontend               |
