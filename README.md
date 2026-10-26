# Artist Site

A minimalist portfolio website for an artist. Full-stack TypeScript monorepo — Node.js + Express + PostgreSQL backend, React + Vite frontend.

# Project structure

artist-site/
¬backend/ -node.js + Express + Typescript

¬seed.ts -sample data dev

## Tech stack

| Layer             | Technology                    |
| ----------------- | ----------------------------- |
| Backend runtime   | Node.js + TypeScript          |
| Backend framework | Express                       |
| Database          | PostgreSQL                    |
| Database client   | pg                            |
| Frontend          | React 18 + TypeScript         |
| Build tool        | Vite                          |
| Styling           | Plain CSS + custom properties |
| HTTP client       | Axios                         |
| Routing           | React Router DOM v6           |
| Auth              | JSON Web Tokens               |

---

## Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a connection string from Supabase)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/Esther-FaBer/Artist-site
cd artist-site

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure the backend environment

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/artist_site"
PORT=4000
NODE_ENV=development


FRONTEND_URL=http://localhost:5173
```

### 3. Set up the database

```bash
cd backend

# Create the database (if it doesn't exist yet)
psql -U postgres -c "CREATE DATABASE artist_site;"

# Create all tables
npm run db:setup

# Seed with example data
npm run db:seed
```

### 4. Start the backend

```bash
cd backend
npm run dev
# Running at http://localhost:4000
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
# Running at http://localhost:5173
```

Vite proxies all `/api/*` requests to `http://localhost:4000` automatically — no CORS configuration needed in development.

---

## Backend scripts

```bash
npm run dev # Start dev server with hot reload (nodemon + ts-node)
npm run build # Compile TypeScript to dist/
npm run db:setup # Create all database tables
npm run db:seed # Populate with example data
```

> Run all backend scripts from inside the `backend/` directory.

---

> Run all backend scripts from inside the `backend/` directory.

---

## API endpoints

### Artworks

```
GET  /api/artworks                       All artworks, paginated
GET  /api/artworks?seriesSlug=etchings   Filter by series
GET  /api/artworks?seriesSlug=studies    Filter by series
GET  /api/artworks?isFeatured=true       Featured works (landing page)
GET  /api/artworks/series                All series
GET  /api/artworks/:slug                 Single artwork
```

### Bio

```
GET  /api/bio                            All bio sections, ordered
```

### Exhibitions

```
GET  /api/exhibitions                    All exhibitions, newest first
GET  /api/exhibitions/current            Currently featured exhibition
```

### Posts

```
GET  /api/posts                          Published posts only
GET  /api/posts?type=PRESS               Filter by type
GET  /api/posts/:slug                    Single post with full body
```

### Contact

```
POST /api/contact                        Submit an enquiry
```

### Health check

```
GET  /health                             Returns { status: "ok" }
```

---
