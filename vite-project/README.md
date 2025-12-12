# Raku Clothing – Full Stack Setup

A beginner-friendly guide to run the Raku front end (Vite/React), the starter backend API (Express), and Postgres on Render/Railway, plus Vercel deployment notes.

## What’s inside
- Frontend: `vite-project/` (Vite + React + Tailwind classes)
- Backend: `vite-project/server/` (Express API with in-memory data; Postgres-ready env placeholders)
- Shared state: cart/wishlist context with optional API sync (set `VITE_API_URL`)

## Prerequisites
- Node 18+
- npm
- (For backend DB) Postgres instance on Render/Railway

## Frontend (local)
```bash
cd vite-project
npm install
npm run dev    # starts Vite at http://localhost:5173
```
Optional: create `.env` with `VITE_API_URL=http://localhost:3000` to point at the backend.

## Backend API (local)
```bash
cd vite-project/server
npm install
cp .env.example .env   # set CORS_ORIGIN=http://localhost:5173
npm run dev            # starts API at http://localhost:3000
```
Routes (in-memory by default):
- `GET /api/health`
- `GET /api/products`
- `GET/POST/PATCH/DELETE /api/cart`
- `GET/POST/DELETE /api/wishlist`
- `POST /api/checkout` (creates an order from cart; empties cart)
- `POST /api/auth/signup` / `POST /api/auth/login` (basic JWT auth, in-memory or Postgres)
- `GET /api/orders` (lists orders; requires auth)
- `POST /api/checkout` (creates an order from cart; empties cart)

If `DATABASE_URL` is set, Prisma will use Postgres instead of in-memory storage.

## How state works
- Frontend cart/wishlist uses React context with localStorage.
- If `VITE_API_URL` is set, it also calls the API for cart/wishlist operations (best effort; falls back to local on errors).
- Add-to-cart modal on the product page shows “Items purchased together”.

## Deploying the frontend to Vercel
- Build: `npm run build`
- Output: `dist`
- Env var: `VITE_API_URL=https://your-api.onrender.com`

## Deploying the backend to Render/Railway
1) Push repo to GitHub.
2) Create a new web service from `vite-project/server`.
3) Set env vars:
   - `PORT` (platform provides)
   - `CORS_ORIGIN=https://your-frontend.vercel.app`
   - `DATABASE_URL` (from managed Postgres)
   - `JWT_SECRET` (for future auth)
4) Deploy; API will run in-memory unless you add DB integration.

## Adding Postgres (future step)
- Provision Postgres on Render/Railway; copy the connection string into `DATABASE_URL`.
- Prisma schema is included at `server/prisma/schema.prisma`.
- In `/server` run:
  - `npm run db:generate` (Prisma client)
  - `npm run db:migrate` (create tables locally)
  - `npm run db:seed` (load sample products)
- On Render/Railway, run `npm run db:deploy` then `npm run db:seed` as a one-off job after setting `DATABASE_URL`.

## Basic commands
- Frontend dev: `npm run dev`
- Frontend build: `npm run build`
- Backend dev: `npm run dev` (inside `/server`)
- Backend start: `npm start`

## Where to adjust data
- Frontend products/images live in `public/` and page components.
- Backend sample products: `server/src/data/products.json` (used for `/api/products`).

## Next improvements
- Tests/CI: lint + a few unit tests for cart context/API client.
- Image optimization/lazy loading for all grids (partial lazy already in place).
