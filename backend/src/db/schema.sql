
-- Media -medium
CREATE TABLE IF NOT EXISTS media (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE
);

-- Series (etchings, studies, etc.)
CREATE TABLE IF NOT EXISTS series (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Artworks
CREATE TABLE IF NOT EXISTS artworks (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(200) NOT NULL UNIQUE,
  year          INTEGER,
  image_url     TEXT,
  thumbnail_url TEXT,
  dimensions    TEXT,
  description   TEXT,
  medium_id     INTEGER REFERENCES media(id) ON DELETE SET NULL,
  series_id     INTEGER REFERENCES series(id) ON DELETE SET NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Exhibitions
CREATE TABLE IF NOT EXISTS exhibitions (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(200) NOT NULL,
  slug             VARCHAR(200) NOT NULL UNIQUE,
  exhibition_type  VARCHAR(20) NOT NULL DEFAULT 'SOLO'
                   CHECK (exhibition_type IN ('SOLO','GROUP','FAIR','RESIDENCY')),
  venue            VARCHAR(200),
  city             VARCHAR(100),
  country          VARCHAR(100),
  venue_website    TEXT,
  description      TEXT,
  image_url        TEXT,
  start_date       DATE,
  end_date         DATE,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE,
  slug  VARCHAR(50) NOT NULL UNIQUE
);

-- Posts (news, press, texts)
CREATE TABLE IF NOT EXISTS posts (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) NOT NULL UNIQUE,
  body         TEXT,
  excerpt      TEXT,
  cover_image  TEXT,
  type         VARCHAR(20) NOT NULL DEFAULT 'NEWS'
               CHECK (type IN ('NEWS','PRESS','TEXT')),
  status       VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
               CHECK (status IN ('DRAFT','PUBLISHED')),
  author       VARCHAR(200),
  source_url   TEXT,
  published_at TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- Post ↔ Tag join table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Bio and CV sections
CREATE TABLE IF NOT EXISTS bio (
  id            SERIAL PRIMARY KEY,
  section_type  TEXT NOT NULL CHECK (section_type IN ('BIO', 'CV')),
  heading       TEXT,
  body          TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Enquiries (contact form submissions)
CREATE TABLE IF NOT EXISTS enquiries (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL,
  enquiry_type  VARCHAR(20) NOT NULL DEFAULT 'GENERAL'
                CHECK (enquiry_type IN ('GENERAL','PURCHASE','COMMISSION','PRESS')),
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW()
);