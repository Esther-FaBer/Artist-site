import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/posts

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query as Record<string, string>

    const where = {
      status: 'PUBLISHED' as const,
      ...(type && { type: type as any }),
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: { tags: true },

    })

    const postsWithoutBody = posts.map(({ body: _body, ...post }) => post)

    res.json(postsWithoutBody)
  } catch (err) {
    next(err)
  }
})

// GET /api/posts/:slug

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: { tags: true },
    })

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
