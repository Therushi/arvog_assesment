# Product Management System

A full-stack product management system: Express (plain JS, ESM) REST API backed by
MySQL, BullMQ/Redis for background jobs (bulk CSV upload, CSV/XLSX report generation),
and an Angular 17 standalone-components frontend.

## Stack

- **Backend:** Express, raw SQL via `mysql2` (no ORM), Zod validation, JWT auth,
  BullMQ + Redis for background jobs, pino logging.
- **Frontend:** Angular 17 (standalone components, signals), Angular Material,
  Tailwind CSS, ngx-toastr.
- **Database:** MySQL 8.
- **Infra:** Docker Compose (mysql, redis, backend, frontend).

## Prerequisites

- Docker + Docker Compose (recommended), OR Node.js 20+ and a local MySQL 8 / Redis 7
  if running services outside Docker.

## Quick Start (Docker)

1. Copy the root env file and adjust as needed:

   ```bash
   cp .env.example .env
   ```

2. Build and start everything:

   ```bash
   docker compose up --build
   ```

   Starts `db` (MySQL 8), `redis`, `backend` (Express API on
   `http://localhost:3000`), and `frontend` (Angular dev server on
   `http://localhost:4200`).

3. Seed a test user and sample data (second terminal, once the backend container is
   healthy):

   ```bash
   docker compose exec backend npm run seed
   ```

   Prints the seeded credentials, e.g. `admin@test.com / password123`, plus sample
   categories/products.

4. Open `http://localhost:4200`, log in with the seeded credentials.

## API

All routes are prefixed with `API_PREFIX` (default `/api/v1`).

- Health check: `GET /api/v1/health`
- Auth: `POST /api/v1/auth/login`
- Categories: `GET|POST /api/v1/categories`, `PUT|DELETE /api/v1/categories/:id`
- Products: `GET|POST /api/v1/products`, `PUT|DELETE /api/v1/products/:id`
  (supports `?page=&limit=&sort=asc|desc&search=`)
- Bulk upload: `POST /api/v1/upload/products` (multipart `file`, CSV),
  `GET /api/v1/upload/:jobId/status`
- Reports: `POST /api/v1/reports/products` (`{format: "csv"|"xlsx", search?, sort?}`),
  `GET /api/v1/reports/:id`, `GET /api/v1/reports/:id/download`
- Dashboard: `GET /api/v1/dashboard/stats`

All protected routes require `Authorization: Bearer <token>`. Responses follow
`{ success, data, message }` on success and `{ success: false, error, code }` on error.

## Running Backend/Frontend Individually (without Docker)

### Backend

```bash
cd backend
cp .env.example .env   # point MYSQL_HOST/REDIS_HOST at localhost if running locally
npm install
npm run dev             # nodemon, http://localhost:3000
npm run seed             # seed a test user
```

### Frontend

```bash
cd frontend
npm install
npm start                # ng serve, http://localhost:4200
```

Set `apiBaseUrl` in `frontend/src/environments/environment.ts` if the backend isn't
on `http://localhost:3000/api/v1`.

## Environment Variables

See `.env.example` (root, used by Docker Compose) and `backend/.env.example` (used
when running the backend directly).

| Variable | Description |
|---|---|
| `MYSQL_HOST`/`MYSQL_PORT`/`MYSQL_DATABASE`/`MYSQL_USER`/`MYSQL_PASSWORD` | MySQL connection |
| `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD` | Redis connection (BullMQ) |
| `JWT_SECRET`/`JWT_EXPIRES_IN` | Auth token signing |
| `API_PREFIX` | API route prefix (default `/api/v1`) |
| `UPLOAD_DIR` | Directory for uploaded CSVs and generated reports (default `uploads`) |

## Background Jobs

- **Bulk upload:** `POST /upload/products` saves the CSV to disk, enqueues a job; a
  worker streams/validates/bulk-inserts rows, skipping invalid ones, cleans up the temp
  file. Poll `GET /upload/:jobId/status` for progress.
- **Reports:** `POST /reports/products` enqueues a job on the `product-report` queue;
  a worker streams matching products (same filters as the product list) into a CSV or
  XLSX file under `<UPLOAD_DIR>/reports`. Poll `GET /reports/:id` for status, then
  `GET /reports/:id/download` once `state === "completed"`.

Both queues use exponential backoff with 3 retry attempts.

## Tests

No automated test suite is included in this project (out of scope for this
assessment). Manual verification steps are documented in `plans/phase-*.md`.

## Project Structure

```
backend/
  src/
    config/       # env, db, redis, initDb
    controllers/
    services/
    routes/
    validators/    # zod schemas
    middlewares/    # auth, validation, upload (multer), error handler
    queues/         # BullMQ queue definitions
    workers/        # BullMQ worker processors
    utils/          # ApiError, response envelope, logger
    scripts/        # seed.js
frontend/
  src/app/
    auth/ category/ product/ upload/ reports/ dashboard/
    services/       # one HttpClient-owning service per feature
    guards/          # authGuard
    interceptors/    # authInterceptor
plans/              # phase-by-phase implementation plans (this repo's build log)
docker-compose.yml
```
