import { query } from "../lib/db";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data

  console.log("Clearing existing data...");
  await query(`TRUNCATE TABLE
    enquiries,
    order_items,
    orders,
    post_tags,
    posts,
    tags,
    bio_sections,
    artwork_exhibitions,
    artworks,
    exhibitions,
    series,
    media
    RESTART IDENTITY CASCADE
  `);

  // Media
  console.log("Creating media...");

  const mediaResult = await query(`
    INSERT INTO media (name) VALUES
      ('Oil on linen'),
      ('Oil on canvas'),
      ('Watercolour on paper')
    RETURNING id, name
  `);

  const oilOnLinen = mediaResult.rows[0];
  const oilOnCanvas = mediaResult.rows[1];
  const watercolour = mediaResult.rows[2];

  // Series
  console.log("Creating series...");

  const seriesResult = await query(`
    INSERT INTO series (title, slug, description) VALUES
      (
        'Recent Paintings',
        'recent-paintings',
        'Paintings from 2022 to the present.'
      ),
      (
        'Studies',
        'studies',
        'Works on paper and preparatory studies.'
      )
    RETURNING id, slug
  `);

  const recentPaintings = seriesResult.rows[0];
  const studies = seriesResult.rows[1];

  // Artworks

  console.log("Creating artworks...");

  const artworksResult = await query(
    `
    INSERT INTO artworks
      (title, slug, year, image_url, thumbnail_url, width_cm, height_cm,
       description, status, price, is_featured, medium_id, series_id)
    VALUES
      (
        'Untitled I', 'untitled-i', 2024,
        'https://picsum.photos/seed/art1/800/1000',
        'https://picsum.photos/seed/art1/400/500',
        180, 220,
        'A large-scale painting exploring colour and surface.',
        'AVAILABLE', 12000, TRUE,
        $1, $2
      ),
      (
        'Untitled II', 'untitled-ii', 2023,
        'https://picsum.photos/seed/art2/900/700',
        'https://picsum.photos/seed/art2/450/350',
        150, 120,
        NULL,
        'SOLD', NULL, TRUE,
        $3, $4
      ),
      (
        'Untitled III', 'untitled-iii', 2023,
        'https://picsum.photos/seed/art3/800/900',
        'https://picsum.photos/seed/art3/400/450',
        200, 240,
        NULL,
        'AVAILABLE', 18000, TRUE,
        $1, $2
      ),
      (
        'Study in Pink', 'study-in-pink', 2022,
        'https://picsum.photos/seed/art4/600/800',
        'https://picsum.photos/seed/art4/300/400',
        30, 40,
        NULL,
        'AVAILABLE', 1200, FALSE,
        $5, $6
      ),
      (
        'Study in Blue', 'study-in-blue', 2022,
        'https://picsum.photos/seed/art5/600/800',
        'https://picsum.photos/seed/art5/300/400',
        30, 40,
        NULL,
        'AVAILABLE', 1200, FALSE,
        $5, $6
      )
    RETURNING id, title
  `,
    [
      oilOnLinen.id,
      recentPaintings.id,
      oilOnCanvas.id,
      recentPaintings.id,
      watercolour.id,
      studies.id,
    ],
  );

  const [artwork1, artwork2, artwork3] = artworksResult.rows;
  console.log(`Created ${artworksResult.rows.length} artworks`);

  // Exhibitions
  console.log("Creating exhibitions...");

  const exhibitionsResult = await query(`
    INSERT INTO exhibitions
      (title, slug, type, venue_name, venue_city, venue_country,
       description, start_date, end_date, is_featured)
    VALUES
      (
        'Recent Works',
        'recent-works-2024',
        'SOLO',
        'Gallery Name',
        'London',
        'UK',
        'A selection of new paintings exploring colour and surface.',
        '2024-09-12',
        '2024-10-26',
        TRUE
      ),
      (
        'Summer Exhibition',
        'summer-exhibition-2023',
        'GROUP',
        'Royal Academy of Arts',
        'London',
        'UK',
        NULL,
        '2023-06-13',
        '2023-08-20',
        FALSE
      )
    RETURNING id, title
  `);

  const currentShow = exhibitionsResult.rows[0];
  const groupShow = exhibitionsResult.rows[1];

  // Link artworks to exhibitions
  console.log("Linking artworks to exhibitions...");

  await query(
    `
    INSERT INTO artwork_exhibitions (artwork_id, exhibition_id) VALUES
      ($1, $2),
      ($3, $2),
      ($4, $2),
      ($3, $5)
  `,
    [artwork1.id, currentShow.id, artwork2.id, artwork3.id, groupShow.id],
  );

  // Bio sections
  console.log("Creating bio sections...");

  await query(`
    INSERT INTO bio_sections (category, year, description, display_order)
    VALUES
      ('EDUCATION',       '2022–2023', 'MFA Painting, Royal College of Art, London',      1),
      ('EDUCATION',       '2018–2021', 'BA Fine Art, Goldsmiths, University of London',   2),
      ('EDUCATION',       '2017–2018', 'Foundation in Art and Design, UAL, London',       3),
      ('AWARD',           '2023',      'Award Name',                                       1),
      ('RESIDENCY',       '2022',      'Residency Name, Location',                         1),
      ('COLLECTION',      NULL,        'Arts Council Collection, UK',                      1),
      ('COLLECTION',      NULL,        'Private collections, UK and Europe',               2)
  `);

  // Tags
  console.log("Creating tags...");

  const tagsResult = await query(`
    INSERT INTO tags (name, slug) VALUES
      ('Press',  'press'),
      ('Studio', 'studio')
    RETURNING id, name
  `);

  const pressTag = tagsResult.rows[0];
  const studioTag = tagsResult.rows[1];

  // Posts
  console.log("Creating posts...");

  const postsResult = await query(`
    INSERT INTO posts
      (title, slug, body, excerpt, type, status, published_at)
    VALUES
      (
        'On colour and surface',
        'on-colour-and-surface',
        'There is a long tradition of apologising for beauty.

The Rococo, with its silks and swags and powdered skin, has long been dismissed as decorative and trivial. But paint is a physical thing. The surface of a canvas is a real place.

When Fragonard loaded his brush and dragged it across linen, he was making decisions about pressure and speed and colour that are no different in kind from the decisions I make now.

I am not interested in reviving the Rococo. I am interested in what happens when you look at it very closely, for a long time.',
        'A reflection on the materiality of paint and the legacy of Rococo imagery.',
        'TEXT',
        'PUBLISHED',
        '2024-03-15'
      ),
      (
        'New works in progress',
        'new-works-in-progress',
        'Three new paintings are underway in the studio, all working through similar questions about light and ground.

The largest is around two metres — an unusual scale for me, and one that changes how the paint behaves.',
        'A look at what is currently on the easel.',
        'NEWS',
        'PUBLISHED',
        '2024-06-01'
      )
    RETURNING id, title
  `);

  const post1 = postsResult.rows[0];
  const post2 = postsResult.rows[1];

  // Link posts to tags
  await query(
    `
    INSERT INTO post_tags (post_id, tag_id) VALUES
      ($1, $2),
      ($3, $4)
  `,
    [post1.id, pressTag.id, post2.id, studioTag.id],
  );

  console.log("Done. Database seeded successfully.");
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
