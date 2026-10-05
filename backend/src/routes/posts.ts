import { Router, Request, Response, NextFunction } from 'express'
import { query } from '../lib/db'

const router = Router()

// GET /api/posts

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query as Record<string, string>

    const conditions = [`p.status = 'PUBLISHED'`]
    const params: unknown[] = []

    if (type) {
      params.push(type)
      conditions.push(`p.type = $${params.length}`)
    }

    const whereClause = conditions.join(' AND ')

    const result = await query(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.cover_image,
        p.type,
        p.status,
        p.published_at,
        p.created_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id = pt.tag_id
      WHERE ${whereClause}
      GROUP BY p.id
      ORDER BY p.published_at DESC
    `, params)

    res.json(result.rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/posts/:slug

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.body,
        p.excerpt,
        p.cover_image,
        p.type,
        p.status,
        p.published_at,
        p.created_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t       ON t.id = pt.tag_id
      WHERE p.slug = $1
      GROUP BY p.id
    `, [req.params.slug])

    const post = result.rows[0]

    if (!post || post.status !== 'PUBLISHED') {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    res.json(post)
  } catch (err) {
    next(err)
  }
})

export default router