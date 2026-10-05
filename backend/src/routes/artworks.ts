import { Router, Request, Response, NextFunction } from 'express'
import { query } from '../lib/db'

const router = Router()

// GET /api/artworks

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      pageSize = '20',
      seriesSlug,
      status,
      isFeatured,
      search,
    } = req.query as Record<string, string>

    const pageNum     = parseInt(page, 10)
    const pageSizeNum = parseInt(pageSize, 10)
    const offset      = (pageNum - 1) * pageSizeNum

    const conditions: string[] = []
    const params: unknown[]    = []

    if (seriesSlug) {
      params.push(seriesSlug)
      conditions.push(`s.slug = $${params.length}`)
    }
    if (status) {
      params.push(status)
      conditions.push(`a.status = $${params.length}`)
    }
    if (isFeatured === 'true') {
      conditions.push(`a.is_featured = TRUE`)
    }
    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(a.title ILIKE $${params.length} OR a.description ILIKE $${params.length})`)
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : ''


    const countResult = await query(`
      SELECT COUNT(*) FROM artworks a
      LEFT JOIN series s ON s.id = a.series_id
      ${whereClause}
    `, params)

    const total = parseInt(countResult.rows[0].count, 10)

    params.push(pageSizeNum)
    params.push(offset)

    const result = await query(`
      SELECT
        a.*,
        JSON_BUILD_OBJECT('id', m.id, 'name', m.name) AS medium,
        JSON_BUILD_OBJECT(
          'id', s.id, 'title', s.title, 'slug', s.slug
        ) AS series
      FROM artworks a
      LEFT JOIN media m  ON m.id = a.medium_id
      LEFT JOIN series s ON s.id = a.series_id
      ${whereClause}
      ORDER BY a.year DESC, a.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params)

    res.json({
      results:    result.rows,
      total,
      page:       pageNum,
      pageSize:   pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum),
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/artworks/series

router.get('/series', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT
        s.*,
        COUNT(a.id)::int AS artwork_count
      FROM series s
      LEFT JOIN artworks a ON a.series_id = s.id
      GROUP BY s.id
      ORDER BY s.title ASC
    `)
    res.json(result.rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/artworks/media

router.get('/media', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT * FROM media ORDER BY name ASC
    `)
    res.json(result.rows)
  } catch (err) {
    next(err)
  }
})

//GET /api/artworks/:slug

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT
        a.*,
        JSON_BUILD_OBJECT('id', m.id, 'name', m.name) AS medium,
        JSON_BUILD_OBJECT(
          'id', s.id, 'title', s.title, 'slug', s.slug
        ) AS series,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', e.id, 'title', e.title, 'slug', e.slug,
              'venue_name', e.venue_name, 'start_date', e.start_date
            )
          ) FILTER (WHERE e.id IS NOT NULL),
          '[]'
        ) AS exhibitions
      FROM artworks a
      LEFT JOIN media m       ON m.id = a.medium_id
      LEFT JOIN series s      ON s.id = a.series_id
      LEFT JOIN artwork_exhibitions ae ON ae.artwork_id = a.id
      LEFT JOIN exhibitions e ON e.id = ae.exhibition_id
      WHERE a.slug = $1
      GROUP BY a.id, m.id, s.id
    `, [req.params.slug])

    const artwork = result.rows[0]

    if (!artwork) {
      res.status(404).json({ error: 'Artwork not found' })
      return
    }

    res.json(artwork)
  } catch (err) {
    next(err)
  }
})

export default router