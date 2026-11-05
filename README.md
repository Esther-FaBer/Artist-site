# Artist Site

A minimalist portfolio website for an artist. Full-stack TypeScript monorepo — Node.js + Express + PostgreSQL backend, React + Vite frontend.

# Project structure

artist-site/
├── backend/ Node.js + Express + TypeScript + pg
│ ├── src/
│ │ ├── index.ts App entry point — wires middleware and routes
│ │ ├── db/
│ │ │ ├── schema.ts Creates all database tables
│ │ │ └── seed.ts Example data for development
│ │ ├── lib/
│ │ │ └── db.ts PostgreSQL connection pool
│ │ ├── middleware/
│ │ │ ├── auth.ts JWT authentication for protected routes
│ │ │ └── errorHandler.ts Global error handler
│ │ ├── routes/
│ │ │ ├── artworks.ts GET /api/artworks
│ │ │ ├── bio.ts GET /api/bio
│ │ │ ├── exhibitions.ts GET /api/exhibitions
│ │ │ ├── posts.ts GET /api/posts
│ │ │ └── contact.ts POST /api/contact
│ │ └── types/
│ │ └── index.ts Shared TypeScript types
│ ├── .env.example
│ ├── nodemon.json
│ ├── package.json
│ └── tsconfig.json
│
└── frontend/ React 18 + TypeScript + Vite + plain CSS
├── src/
│ ├── main.tsx React entry point
│ ├── App.tsx Router and sidebar layout
│ ├── api.ts All API calls in one place
│ ├── components/
│ │ ├── Sidebar.tsx Persistent left navigation
│ │ └── Sidebar.css
│ ├── pages/
│ │ ├── LandingPage.tsx Homepage
│ │ ├── EtchingsPage.tsx Scroll-based finished works
│ │ ├── StudiesPage.tsx Scroll-based process work
│ │ ├── AboutPage.tsx Bio, CV and exhibitions
│ │ ├── NewsPage.tsx External press links
│ │ ├── PostPage.tsx Single post
│ │ └── ContactPage.tsx Enquiry form
│ ├── styles/
│ │ └── global.css Design tokens and base reset
│ └── types/
│ └── index.ts TypeScript types mirroring the database
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts

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
```

### Posts

```
GET  /api/posts                          Published posts only
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

### Deployment

```
Database (Supabase)
  1. Create a new project at supabase.com
  2. Go to Project Settings → Database → Connection string → URI
  3. Copy the connection string — it looks like:
     postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
  4. Run your migrations against it:
     psql [your-supabase-connection-string] -f backend/src/db/schema.sql
  5. Optionally seed it:
     psql [your-supabase-connection-string] -f backend/src/db/seed.sql
```
