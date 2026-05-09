# Backend (Online Judge)

This is the Node.js/Express backend for the Online Judge.

It provides:
- Auth: register/login/profile/admin checks
- Problems API: list/get/add/delete problems
- Judge API: run code and submit against hidden testcases
- AI review: code review endpoint (Gemini)

## Requirements

- Node.js (recommended: latest LTS)
- MongoDB (two databases / two connection strings)
- C++ toolchain for judging C++ submissions:
  - Windows: MinGW-w64 `g++` available in `PATH`
  - Linux (Dockerfile already installs): `g++`
- Python for judging Python submissions

## Environment variables

Create a `.env` file inside `backend/`:

```env
# Auth DB (users)
MONGODB_URL=mongodb+srv://...

# Problems DB (problem statements + testcases)
MONGO_DB_PROBLEMS=mongodb+srv://...

# JWT
JWT_SECRET=your_secret

# AI (Gemini)
GEMINI_API_KEY=your_key

# Optional
PORT=5000
```

## Install

From the repo root:

```bash
cd backend
npm install
```

## Run (development)

From `backend/`:

```bash
npx nodemon index.js
```

## Run (production)

From `backend/`:

```bash
node index.js
```

## Docker

Build and run:

```bash
cd backend
docker build -t online-judge-backend .
docker run --rm -p 5000:5000 --env-file .env online-judge-backend
```

Notes:
- The Docker image installs `python3` and `g++` for code execution.

## API overview (paths preserved)

### Auth
- `POST /register`
- `POST /login`
- `GET /profile` (Bearer token)
- `GET /adminpanel` (Bearer token + admin)

### Problems
- `GET /api/problems`
- `GET /api/problems/:id` (uses `problemId`, not Mongo `_id`)
- `POST /api/problems` (admin)
- `DELETE /api/problems/:id` (admin)

### Judge
- `POST /api/run` (auth)
- `POST /api/submit` (auth)

### AI review
- `POST /ai-review`

## Project structure (v2)

Entry points:
- `index.js`: stable entrypoint (good for nodemon)
- `src/server.js`: connects DBs + starts the server
- `src/app.js`: Express app, middleware, and route mounting

Feature modules:
- `src/modules/auth/*`: auth routes
- `src/modules/problems/*`: problems CRUD
- `src/modules/judge/*`: run + submit (controller/service)
- `src/modules/ai/*`: Gemini code review

Shared code:
- `src/models/*`: Mongoose models
- `src/middleware/*`: auth middleware

DB connectors:
- `src/db/authDb.js`: users/auth DB connection
- `src/db/problemsDb.js`: problems DB connection

Legacy notes:
- `compiler/*` is kept as a compatibility wrapper; the active implementation lives in `src/compiler` and is used by `src/modules/judge`.

## Quick health checks

- Server root (may serve frontend static if available):
  - `GET /`
- Problems DB sanity check:
  - `GET /test-problems`
