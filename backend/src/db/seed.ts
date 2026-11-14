import { query } from "../lib/db";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await query(`
    TRUNCATE TABLE
      enquiries,
      post_tags,
      posts,
      tags,
      bio,
      artworks,
      exhibitions,
      series,
      media
    RESTART IDENTITY CASCADE
  `);

  // Media
  const mediaResult = await query(`
  INSERT INTO media (name) VALUES
    ('Etching'),
    ('Drawing')
  RETURNING id, name
`);

  const etching = mediaResult.rows[0];
  const drawing = mediaResult.rows[1];

  // Series
  const seriesResult = await query(`
    INSERT INTO series (name, slug, description) VALUES
      ('Etchings', 'etchings', 'Finished works.'),
      ('Studies',  'studies',  'Process work and studies.')
    RETURNING id, slug
  `);

  const etchings = seriesResult.rows[0];
  const studies = seriesResult.rows[1];

  // Artworks
  await query(
    `
    INSERT INTO artworks
      (title, slug, year, image_url, thumbnail_url, dimensions, description, medium_id, series_id)
    VALUES
      ('Untitled I',   'untitled-i',   2024,
       'https://picsum.photos/seed/art1/800/1000',
       'https://picsum.photos/seed/art1/400/500',
       '30 × 40 cm', NULL, $1, $2),
      ('Untitled II',  'untitled-ii',  2023,
       'https://picsum.photos/seed/art2/800/1000',
       'https://picsum.photos/seed/art2/400/500',
       '30 × 40 cm', NULL, $1, $2),
      ('Untitled III', 'untitled-iii', 2023,
       'https://picsum.photos/seed/art3/800/900',
       'https://picsum.photos/seed/art3/400/450',
       '20 × 30 cm', NULL, $3, $2),
      ('Study I',      'study-i',      2024,
       'https://picsum.photos/seed/art4/600/800',
       'https://picsum.photos/seed/art4/300/400',
       '15 × 20 cm', NULL, $4, $5),
      ('Study II',     'study-ii',     2023,
       'https://picsum.photos/seed/art5/600/800',
       'https://picsum.photos/seed/art5/300/400',
       '15 × 20 cm', NULL, $4, $5)
  `,
    [etching.id, etchings.id, studies.id],
  );

  // Exhibitions
  await query(`
    INSERT INTO exhibitions
      (title, slug, exhibition_type, venue, city, country, description, start_date, end_date)
    VALUES
      ('Recent Works', 'recent-works-2024', 'SOLO',
       'Gallery Name', 'London', 'UK',
       'A selection of new etchings.',
       '2024-09-12', '2024-10-26'),
      ('Summer Exhibition', 'summer-exhibition-2023', 'GROUP',
       'Royal Academy of Arts', 'London', 'UK',
       NULL,
       '2023-06-13', '2023-08-20')
  `);

  // Bio
  await query(`
    INSERT INTO bio (section_type, heading, body, display_order) VALUES
      ('BIO', NULL,
       'Maite Cascón (b. 1991, Madrid) is an artist using metaphorical and figurative images within printmaking and drawing.
        In her process, she reconstructs reality by playing with it through sketches, creating impossible scenes happening simultaneously.
        Psychoanalysis and folk tales are important references. Having been raised in a catholic androcentric country, she explores these subjects looking for answers to conflicts of her close environment and therefore this way she analyzes inherited patterns.
        The topics of her practice are based on the body and death, and different social issues, such as gender, sexuality, violence, the disengagement from nature and the increase of human individualism.',
       1),
      ('CV', 'Education',
       'The Royal College of Art, MA Print, 2017
        University Complutense Madrid, Fine Arts BA (Hons), 2015
        Scholarship Cátedra Francisco de Goya  awarded by University Complutense and Caja Ávila, 2011',
       2),
      ('CV', 'Selected Exhibitions',
       'Woolwich Contemporary Print Fair, London, 2024
        Summer Show, Royal Academy, London, 2024
        Verbatim, London Original Print Fair, Somerset House, London, 2024
        Strange Devotion, Eames Fine Art Collectors' Studio, London, 2024
        Verbatim, London Original Print Fair, Somerset House, London, 2023
        RAMAS / Francisco de Goya / Maite Cascón, Eames Fine Art Print Room, London, 2022
        The Contemporary Young Artist Award, The Biscuit Factory Foundation, Newcastle, 2020
        London Original Print Fair, Royal Academy with Royal Society of Painter-Printmakers, London, 2019
        RE Originals, Bankside Gallery, London, 2019
        Society of Women Artist Exhibition, Mall Galleries, London, 2019
        Woolwich Contemporary Print Fair, London, 2018
        RE Originals, Bankside Gallery, London, 2018
        Society of Women Artist Summer Exhibition, Mall Galleries, London, 2018
        London Original Print Fair, Royal Academy with Royal Society of Painter-Printmakers, London, 2018
        Mini Picture Show, Bankside Gallery, London, 2018
        Royal Society of Painter-Printmakers, Bankside Gallery, London, 2017
        Ingram Collection, The Cello Factory, London, 2017
        Original Print Exhibition, Bankside Gallery, London, 2017
        Society of Women Artist Summer Exhibition, Mall Galleries, London, 2017
        Royal College of Art Final Show, 2017
        Group Exhibition, Multiples, Kings Gate Workshop, London, 2016
        Group Exhibition, Out Put, CGP Gallery, London, 2016
        National Original Print Exhibition, Bankside Gallery, London, 2015
        Group Exhibition Dis Play, CGP Gallery, London, 2015
        Group Exhibition WIP Show, Royal College of Art, London, 2015
        Group Exhibition, Un día en la Casa de Velázquez, Casa de Velázquez Artist Residency, Madrid, 2014',
       3),
      ('CV', 'Awards',
       'Winner Ironbridge Fine Arts Award, 2023
        Winner Ushaw Residency and Acquisition Prize, 2021
        Shortlisted Boodle Hatfield Printmaking Prize, Woolwich Contemporary Print Fair, 2021
        Winner Woolwich Contemporary Print Fair Prize, 2020
        Shortlisted  The Contemporary Young Artist Award, The Biscuit Factory Foundation, 2020
        Selected to be a member of Society of Women Artist Mall Galleries, 2018
        Winner Eames Fine Art Award, Woolwich Contemporary Print Fair, 2018
        Winner Printmaking Today Prize, Royal Society of Painter-Printmakers, 2018
        Winner Thames Side Print Studio, Royal Society of Painter-Printmakers, 2018
        Winner The Gwen May RE Student Prize, Royal Society of Painter-Printmakers, 2017
        Shortlisted for the Young Contemporary Talent Purchase Prize, Ingram Collection, 2017
        Winner Young Artist in any medium Award, Society of Women Artist Exhibition, 2017
        Shortlisted for the Merlin Entertainment Prize, Royal College of Art Final Show, 2017',
       4),
       ('CV', 'Artist Residencies',
       'Ushaw Historic House, Chapels & Gardens Residency, 2022
        London Print Studio, 2018
        La Madriguera, Barcelona, 2020',
       5),
       ('CV', 'Collections',
       'Ushaw Historic House, Chapels & Gardens',
       6),
       ('CV', 'Publications',
       '2018: Artist Eye, Printmaking Today Magazine, Issue 107 Vol 27 no 3
        Autumn 2018',
       7)
  `);

  // Tags
  const tagsResult = await query(`
    INSERT INTO tags (name, slug) VALUES
      ('Press',  'press'),
      ('Studio', 'studio')
    RETURNING id, name
  `);

  const pressTag = tagsResult.rows[0];
  const studioTag = tagsResult.rows[1];

  // Posts
  const postsResult = await query(`
    INSERT INTO posts
      (title, slug, body, excerpt, type, status, published_at)
    VALUES
      ('On the print',
       'on-the-print',
       'TODO: Add post body.',
       'A reflection on etching as a medium.',
       'TEXT', 'PUBLISHED', '2024-03-15'),
      ('New works in progress',
       'new-works-in-progress',
       'TODO: Add post body.',
       'A look at what is currently in the studio.',
       'NEWS', 'PUBLISHED', '2024-06-01')
    RETURNING id
  `);

  const post1 = postsResult.rows[0];
  const post2 = postsResult.rows[1];

  await query(
    `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2), ($3, $4)`,
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
