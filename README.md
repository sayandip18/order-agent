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

## Database

Start the Postgres container:

```bash
docker compose up -d
```

Stop the Postgres container:

```bash
docker compose down
```

Stop and remove all data (wipes the volume):

```bash
docker compose down -v
```

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

| Method | Path         | Description          |
|--------|--------------|----------------------|
| GET    | /items       | Fetch all items      |
| GET    | /items/:id   | Fetch item by ID     |
