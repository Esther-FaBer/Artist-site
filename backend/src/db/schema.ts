import { query } from "../lib/db";

async function createTables() {
  console.log("Creating tables...");

  await query(`
    CREATE TABLE IF NOT EXISTS media (
      id    SERIAL PRIMARY KEY,
      name  VARCHAR(100) NOT NULL UNIQUE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS series (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(200) NOT NULL,
      slug        VARCHAR(200) NOT NULL UNIQUE,
      description TEXT,
      cover_image TEXT,
      created_at  TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS artworks (
      id            SERIAL PRIMARY KEY,
      title         VARCHAR(200) NOT NULL,
      slug          VARCHAR(200) NOT NULL UNIQUE,
      year          INTEGER NOT NULL,
      image_url     TEXT NOT NULL,
      thumbnail_url TEXT,
      width_cm      DECIMAL(6,1),
      height_cm     DECIMAL(6,1),
      description   TEXT,
      status        VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
                    CHECK (status IN ('AVAILABLE','SOLD','NOT_FOR_SALE','RESERVED')),
      price         DECIMAL(10,2),
      is_featured   BOOLEAN DEFAULT FALSE,
      medium_id     INTEGER REFERENCES media(id) ON DELETE SET NULL,
      series_id     INTEGER REFERENCES series(id) ON DELETE SET NULL,
      created_at    TIMESTAMP DEFAULT NOW(),
      updated_at    TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS exhibitions (
      id             SERIAL PRIMARY KEY,
      title          VARCHAR(200) NOT NULL,
      slug           VARCHAR(200) NOT NULL UNIQUE,
      type           VARCHAR(20) NOT NULL DEFAULT 'SOLO'
                     CHECK (type IN ('SOLO','GROUP','FAIR','RESIDENCY')),
      venue_name     VARCHAR(200) NOT NULL,
      venue_city     VARCHAR(100) NOT NULL,
      venue_country  VARCHAR(100) NOT NULL,
      venue_website  TEXT,
      description    TEXT,
      image_url      TEXT,
      start_date     DATE NOT NULL,
      end_date       DATE NOT NULL,
      is_featured    BOOLEAN DEFAULT FALSE,
      press_release  TEXT,
      created_at     TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS artwork_exhibitions (
      artwork_id    INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
      exhibition_id INTEGER NOT NULL REFERENCES exhibitions(id) ON DELETE CASCADE,
      PRIMARY KEY (artwork_id, exhibition_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS bio_sections (
      id            SERIAL PRIMARY KEY,
      category      VARCHAR(30) NOT NULL
                    CHECK (category IN (
                      'EDUCATION','SOLO_EXHIBITION','GROUP_EXHIBITION',
                      'AWARD','RESIDENCY','COLLECTION','PRESS'
                    )),
      year          VARCHAR(20),
      description   TEXT NOT NULL,
      display_order INTEGER DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS tags (
      id    SERIAL PRIMARY KEY,
      name  VARCHAR(50) NOT NULL UNIQUE,
      slug  VARCHAR(50) NOT NULL UNIQUE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS posts (
      id           SERIAL PRIMARY KEY,
      title        VARCHAR(200) NOT NULL,
      slug         VARCHAR(200) NOT NULL UNIQUE,
      body         TEXT NOT NULL,
      excerpt      TEXT,
      cover_image  TEXT,
      type         VARCHAR(20) NOT NULL DEFAULT 'NEWS'
                   CHECK (type IN ('NEWS','PRESS','TEXT')),
      status       VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                   CHECK (status IN ('DRAFT','PUBLISHED')),
      published_at TIMESTAMP,
      created_at   TIMESTAMP DEFAULT NOW(),
      updated_at   TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS post_tags (
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id                       SERIAL PRIMARY KEY,
      customer_name            VARCHAR(200) NOT NULL,
      customer_email           VARCHAR(200) NOT NULL,
      shipping_address         TEXT NOT NULL,
      stripe_payment_intent_id TEXT,
      status                   VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                               CHECK (status IN (
                                 'PENDING','PAID','PROCESSING',
                                 'SHIPPED','COMPLETE','CANCELLED','REFUNDED'
                               )),
      total                    DECIMAL(10,2) NOT NULL,
      notes                    TEXT,
      created_at               TIMESTAMP DEFAULT NOW(),
      updated_at               TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id                SERIAL PRIMARY KEY,
      order_id          INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      artwork_id        INTEGER NOT NULL REFERENCES artworks(id) ON DELETE RESTRICT,
      price_at_purchase DECIMAL(10,2) NOT NULL,
      quantity          INTEGER NOT NULL DEFAULT 1
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      email       VARCHAR(200) NOT NULL,
      type        VARCHAR(20) NOT NULL DEFAULT 'GENERAL'
                  CHECK (type IN (
                    'GENERAL','PURCHASE','COMMISSION','PRESS','COLLABORATION'
                  )),
      subject     VARCHAR(300) NOT NULL,
      message     TEXT NOT NULL,
      artwork_id  INTEGER REFERENCES artworks(id) ON DELETE SET NULL,
      is_read     BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("All tables created.");
}

createTables()
  .catch((err) => {
    console.error("Failed to create tables:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
