# Raku Clothing – Full Project Guide

A simple, step-by-step guide to run, use, and deploy the full stack (frontend + backend + Postgres) for this clothing shop.

## Contents
- Frontend: `vite-project/` (Vite + React, Tailwind classes)
- Backend: `vite-project/server/` (Express API, Prisma, Postgres; falls back to in-memory if no DB)
- Auth: Signup/login with JWT; protected cart/wishlist/checkout/orders
- Orders: Stores shipping + tax, visible in Profile with order detail modal

---
## Tech Stack & Structure
- Frontend: Vite + React (JSX), Tailwind utility classes, state via React Context (cart, wishlist, auth), toasts, API client in `src/lib/api.js`.
  - Key dirs: `src/pages` (Home, Men, Women, Product, Cart, Checkout, Profile, Auth), `src/components` (Layout/Nav/Footer), `src/context` (Store/Auth/Toast), `public` (images/assets).
- Backend: Node + Express, Prisma ORM, Postgres (with in-memory fallback if `DATABASE_URL` is missing).
  - Key files: `/server/src/index.js` (API), `/server/src/db.js` (DB helpers), `/server/prisma/schema.prisma` (models), `/server/src/data/products.json` (seed).
- Auth: JWT-based (`/api/auth/signup`, `/api/auth/login`), token stored in localStorage, sent on API calls.
- Orders/Checkout: Checkout sends shipping + tax, creates orders; Profile shows orders with detail modal.
- CI: GitHub Actions build workflow in `.github/workflows/ci.yml`.

---
## Prerequisites
- Node.js 18+ and npm
- A Postgres URL (example below uses Railway TCP proxy)

---
## Backend (API) – Local Setup
```bash
cd vite-project/server
npm install
cp .env.example .env
```
Edit `.env` (example):
```
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:CxTxMdVAShYHIZGjpiVeccqsGFGxtoyj@interchange.proxy.rlwy.net:18254/railway
JWT_SECRET=your-secret
NODE_ENV=development
```
Prisma (only needed after schema changes):
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```
Start API:
```bash
npm run dev   # http://localhost:3000
```
Main routes (JWT required for cart/wishlist/checkout/orders):
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/products`
- `GET/POST/PATCH/DELETE /api/cart`
- `GET/POST/DELETE /api/wishlist`
- `POST /api/checkout`
- `GET /api/orders`

---
## Frontend – Local Setup
```bash
cd vite-project
npm install
```
Create `.env`:
```
VITE_API_URL=http://localhost:3000
```
Start Vite:
```bash
npm run dev   # usually http://localhost:5173 (or 5174 if busy)
```

---
## How to Use (local)
1) Open the frontend URL.
2) Go to `auth` page and sign up/log in.
3) Browse Men/Women/Product, add to cart or wishlist.
4) Cart → Checkout: fill shipping; order is created with tax/shipping saved.
5) Profile: see orders, shipping details, and click an order to view details.

---
## Deployment (summary)
**Frontend (Vercel)**  
- Build: `npm run build`  
- Output: `dist`  
- Env: `VITE_API_URL=https://your-backend.example.com`

**Backend (Railway/Render)**  
- Deploy `/server`  
- Env vars: `DATABASE_URL`, `CORS_ORIGIN` (your frontend URL), `JWT_SECRET`, `PORT` (platform)  
- One-time: `npm run db:deploy` then `npm run db:seed`

---
## Common Commands
- Frontend dev: `npm run dev`
- Frontend build: `npm run build`
- Backend dev: `npm run dev` (inside `/server`)
- Backend start (prod): `npm start`
- Prisma (backend): `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`

---
## Data & Assets
- API seed products: `server/src/data/products.json`
- Frontend images/assets: `vite-project/public/...`

---
## Troubleshooting
- Blank page: ensure Vite is running and use the port shown in terminal; confirm `VITE_API_URL` is set.
- Auth/cart errors: backend must be running; log in again to refresh JWT.
- DB errors: verify `DATABASE_URL` points to a reachable Postgres; rerun migrate/seed.

---
## What’s Implemented
- JWT auth; protected cart/wishlist/checkout/orders.
- Orders store shipping + tax; Profile shows order detail modal.
- Men/Women/featured use API products (with fallback).
- Basic SEO meta + OG/Twitter defaults; lazy-loaded heavy images.
- CI build workflow: `.github/workflows/ci.yml`.

---
## Nice-to-haves (not yet)
- Payments, address book, password reset.
- Per-page OG images and richer analytics/logging.
- Accessibility polish for draggable strips and custom controls.
- Tests/CI for lint/unit/integration.
