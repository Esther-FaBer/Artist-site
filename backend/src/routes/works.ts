import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// GET /api/works
router.get("/", async (req, res, next) => {
  try {
    const { page = "1", limit = "20", seriesSlug, search } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (seriesSlug) {
      params.push(seriesSlug);
      conditions.push(`s.slug = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(a.title ILIKE $${params.length} OR a.description ILIKE $${params.length})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query(
      `SELECT COUNT(*) FROM artworks a
       LEFT JOIN series s ON s.id = a.series_id
       ${whereClause}`,
      params,
    );

    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limitNum);
    params.push(offset);

    const result = await query(
      `SELECT
         a.id,
         a.title,
         a.slug,
         a.year,
         a.image_url,
         a.thumbnail_url,
         a.dimensions,
         a.description,
         JSON_BUILD_OBJECT('id', m.id, 'name', m.name) AS medium,
         JSON_BUILD_OBJECT(
           'id', s.id, 'name', s.name, 'slug', s.slug,
           'description', s.description, 'cover_image', s.cover_image
         ) AS series
       FROM artworks a
       LEFT JOIN media m  ON m.id = a.medium_id
       LEFT JOIN series s ON s.id = a.series_id
       ${whereClause}
       ORDER BY a.year DESC, a.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    res.json({
      data: result.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/works/series
router.get("/series", async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT
         s.id,
         s.name,
         s.slug,
         s.description,
         s.cover_image,
         COUNT(a.id)::int AS artwork_count
       FROM series s
       LEFT JOIN artworks a ON a.series_id = s.id
       GROUP BY s.id
       ORDER BY s.name ASC`,
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/works/media
router.get("/media", async (_req, res, next) => {
  try {
    const result = await query(`SELECT * FROM media ORDER BY name ASC`);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/works/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const result = await query(
      `SELECT
         a.id,
         a.title,
         a.slug,
         a.year,
         a.image_url,
         a.thumbnail_url,
         a.dimensions,
         a.description,
         JSON_BUILD_OBJECT('id', m.id, 'name', m.name) AS medium,
         JSON_BUILD_OBJECT(
           'id', s.id, 'name', s.name, 'slug', s.slug,
           'description', s.description, 'cover_image', s.cover_image
         ) AS series
       FROM artworks a
       LEFT JOIN media m  ON m.id = a.medium_id
       LEFT JOIN series s ON s.id = a.series_id
       WHERE a.slug = $1
       GROUP BY a.id, m.id, s.id`,
      [req.params.slug],
    );

    const work = result.rows[0];
    if (!work) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(work);
  } catch (err) {
    next(err);
  }
});

export default router;
