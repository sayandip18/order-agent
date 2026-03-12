# Order Agent

A monorepo containing a NestJS API and a React web frontend.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [ngrok](https://ngrok.com/) (for Google OAuth in local dev)

---

## Setup

Install all dependencies from the repo root:

```bash
npm install
```

---

## Infrastructure (Docker)

Postgres and Redis run via Docker Compose.

Start containers:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

Stop and wipe all data (removes volumes):

```bash
docker compose down -v
```

---

## Environment Variables

Create `apps/api/.env` with the following variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://<your-ngrok-subdomain>.ngrok-free.app/auth/google/callback

# Bolna
BOLNA_API_KEY=your-bolna-api-key

# Optional overrides (these default to local dev values if omitted)
# PORT=3000
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_NAME=order_agent
# REDIS_HOST=localhost
# REDIS_PORT=6379
# SESSION_SECRET=change-this-secret
# FRONTEND_URL=http://localhost:5173
```

### Google OAuth & ngrok

Google OAuth requires a publicly reachable callback URL. In local dev, use ngrok to tunnel the API port:

```bash
ngrok http 3000
```

Copy the generated HTTPS URL (e.g. `https://abc123.ngrok-free.app`) and set:

```env
GOOGLE_CALLBACK_URL=https://abc123.ngrok-free.app/auth/google/callback
```

Also add this URL to the **Authorized redirect URIs** list in your [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 credentials.

---

## Running Locally

Run both the API and web app:

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

The web app is available at `http://localhost:5173` and the API at `http://localhost:3000`.

---

## Build

```bash
npm run build
```
