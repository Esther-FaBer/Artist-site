# Artist Site

A minimalist portfolio website for an artist. Built as a full-stack TypeScript monorepo — Node.js + Express + PostgreSQL backend, React + Vite frontend.

# Project structure

artist-site/
¬backend/ -node.js + Express + Typescript

¬seed.ts -sample data dev

## Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a connection string from Railway/Neon/Supabase)

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

````env
DATABASE_URL="postgresql://postgres@localhost:5432/artist_site"
PORT=4000
NODE_ENV=development

### 3. Set up the database

```bash
cd backend

# Create the database (if it doesn't exist yet)
psql -U postgres -c "CREATE DATABASE artist_site;"

# Create all tables
npm run db:setup

# Seed with example data
npm run db:seed
````

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
npm run dev        # Start dev server with hot reload (nodemon + ts-node)
npm run build      # Compile TypeScript to dist/
npm run db:setup   # Create all database tables
npm run db:seed    # Populate with example data
```

> Run all backend scripts from inside the `backend/` directory.

---

> Run all backend scripts from inside the `backend/` directory.

---
