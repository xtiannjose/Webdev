## Deployment notes (Vercel + Render/Railway + Postgres)

### Frontend (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Ensure env var for backend API when ready: `VITE_API_URL=https://your-api.example.com`
- Optional: add a minimal `vercel.json` if you need rewrites/proxy later.

### Backend (Render or Railway)
- The repo includes a starter Express API in `/server` with optional Postgres and JWT auth.
- Commands: `npm install` inside `/server`, then `npm run dev` locally, or `npm start` in production.
- Env vars:
  - `PORT` (Render provides)
  - `CORS_ORIGIN` (e.g., your Vercel domain)
  - `DATABASE_URL` (Postgres connection string; API currently uses in-memory data if omitted)
  - `JWT_SECRET` (for auth tokens)
- Protect cart/wishlist/checkout routes with `Authorization: Bearer <token>`.
- Add `VITE_API_URL` + token in the frontend to sync state across devices for logged-in users.
- Deploy from GitHub; enable auto-deploy on push. Set env vars in the dashboard.

### Database (PostgreSQL)
- Provision managed Postgres on Render/Railway.
- Save `DATABASE_URL` in backend env vars and never commit secrets.
- (Optional future step) Add Prisma/Knex migrations; current API runs in-memory if no DB is configured.

### Local env
- Create `.env` with `VITE_API_URL=http://localhost:3000` (or your backend dev URL).
- For backend, copy `/server/.env.example` to `/server/.env` and set `CORS_ORIGIN=http://localhost:5173`.
- Keep secrets out of the repo; use `.env.local` for local overrides.

### Next steps
- Wire the front end fully to the backend API (set `VITE_API_URL`).
- Add image optimization/lazy-load CDN if assets grow.
- Add basic analytics/error logging once backend exists.
