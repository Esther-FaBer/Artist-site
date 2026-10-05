import { Router, Request, Response, NextFunction } from 'express'
import { query } from '../lib/db'

const router = Router()

// GET /api/exhibitions

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, isFeatured } = req.query as Record<string, string>

    const conditions: string[] = []
    const params: unknown[]    = []

    if (type) {
      params.push(type)
      conditions.push(`e.type = $${params.length}`)
    }
    if (isFeatured === 'true') {
      conditions.push(`e.is_featured = TRUE`)
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    const result = await query(`
      SELECT
        e.*,
        e.start_date <= NOW() AND e.end_date >= NOW() AS is_currently_on,
        e.start_date > NOW()                          AS is_upcoming
      FROM exhibitions e
      ${whereClause}
      ORDER BY e.start_date DESC
    `, params)

    res.json(result.rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/exhibitions/current

router.get('/current', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT
        e.*,
        e.start_date <= NOW() AND e.end_date >= NOW() AS is_currently_on,
        e.start_date > NOW()                          AS is_upcoming
      FROM exhibitions e
      WHERE e.is_featured = TRUE
      ORDER BY e.start_date DESC
      LIMIT 1
    `)

    const exhibition = result.rows[0]

    if (!exhibition) {
      res.status(404).json({ error: 'No current exhibition found' })
      return
    }

    res.json(exhibition)
  } catch (err) {
    next(err)
  }
})

// GET /api/exhibitions/:slug

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT
        e.*,
        e.start_date <= NOW() AND e.end_date >= NOW() AS is_currently_on,
        e.start_date > NOW()                          AS is_upcoming,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',            a.id,
              'title',         a.title,
              'slug',          a.slug,
              'year',          a.year,
              'image_url',     a.image_url,
              'thumbnail_url', a.thumbnail_url,
              'status',        a.status
            )
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS artworks
      FROM exhibitions e
      LEFT JOIN artwork_exhibitions ae ON ae.exhibition_id = e.id
      LEFT JOIN artworks a             ON a.id = ae.artwork_id
      WHERE e.slug = $1
      GROUP BY e.id
    `, [req.params.slug])

    const exhibition = result.rows[0]

    if (!exhibition) {
      res.status(404).json({ error: 'Exhibition not found' })
      return
    }

    res.json(exhibition)
  } catch (err) {
    next(err)
  }
})

export default router